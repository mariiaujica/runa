'use client'
import { useState } from 'react'

// accept the callback prop from parent
export default function ExpenseInput({
  onExpenseAdded,
}: {
  onExpenseAdded: () => void
}) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory]=useState('')
  const [recording, setRecording]=useState(false)

  const startListening=()=>{
    //check if browser even supports it
    const SpeechRecognition=
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if(!SpeechRecognition) {
        alert('Sorry, your browser does not support speech recognition.')
        return
    }
    const recognition=new SpeechRecognition()
    recognition.lang='en-US'
    recognition.interimResults=false
    recognition.maxAlternatives=1

    recognition.start()
    setRecording(true)

    recognition.onresult=(event:any)=>{
        const transcript=event.results [0][0].transcript
        console.log('Heard:',transcript)
        setDescription(transcript)
        setRecording(false)

    }

    recognition.onerror=(err:any)=>{
        console.error('SPeech recognition error:', err)
        setRecording(false)
    }
    recognition.onend=()=>setRecording(false)
  }

  //submit to backend

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
        onExpenseAdded() // tell parent to refresh
      }
    } catch (err) {
      console.error('Error adding expense:', err)
    }

    // Clear form after submission
    setAmount('')
    setDescription('')
    setCategory('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-600"
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
        <div className="flex gap-2">
    <input
      id="description"
      type="text"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Coffee at Starbucks"
      required
      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-600"
    />
    {/* 🎤 NEW mic button */}
    <button
      type="button"
      onClick={startListening}
      className={`px-3 rounded-lg ${recording ? 'bg-red-600' : 'bg-amber-600'} text-white`}
    >
      {recording ? '🎙️...' : '🎤'}
    </button>
  </div>

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
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-600"
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
