import OpenAI from "openai"

export interface ParsedExpense {
  amount: number
  description: string
  category?: string
  date?: string
}

// TURN natural language ("yesterday", "two days ago") INTO an ISO date
function parseNaturalDate(input: string): string {
  const now = new Date()
  const t = (input ?? "").toLowerCase().trim()

  if (!t) return now.toISOString()

  // yesterday
  if (t === "yesterday") {
    const d = new Date(now)
    d.setDate(now.getDate() - 1)
    return d.toISOString()
  }

  // N days ago
  const daysAgo = t.match(/(\d+)\s+days?\s+ago/)
  if (daysAgo) {
    const amount = Number(daysAgo[1])
    const d = new Date(now)
    d.setDate(now.getDate() - amount)
    return d.toISOString()
  }

  // weekdays: "on monday"
  const weekdays = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
  for (let i = 0; i < weekdays.length; i++) {
    if (t.includes("on " + weekdays[i])) {
      const d = new Date(now)
      const today = now.getDay()
      let diff = today - i
      if (diff <= 0) diff += 7
      d.setDate(now.getDate() - diff)
      return d.toISOString()
    }
  }

  // direct ISO
  const iso = t.match(/\d{4}-\d{2}-\d{2}/)
  if (iso) return new Date(iso[0]).toISOString()

  // default = today
  return now.toISOString()
}

export async function parseVoiceToExpenses(text: string): Promise<ParsedExpense[]> {
  const cleaned = text.trim()
  if (!cleaned) return []

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY")
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const prompt = `
The user described their spending in natural language.

Extract an ARRAY of expenses. Each expense must include:
- amount: number
- description: short text
- category: one of [Food, Transport, Shopping, Bills, Entertainment, Health, Other]
- date: natural or ISO (examples: "yesterday", "two days ago", "2025-01-03", "on monday")

Return ONLY JSON. No extra text.

Input:
"${cleaned}"
  `

  const response = await client.responses.create({
    model: "gpt-3.5-turbo",
    input: prompt,
  })

    const output = response.output_text ?? ""

  // Extract JSON safely using regex
  const jsonMatch = output.match(/\[[\s\S]*\]|\{[\s\S]*\}/)

  if (!jsonMatch) {
    console.error("AI did not return JSON:", output)
    return []
  }

  let parsed: ParsedExpense[] = []

  try {
    parsed = JSON.parse(jsonMatch[0])
  } catch (err) {
    console.error("JSON parsing failed:", err, "raw:", jsonMatch[0])
    return []
  }

  return parsed
    .map((e) => ({
      amount: typeof e.amount === "string" ? Number(e.amount) : e.amount,
      description: String(e.description ?? "").trim(),
      category: e.category ?? "Other",
      date: parseNaturalDate(e.date ?? ""),
    }))
    .filter((e) => Number.isFinite(e.amount) && e.description.length > 0)

}
