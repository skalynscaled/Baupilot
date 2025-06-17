import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({ apiKey: 'DUMMY_KEY' });
const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { beschreibung } = req.body as { beschreibung: string };
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein Assistent für Bauunternehmen und erstellst Arbeitspläne und Materiallisten.'
        },
        {
          role: 'user',
          content: `Projektbeschreibung: ${beschreibung}. Erstelle einen zeitlich geordneten Arbeitsplan und eine Materialliste. Antworte im Format JSON mit den Feldern arbeitsplan und materialien.`
        },
      ],
      temperature: 0.5,
    });

    const text = completion.data.choices[0].message?.content || '{}';
    const json = JSON.parse(text);
    res.status(200).json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler bei der Generierung' });
  }
}
