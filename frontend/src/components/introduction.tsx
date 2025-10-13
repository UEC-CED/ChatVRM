// Introduction.tsx

import { ReactNode } from "react";
import { Link } from "./link";
import Image from "next/image";
import { buildUrl } from "@/utils/buildUrl";


type Props = {
  opened: boolean;
  onClose: () => void;
};

export const Introduction = ({ opened, onClose }: Props) => {
  if (!opened) return null;

  return (
    <div className="absolute z-40 w-full h-full px-24 py-40  bg-black/30 font-M_PLUS_2">
      <div className="mx-auto my-auto max-w-3xl max-h-full p-24 overflow-auto bg-white rounded-16">
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            AI Shimazaki
          </div>
          <div>
            電気通信大学 技術職員である島崎をAI化したものです。
            雑談や電気通信大学に関する質問ができます。
          </div>

          <Image
            src={buildUrl("/description.png")}
            alt="AI Shimazaki description"
            width={1000} // 適切なサイズに調整
            height={700}
            className="mb-8"
          />

        </div>
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            技術紹介
          </div>
          <div>
            3Dモデルの表示や操作には
            <Link url={"https://github.com/pixiv/three-vrm"} label={"@pixiv/three-vrm"} />、
            会話文生成には
            <Link url={"https://openai.com/blog/introducing-chatgpt-and-whisper-apis"} label={"ChatGPT API"}/>
            、音声合成には
            <Link url={"https://voicevox.hiroshiba.jp"} label={"VOICEVOX"} />
            の
            <Link url={"https://voicevox.hiroshiba.jp/product/kurono_takehiro/"} label={"玄野武宏"} />
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
          </div>
        </div>
        <div className="my-24">
          <button
            onClick={onClose}
            className="font-bold bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled text-white px-24 py-8 rounded-oval"
          >
            はじめる
          </button>
        </div>
      </div>
    </div>
  );
};
