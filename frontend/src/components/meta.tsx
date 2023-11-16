import { buildUrl } from "@/utils/buildUrl";
import Head from "next/head";
export const Meta = () => {
  const title = "AI Shimazaki";
  const description =
  "電気通信大学 技術職員である島崎をAI化したものです 雑談や電気通信大学に関する質問ができます";
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  );
};
