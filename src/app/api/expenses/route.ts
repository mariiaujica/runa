import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";

export async function POST(req: Request) {
    try{
        await connectDB();

        //read json body {amount description}
        const body = await req.json();

        //extract and normalize fields
        const amountRaw = body?.amount; //could be number or string
        const description = (body?.description ?? "") //coerce to string then trim spaces
            .toString()
            .trim();
        
        const category = body?.category
        ? String(body.category).trim()
        :"Uncategorized";

        //Coerce amount to number if it came as a string
        const amount = typeof amountRaw === "string" ? parseFloat(amountRaw) : amountRaw;

        //minimal validation
        if (typeof amount !== "number" || !isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Amount must be a number > 0" }, { status: 400 });
        }
        if (description.length === 0) {
        return NextResponse.json({ error: "Description is required" }, { status: 400 });
        }

        //save to mongo using mongoose model
        const doc= await Expense.create({
            amount,
            description,
            category,
        });

        //return the created doc with http 201
        return NextResponse.json({ ok: true,expense:doc}, {status:201});
    } catch (err) {
        console.error("Create expense error:", err);
        return NextResponse.json({error:"Server error"},{status:500});
    }
    }
export async function GET(){
    try{

    //connect to database
    await connectDB()

    //fetch all expenses from db
    const expenses=await Expense.find().sort({createdAt:-1}).exec();

    //return them as json
    return NextResponse.json({ ok:true,expenses},{status:200})
} catch(err){
    console.error('Get expenses error:',err)
    return NextResponse.json(
        {ok:false, error:'Failed to load expenses'},
        {status:500}
    )
}

}

