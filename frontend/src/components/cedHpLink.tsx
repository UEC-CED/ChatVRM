import Image from "next/image";
import { buildUrl } from "@/utils/buildUrl";

export const CedHpLink = () => {
  return (
    <div className="absolute right-0 z-10 m-24">
      <a
        draggable={false}
        // href="https://github.com/pixiv/ChatVRM"
        href="https://sites.google.com/gl.cc.uec.ac.jp/ced/faq?authuser=0"
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="p-8 rounded-16 bg-[#EDEDED] hover:bg-[#CCCCCC] active:bg-[#AFAFAF] flex">
        <Image
          // alt="https://github.com/pixiv/ChatVRM"
          alt="https://sites.google.com/gl.cc.uec.ac.jp/ced/faq?authuser=0"
          height={24}
          width={24}
          src={buildUrl("/qa_icon.png")}
        />
        <div className="mx-4 text-black font-bold">CED FAQ</div>
      </div>
      </a>
    </div>
  );
};
