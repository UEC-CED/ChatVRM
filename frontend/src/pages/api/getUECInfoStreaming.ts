import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message } = req.query;

  if (typeof message !== 'string') {
    res.status(400).json({ error: 'Invalid message' });
    return;
  }

  try {
    const response = await fetch(`http://uec_qa:12344/questionStreaming?question_sentence=${encodeURIComponent(message)}`);

    if (!response.ok) {
      res.status(response.status).json({ error: 'Failed to fetch from backend' });
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      res.status(500).json({ error: 'Failed to get reader from response body' });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const decoder = new TextDecoder('utf-8');

    async function processStream() {
      let done, value;
      while (true) {
        ({ done, value } = await reader.read());
        if (done) break;
        const data = decoder.decode(value, { stream: true });
        res.write(data);
        res.flush();  // 即時送信を確保する
      }
      res.end();
    }

    await processStream();

  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
