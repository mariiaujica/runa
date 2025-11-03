import mongoose from 'mongoose'

const ExpenseSchema= new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    category:{
        type:String,
        default:'Uncategorized',
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
})
//Check if exists, othersie create
const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema)

export default Expense