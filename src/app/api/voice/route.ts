import { NextResponse } from "next/server"
import { parseVoiceToExpenses } from "@/lib/voiceParse"

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json() as { transcript?: string }

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "Missing transcript" },
        { status: 400 }
      )
    }

    const expenses = await parseVoiceToExpenses(transcript)

    return NextResponse.json(
      { ok: true, expenses },
      { status: 200 }
    )
  } catch (err) {
    console.error("Voice expense parse error:", err)
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    )
  }
}