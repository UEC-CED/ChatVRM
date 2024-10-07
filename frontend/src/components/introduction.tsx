import { useState, useCallback } from "react";
import { Link } from "./link";

type Props = {
  openAiKey: string;
  onChangeAiKey: (openAiKey: string) => void;
};
export const Introduction = ({
  openAiKey,
  onChangeAiKey,
}: Props) => {
  const [opened, setOpened] = useState(true);

  const handleAiKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeAiKey(event.target.value);
    },
    [onChangeAiKey]
  );

  return opened ? (
    <div className="absolute z-40 w-full h-full px-24 py-40  bg-black/30 font-M_PLUS_2">
      <div className="mx-auto my-auto max-w-3xl max-h-full p-24 overflow-auto bg-white rounded-16">
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary ">
            AI Shimazaki
          </div>
          <div>
            {/* Webブラウザだけで3Dキャラクターとの会話を、マイクやテキスト入力、音声合成を用いて楽しめます。キャラクター（VRM）の変更や性格設定、音声調整もできます。 */}
            電気通信大学 技術職員である島崎をAI化したものです。
            雑談や電気通信大学に関する質問ができます。
          </div>
        </div>
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            技術紹介
          </div>
          <div>
            3Dモデルの表示や操作には
            <Link
              url={"https://github.com/pixiv/three-vrm"}
              label={"@pixiv/three-vrm"}
            />
            、 会話文生成には
            <Link
              url={
                "https://openai.com/blog/introducing-chatgpt-and-whisper-apis"
              }
              label={"ChatGPT API"}
            />
            、 音声合成には
            <Link url={"https://koemotion.rinna.co.jp/"} label={"Koemotion"} />
            の
            <Link
              url={
                "https://developers.rinna.co.jp/product/#product=koeiromap-free"
              }
              label={"Koeiromap API"}
            />
            を使用しています。 
          </div>
        </div>

        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            利用上の注意
          </div>
          <div>
            差別的または暴力的な発言、特定の人物を貶めるような発言を、意図的に誘導しないようお願いします。
            また、この情報の正確性は保証できませんので、参考程度にご利用ください。
            {/* また、VRMモデルを使ってキャラクターを差し替える際はモデルの利用条件に従ってください。 */}
          </div>
        </div>
        <div className="my-24">
          <button
            onClick={() => {
              setOpened(false);
            }}
            className="font-bold bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled text-white px-24 py-8 rounded-oval"
          >
            {/* APIキーを入力してはじめる */}
            はじめる
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
