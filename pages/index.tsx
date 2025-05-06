import { useState } from 'react'

export default function Home() {
  const [situation, setSituation] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [priorities, setPriorities] = useState<string[]>([])
  const [result, setResult] = useState('')

  const handleSubmit = async () => {
    const res = await fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ situation, optionA, optionB, priorities }),
    })
    const data = await res.json()
    setResult(data.result)
  }

  const handleCheckbox = (value: string) => {
    setPriorities(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>LifeFork.ai – Simulácia rozhodnutí</h1>
      <textarea placeholder="Tvoja situácia..." value={situation} onChange={e => setSituation(e.target.value)} />
      <input placeholder="Možnosť A" value={optionA} onChange={e => setOptionA(e.target.value)} />
      <input placeholder="Možnosť B" value={optionB} onChange={e => setOptionB(e.target.value)} />
      <div>
        <label><input type="checkbox" onChange={() => handleCheckbox('Financie')} /> Financie</label>
        <label><input type="checkbox" onChange={() => handleCheckbox('Psychika')} /> Psychika</label>
        <label><input type="checkbox" onChange={() => handleCheckbox('Vzťahy')} /> Vzťahy</label>
        <label><input type="checkbox" onChange={() => handleCheckbox('Sebarozvoj')} /> Sebarozvoj</label>
      </div>
      <button onClick={handleSubmit}>Simuluj</button>
      <pre>{result}</pre>
    </div>
  )
}
