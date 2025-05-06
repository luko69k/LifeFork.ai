import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { situation, optionA, optionB, priorities } = req.body

  const prompt = `
Pomôž používateľovi rozhodnúť sa medzi dvoma životnými možnosťami.
Situácia: ${situation}
Možnosť A: ${optionA}
Možnosť B: ${optionB}
Prioritné hodnoty: ${priorities.join(", ")}

Popíš dopady pre každú možnosť podľa:
- Finančnej situácie
- Psychiky
- Vzťahov
- Osobného rastu
Zhrň predpokladané pocity po 6 mesiacoch.

Odpoveď v JSON formáte s kľúčmi: "A", "B", "summary"
`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  })

  const output = completion.choices[0].message.content
  res.status(200).json({ result: output })
}
