import ExpenseInput from '@/components/ExpenseInput'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Runa</h1>
        <ExpenseInput />
      </div>
    </main>
  )
}