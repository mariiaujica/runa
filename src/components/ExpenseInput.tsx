'use client'
import { useState, useRef } from 'react'

// Accept callback from parent
export default function ExpenseInput({
  onExpenseAdded,
}: {
  onExpenseAdded: () => void
}) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [recording, setRecording] = useState(false)

  // 🔥 ADDED: store recognition instance
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // 🔥 ADDED: stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setRecording(false)
  }

  // speech recognition setup
  const startListening = () => {
    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognitionConstructor) {
      alert('Sorry, your browser does not support speech recognition.')
      return
    }

    // 🔥 create recognition and save to ref
    const recognition = new SpeechRecognitionConstructor()
    recognitionRef.current = recognition

    let finalTranscript = '' // 🔥 ADDED

    recognition.lang = 'en-US'
    recognition.interimResults = true // 🔥 continuous speech
    recognition.continuous = true // 🔥 keeps listening through pauses
    recognition.maxAlternatives = 1

    recognition.start()
    setRecording(true)

    // 🔥 NEW continuous mode logic
    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' '
        }
      }

      // live preview
      setDescription(finalTranscript.trim())
    }

    // When user STOPS speaking (or presses Stop)
    recognition.onend = async () => {
      setRecording(false)

      if (!finalTranscript.trim()) return

      // send full transcript to AI backend
      try {
        const aiRes = await fetch('/api/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: finalTranscript }),
        })

        const data = await aiRes.json()
        console.log('AI Parsed:', data)

        if (data.ok && Array.isArray(data.expenses)) {
          for (const exp of data.expenses) {
            await fetch('/api/expenses', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(exp),
            })
          }
          onExpenseAdded()
          //Reset inputs after voice mode finishes
          setAmount('')
          setDescription('')
          setCategory('')
        }
      } catch (err) {
        console.error('Error sending voice transcript:', err)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      setRecording(false)
    }
  }

  // manual submit for typing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description, category }),
      })

      const data = await res.json()
      if (data.ok) {
        onExpenseAdded()
      }
    } catch (err) {
      console.error('Error adding expense:', err)
    }

    setAmount('')
    setDescription('')
    setCategory('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* 🎤 ONE MIC BUTTON FOR THE WHOLE INPUT */}
      <button
        type="button"
        onClick={recording ? stopListening : startListening}
        className={`px-3 rounded-lg ${
          recording ? 'bg-red-600' : 'bg-amber-600'
        } text-white`}
      >
        {recording ? '🛑 Stop' : '🎤 Talk'}
      </button>

      {/* Amount input */}
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Amount
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="20.00"
          required
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100"
        />
      </div>

      {/* Description input */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          What was it for?
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Coffee at Starbucks"
          required
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100"
        />
      </div>

      {/* Category input */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Category
        </label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Food, Transport, etc..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        Log Expense
      </button>
    </form>
  )
}
