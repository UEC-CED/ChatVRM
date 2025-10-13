import { wait } from "@/utils/wait";
import { synthesizeVoiceApi, synthesizeVoicevoxApi } from "./synthesizeVoice";
import { Viewer } from "../vrmViewer/viewer";
import { Screenplay } from "./messages";
import { Talk } from "./messages";

const createSpeakCharacter = () => {
  let lastTime = 0;
  let prevFetchPromise: Promise<unknown> = Promise.resolve();
  let prevSpeakPromise: Promise<unknown> = Promise.resolve();

  return (
    screenplay: Screenplay,
    viewer: Viewer,
    onStart?: () => void,
    onComplete?: () => void
  ) => {
    const fetchPromise = prevFetchPromise.then(async () => {
      const now = Date.now();
      if (now - lastTime < 1000) {
        await wait(1000 - (now - lastTime));
      }

      const buffer = await fetchAudio(screenplay.talk).catch(
        () => null
      );
      lastTime = Date.now();
      return buffer;
    });

    prevFetchPromise = fetchPromise;
    prevSpeakPromise = Promise.all([fetchPromise, prevSpeakPromise]).then(
      ([audioBuffer]) => {
        onStart?.();
        if (!audioBuffer) {
          return;
        }
        return viewer.model?.speak(audioBuffer, screenplay);
      }
    );
    prevSpeakPromise.then(() => {
      onComplete?.();
    });
  };
};

export const speakCharacter = createSpeakCharacter();

// export const fetchAudio = async (
//   talk: Talk
// ): Promise<ArrayBuffer> => {
//   const ttsVoice = await synthesizeVoiceApi(
//     talk.message,
//     talk.speakerX,
//     talk.speakerY,
//     talk.style,
//   );
//   const url = ttsVoice.audio;

//   if (url == null) {
//     throw new Error("Something went wrong");
//   }

//   const resAudio = await fetch(url);
//   const buffer = await resAudio.arrayBuffer();
//   return buffer;
// };


export const fetchAudio = async (
  talk: Talk
): Promise<ArrayBuffer> => {
  // TalkオブジェクトからspeakerIdを取得するか、固定値を指定
  // ここでは例として、talk.styleをspeakerIdとして扱うことにします。
  // 必要に応じて、koeiromapのパラメータから適切なspeakerIdへの変換ロジックを実装してください。
  // 例：const speakerId = convertStyleToSpeakerId(talk.style);
  const speakerId = 11;    // 玄野武宏 ノーマル

  // 新しいAPIクライアントを呼び出す
  const buffer = await synthesizeVoicevoxApi(
    talk.message,
    speakerId,
  );

  return buffer;
};
