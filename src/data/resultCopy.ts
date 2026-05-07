export function getResultCopy(score: number): string {
  if (score >= 90) return 'A match made in heaven. Seriously, call me.'
  if (score >= 75) return 'Strong chemistry. I think we should meet.'
  if (score >= 60) return "There's definitely something here. Worth finding out."
  if (score >= 40) return "Some sparks, some friction. Honestly - those can go either way."
  if (score >= 20) return "I like you, but I'm not sure we'd make each other happy."
  return "Not this time. But I respect that you checked."
}
