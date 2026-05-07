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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const payload = req.body as SubmitPayload
  const { userName, companyName, email, fitScore, answers, submittedAt } = payload

  const databaseId = process.env.NOTION_DATABASE_ID
  const notificationEmail = process.env.NOTIFICATION_EMAIL

  if (!databaseId || !notificationEmail) {
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

    await resend.emails.send({
      from: 'Match Check <noreply@matchcheck.app>',
      to: notificationEmail,
      subject: `New Match Check result: ${companyName} - ${fitScore}%`,
      text: [
        `Name: ${userName}`,
        `Company: ${companyName}`,
        `Email: ${email}`,
        `Fit score: ${fitScore}%`,
        `Submitted: ${submittedAt}`,
        ``,
        `Notion: ${notionUrl}`,
      ].join('\n'),
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Submit error:', err)
    return res.status(500).json({ error: 'Submission failed' })
  }
}
