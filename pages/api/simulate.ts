# Recreate fixed project with 405 fix and full working frontend/backend setup

# Update simulate.ts with method check
simulate_ts_fixed = """import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

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
"""

# Save updated API file
with open(f"/mnt/data/{project_name}/pages/api/simulate.ts", "w") as f:
    f.write(simulate_ts_fixed)

# Recreate the zip with the full corrected content
zip_path_full_fixed = f"/mnt/data/{project_name}_full_fixed.zip"
with zipfile.ZipFile(zip_path_full_fixed, 'w') as zipf:
    for foldername, subfolders, filenames in os.walk(f"/mnt/data/{project_name}"):
        for filename in filenames:
            file_path = os.path.join(foldername, filename)
            arcname = os.path.relpath(file_path, f"/mnt/data")
            zipf.write(file_path, arcname)

zip_path_full_fixed

