import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const message = req.body.message;
  // speakerはkoeiromapのspeakerX,Y,styleから変換するか、固定値にする
  // ここでは簡単のため、リクエストボディからspeakerIdを受け取る
  const speakerId = req.body.speakerId || 1; // デフォルトは「ずんだもん」

  // Docker Composeネットワーク内のVOICEVOXエンジンにアクセス
  const voicevoxUrl = "http://voicevox:50021";

  try {
    // 1. audio_query APIで音声合成用のクエリを作成
    const audioQueryResponse = await fetch(
      `${voicevoxUrl}/audio_query?speaker=${speakerId}&text=${encodeURIComponent(message)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!audioQueryResponse.ok) {
      throw new Error(`Failed to get audio query: ${await audioQueryResponse.text()}`);
    }
    const audioQuery = await audioQueryResponse.json();

    // 2. synthesis APIでWAVデータを生成
    const synthesisResponse = await fetch(
      `${voicevoxUrl}/synthesis?speaker=${speakerId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(audioQuery),
      }
    );

    if (!synthesisResponse.ok) {
      throw new Error(`Failed to synthesize voice: ${await synthesisResponse.text()}`);
    }

    // 3. クライアントにWAVデータを返す
    const audioWavArrayBuffer = await synthesisResponse.arrayBuffer();
    const audioWavBuffer = Buffer.from(audioWavArrayBuffer);

    res.setHeader("Content-Type", "audio/wav");
    res.status(200).send(audioWavBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error synthesizing voice" });
  }
}