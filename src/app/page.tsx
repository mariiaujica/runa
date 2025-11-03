'use client'
import ExpenseInput from '@/components/ExpenseInput'
import ExpenseList from '@/components/ExpenseList'
import{useState} from 'react'

export default function Home() {
  const[refreshKey,setRefreshKey]=useState(0)
  const handleExpenseAdded=()=>{
    setRefreshKey((prev) =>prev+1)
  }
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Runa</h1>
        <ExpenseInput onExpenseAdded={handleExpenseAdded}/>
        <div className="mt-12">
          <ExpenseList refreshKey={refreshKey}/>
        </div>
      </div>
    </main>
  )
}