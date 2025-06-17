import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [beschreibung, setBeschreibung] = useState('');
  const [result, setResult] = useState<{arbeitsplan: string[]; materialien: string[]}>();
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ beschreibung }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>BauPilot</title>
      </Head>
      <h1 className="text-2xl font-bold mb-4">BauPilot</h1>
      <textarea
        className="w-full border p-2 mb-4"
        rows={4}
        value={beschreibung}
        onChange={(e) => setBeschreibung(e.target.value)}
        placeholder="Projektbeschreibung eingeben..."
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={generatePlan}
        disabled={loading}
      >
        {loading ? 'Generiere...' : 'Plan generieren'}
      </button>
      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Arbeitsplan</h2>
          <ol className="list-decimal list-inside">
            {result.arbeitsplan.map((schritt, idx) => (
              <li key={idx}>{schritt}</li>
            ))}
          </ol>
          <h2 className="text-xl font-semibold mt-4">Materialliste</h2>
          <ul className="list-disc list-inside">
            {result.materialien.map((mat, idx) => (
              <li key={idx}>{mat}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
