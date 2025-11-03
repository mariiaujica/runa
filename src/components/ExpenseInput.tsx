'use client'
import { useState } from 'react'

export default function ExpenseInput(){
    // State to store what the user types
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')

    //Function that runs when they submit form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault() //Stops page from refreshing

        console.log({ amount,description })

        //Clear form
        setAmount('')
        setDescription('')
    }
     
    return(
        <form onSubmit={handleSubmit} className="space-y-4">
            {/*AMount input*/}
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-2">
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
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                What was it for?
                </label>
                <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Coffee at Starbucks"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
            </div>

            {/*Submit button*/}
            <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
                Log Expense
            </button>
        </form>
    )
}