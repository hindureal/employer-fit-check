import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Client } from '@notionhq/client'
import { Resend } from 'resend'

interface SubmitPayload {
  userName: string
  companyName: string
  email: string
  fitScore: number
  answers: Record<string, number>
  submittedAt: string
}

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const resend = new Resend(process.env.RESEND_API_KEY)

function getResultCopy(score: number): string {
  if (score >= 90) return 'A match made in heaven. Seriously, call me.'
  if (score >= 75) return 'Strong chemistry. I think we should meet.'
  if (score >= 60) return "There's definitely something here. Worth finding out."
  if (score >= 40) return "Some sparks, some friction. Honestly - those can go either way."
  if (score >= 20) return "I like you, but I'm not sure we'd make each other happy."
  return "Not this time. But I respect that you checked."
}

function notificationHtml(params: {
  userName: string
  companyName: string
  email: string
  fitScore: number
  submittedDate: string
  notionUrl: string
}): string {
  const { userName, companyName, email, fitScore, submittedDate, notionUrl } = params
  const scoreColor = fitScore >= 75 ? '#7C3AED' : fitScore >= 50 ? '#b45309' : '#C2563E'

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#1a1a18;font-family:'DM Sans',Helvetica,Arial,sans-serif;color:#faf9f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a18;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <tr><td style="padding-bottom:32px;">
          <p style="margin:0;font-size:13px;color:rgba(250,249,246,0.4);letter-spacing:0.05em;">${fromName} - Match Check</p>
        </td></tr>

        <tr><td style="padding-bottom:32px;border-bottom:1px solid rgba(250,249,246,0.1);">
          <p style="margin:0 0 8px;font-size:14px;color:rgba(250,249,246,0.5);">Fit score</p>
          <p style="margin:0;font-size:72px;font-weight:700;line-height:1;color:${scoreColor};">${fitScore}%</p>
        </td></tr>

        <tr><td style="padding:32px 0;border-bottom:1px solid rgba(250,249,246,0.1);">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-bottom:16px;width:120px;font-size:13px;color:rgba(250,249,246,0.4);vertical-align:top;">Name</td>
              <td style="padding-bottom:16px;font-size:15px;color:#faf9f6;vertical-align:top;">${userName}</td>
            </tr>
            <tr>
              <td style="padding-bottom:16px;font-size:13px;color:rgba(250,249,246,0.4);vertical-align:top;">Company</td>
              <td style="padding-bottom:16px;font-size:15px;color:#faf9f6;vertical-align:top;">${companyName}</td>
            </tr>
            <tr>
              <td style="padding-bottom:16px;font-size:13px;color:rgba(250,249,246,0.4);vertical-align:top;">Email</td>
              <td style="padding-bottom:16px;font-size:15px;vertical-align:top;"><a href="mailto:${email}" style="color:#7C3AED;text-decoration:none;">${email}</a></td>
            </tr>
            <tr>
              <td style="font-size:13px;color:rgba(250,249,246,0.4);vertical-align:top;">Submitted</td>
              <td style="font-size:15px;color:#faf9f6;vertical-align:top;">${submittedDate}</td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding-top:32px;">
          <a href="${notionUrl}" style="display:inline-block;background:#7C3AED;color:#faf9f6;text-decoration:none;font-size:15px;font-weight:500;padding:14px 28px;border-radius:999px;">View in Notion</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function userHtml(params: {
  userName: string
  companyName: string
  fitScore: number
  calendarUrl: string
}): string {
  const { userName, companyName, fitScore, calendarUrl } = params
  const resultCopy = getResultCopy(fitScore)
  const barFillPx = Math.round(fitScore * 2)
  const barEmptyPx = 200 - barFillPx

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#1a1a18;font-family:'DM Sans',Helvetica,Arial,sans-serif;color:#faf9f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a18;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Wordmark -->
        <tr><td style="padding-bottom:40px;">
          <p style="margin:0;font-size:13px;color:rgba(250,249,246,0.4);letter-spacing:0.05em;">${fromName} - Match Check</p>
        </td></tr>

        <!-- Greeting -->
        <tr><td style="padding-bottom:32px;">
          <h1 style="margin:0;font-family:'DM Serif Display',Georgia,serif;font-size:36px;font-weight:400;line-height:1.2;color:#faf9f6;">Hi ${userName},</h1>
        </td></tr>

        <!-- Subline -->
        <tr><td style="padding-bottom:40px;border-bottom:1px solid rgba(250,249,246,0.1);">
          <p style="margin:0;font-size:16px;color:rgba(250,249,246,0.5);line-height:1.6;">Here's how <span style="color:#faf9f6;">${companyName}</span> scored on the Match Check - an honest fit assessment against ${fromName}'s actual preferences on culture, leadership, and org design.</p>
        </td></tr>

        <!-- Score + bar -->
        <tr><td style="padding:40px 0;border-bottom:1px solid rgba(250,249,246,0.1);">
          <table cellpadding="0" cellspacing="0">
            <tr>

              <!-- Fit bar -->
              <td valign="bottom" style="padding-right:28px;">
                <p style="margin:0 0 12px;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(250,249,246,0.3);font-family:'DM Sans',Helvetica,Arial,sans-serif;">fit score</p>
                <div style="width:8px;height:200px;background:rgba(250,249,246,0.08);border-radius:999px;overflow:hidden;">
                  <div style="width:8px;height:${barEmptyPx}px;font-size:0;line-height:0;">&nbsp;</div>
                  <div style="width:8px;height:${barFillPx}px;background:linear-gradient(to top, #C2563E, #7C3AED);font-size:0;line-height:0;">&nbsp;</div>
                </div>
              </td>

              <!-- Score number + copy -->
              <td valign="bottom">
                <p style="margin:0 0 4px;font-family:'DM Serif Display',Georgia,serif;font-size:80px;font-weight:400;line-height:1;color:#faf9f6;">${fitScore}<span style="font-size:40px;color:rgba(250,249,246,0.5);">%</span></p>
                <p style="margin:0;font-family:'DM Serif Display',Georgia,serif;font-size:22px;font-weight:400;line-height:1.3;color:#faf9f6;">${resultCopy}</p>
              </td>

            </tr>
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding-top:40px;padding-bottom:16px;">
          <p style="margin:0 0 24px;font-size:15px;color:rgba(250,249,246,0.5);line-height:1.6;">Want to dig into the results or just have a conversation? Book a slot directly.</p>
          <a href="${calendarUrl}" style="display:inline-block;background:#7C3AED;color:#faf9f6;text-decoration:none;font-size:15px;font-weight:500;padding:16px 32px;border-radius:999px;font-family:'DM Sans',Helvetica,Arial,sans-serif;">Schedule a call with ${fromName} &rarr;</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:40px;margin-top:40px;border-top:1px solid rgba(250,249,246,0.08);">
          <p style="margin:0;font-size:13px;color:rgba(250,249,246,0.3);line-height:1.6;">You're receiving this because you completed the Match Check. Simply reply to this email if you'd like to reach ${fromName} directly.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const payload = req.body as SubmitPayload
  const { userName, companyName, email, fitScore, answers, submittedAt } = payload

  const databaseId = process.env.NOTION_DATABASE_ID
  const notificationEmail = process.env.NOTIFICATION_EMAIL
  const fromEmail = process.env.FROM_EMAIL
  const fromName = process.env.FROM_NAME
  const calendarUrl = process.env.VITE_CALENDAR_URL ?? '#'

  if (!databaseId || !notificationEmail || !fromEmail || !fromName) {
    return res.status(500).json({ error: 'Missing environment variables' })
  }

  const questionIds = [
    'C1Q1','C1Q2','C1Q3','C1Q4',
    'C2Q2','C2Q3','C2Q4','C2Q5',
    'C3Q2','C3Q3','C3Q4','C3Q5',
    'C4Q1','C4Q2','C4Q3','C4Q5',
  ]

  const answerProperties: Record<string, { number: number }> = {}
  for (const qId of questionIds) {
    answerProperties[`${qId} answer`] = { number: answers[qId] ?? 0 }
  }

  try {
    const notionPage = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: { title: [{ text: { content: userName } }] },
        Company: { rich_text: [{ text: { content: companyName } }] },
        Email: { email },
        'Overall fit score': { number: fitScore },
        'Submission date': { date: { start: submittedAt } },
        ...answerProperties,
      },
    })

    const notionUrl = `https://notion.so/${notionPage.id.replace(/-/g, '')}`
    const submittedDate = new Date(submittedAt).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
    })

    await Promise.all([
      // Notification to author
      resend.emails.send({
        from: `Match Check <${fromEmail}>`,
        to: notificationEmail,
        replyTo: `${userName} <${email}>`,
        subject: `New Match Check result: ${companyName} - ${fitScore}%`,
        html: notificationHtml({ userName, companyName, email, fitScore, submittedDate, notionUrl }),
      }),
      // Results to the user
      resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: email,
        replyTo: notificationEmail,
        subject: `${userName}, here's your Match Check result`,
        html: userHtml({ userName, companyName, fitScore, calendarUrl }),
      }),
    ])

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Submit error:', err)
    return res.status(500).json({ error: 'Submission failed' })
  }
}
