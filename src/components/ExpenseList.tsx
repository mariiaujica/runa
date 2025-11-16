'use client'
import {useEffect, useState} from 'react'

type Expense={
    _id:string
    amount:number
    description:string
    category:string
    createdAt:string
}

export default function ExpenseList({ refreshKey }: { refreshKey: number }) {
    const[expenses, setExpenses]=useState<Expense[]>([])
    const [loading,setLoading]=useState(true)

    useEffect(()=>{
        async function  fetchExpenses(){
        try{
            const res =await fetch('/api/expenses')
            const data =await res.json()
            if (data.ok) setExpenses(data.expenses)
        } catch (err){
    console.error('error loading expenses:', err)
        }finally{
    setLoading(false)
}
}
fetchExpenses()
    },[refreshKey])
    if (loading)
        return <p className="text-slate-400">Loading...</p>

    if(expenses.length===0)
        return <p className="text-slate-400">No expenses yet.</p>

    async function handleDelete(id:string){
        if(!confirm('Delete this expense?')) return

    try{
        const res=await fetch('/api/expenses',{
            method:'DELETE',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({id}),
        })
    const data=await res.json()
    if(data.ok){
        //remove it from local list without refreshing
        setExpenses((prev)=>prev.filter((e)=>e._id!==id))
    }
}catch(err){
    console.error('Delete failed:',err)
    }
    }

    return (
        <div className="space-y-4">
            {expenses.map((exp)=>(
                <div
                key={exp._id}
                className="border border-slate-800 bg-slate-900 rounded-xl p-4 flex justify-between"
                >
        <div className="text-amber-400 font-semibold text-lg w-24 text-left">
            {Number(exp.amount).toFixed(2)} kr           
        </div>    
        <div className="flex-1">
            <p className="font-medium text-slate-100">{exp.description}</p>
            <p className="text-sm text-slate-500">{exp.category}</p>
            </div>
            {/*Delete btn*/}
            <button
            onClick={()=>handleDelete(exp._id)}
            className="text-slate-100 hover:text-amber-400 text-sm"
            >
                Delete
            </button>
            </div>
            ))}
        </div>
    )

}