import OpenAI from "openai"

const client=new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
})

export async function categorizeExpense(description:string): Promise<string> {
    try{
        //prompt to gpt
        const prompt = `
      Categorize this expense based on description into one short label.
      Example categories: Food, Transport, Shopping, Bills, Fun, Other.
      Description: "${description}"
      Respond with only one word.
    `
    const res=await client.responses.create({
        model: "gpt-3.5-turbo",
        input:prompt,
    })


    const output = res.output_text?.trim() || "Other"
    return output
    }catch(err){
            console.error("AI categorization error:",err)
            return "Other"
        }
    }
