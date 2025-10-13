import { reduceTalkStyle } from "@/utils/reduceTalkStyle";
import { koeiromapV0 } from "../koeiromap/koeiromap";
import { TalkStyle } from "../messages/messages";

export async function synthesizeVoice(
  message: string,
  speakerX: number,
  speakerY: number,
  style: TalkStyle
) {
  const koeiroRes = await koeiromapV0(message, speakerX, speakerY, style);
  return { audio: koeiroRes.audio };
}

export async function synthesizeVoiceApi(
  message: string,
  speakerX: number,
  speakerY: number,
  style: TalkStyle,
) {
  // Free向けに感情を制限する
  const reducedStyle = reduceTalkStyle(style);

  const body = {
    message: message,
    speakerX: speakerX,
    speakerY: speakerY,
    style: reducedStyle,
  };

  const res = await fetch("/ced-iot/api/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as any;

  return { audio: data.audio };
}


// voicevox用の新しいAPIクライアント関数
export async function synthesizeVoicevoxApi(
  message: string,
  speakerId: number,
): Promise<ArrayBuffer> {
  const body = {
    message: message,
    speakerId: speakerId,
  };

  const res = await fetch("/ced-iot/api/voicevox", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch audio from voicevox API");
  }

  // レスポンスはWAVのバイナリデータなので、arrayBuffer()で受け取る
  const buffer = await res.arrayBuffer();
  return buffer;
}