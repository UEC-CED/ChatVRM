import { useCallback, useContext, useEffect, useState } from "react";
import VrmViewer from "@/components/vrmViewer";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import {
  Message,
  textsToScreenplay,
  Screenplay,
} from "@/features/messages/messages";
import { speakCharacter } from "@/features/messages/speakCharacter";
import { MessageInputContainer } from "@/components/messageInputContainer";
import { SYSTEM_PROMPT } from "@/features/constants/systemPromptConstants";
import { KoeiroParam, DEFAULT_PARAM } from "@/features/constants/koeiroParam";
import { getChatResponseStream } from "@/features/chat/openAiChat";
import { Introduction } from "@/components/introduction";
import { Menu } from "@/components/menu";
import { GitHubLink } from "@/components/githubLink";
import { Meta } from "@/components/meta";
import { getUECInfoviaLocalAPI } from "@/apiClient";

export default function Home() {
  const { viewer } = useContext(ViewerContext);

  const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPT);
  const [openAiKey, setOpenAiKey] = useState(process.env.NEXT_PUBLIC_OPENAI_APIKEY);
  const [koeiroParam, setKoeiroParam] = useState<KoeiroParam>(DEFAULT_PARAM);
  const [chatProcessing, setChatProcessing] = useState(false);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [assistantMessage, setAssistantMessage] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem("chatVRMParams")) {
      const params = JSON.parse(
        window.localStorage.getItem("chatVRMParams") as string
      );
      setSystemPrompt(params.systemPrompt);
      setKoeiroParam(params.koeiroParam);
      setChatLog(params.chatLog);
    }
  }, []);

  useEffect(() => {
    process.nextTick(() =>
      window.localStorage.setItem(
        "chatVRMParams",
        JSON.stringify({ systemPrompt, koeiroParam, chatLog })
      )
    );
  }, [systemPrompt, koeiroParam, chatLog]);

  const handleChangeChatLog = useCallback(
    (targetIndex: number, text: string) => {
      const newChatLog = chatLog.map((v: Message, i) => {
        return i === targetIndex ? { role: v.role, content: text } : v;
      });

      setChatLog(newChatLog);
    },
    [chatLog]
  );

  /**
   * 文ごとに音声を直列でリクエストしながら再生する
   */
  const handleSpeakAi = useCallback(
    async (
      screenplay: Screenplay,
      onStart?: () => void,
      onEnd?: () => void
    ) => {
      speakCharacter(screenplay, viewer, onStart, onEnd);
    },
    [viewer]
  );

  /**
   * 受け取った文字列をそのまま音声合成して再生する
   */
  const handleSpeakEcho = useCallback(
    async (text: string) => {
      setChatProcessing(true);
      // 句読点や疑問符、感嘆符などでテキストを分割する
      const sentences = text.match(/[^、。．！？]+[、。．！？\n]/g);
      if (sentences) {
        for (const sentence of sentences) {
          // 文ごとに音声合成して再生する
          const trimmedSentence = sentence.trim(); // 空白を除去
          if (trimmedSentence.length > 0) {
            const screenplay = textsToScreenplay([trimmedSentence], koeiroParam);
            await handleSpeakAi(screenplay[0]);
          }
        }
      }
      setAssistantMessage(text);
      setChatProcessing(false);
    },
    [koeiroParam, handleSpeakAi]
  );

  /**
   * アシスタントに電通大のQAをStreamingで聞く
   */
  const handleSendQAStreaming = useCallback(
    async (text: string) => {
      if (!openAiKey) {
        setAssistantMessage("APIキーが入力されていません");
        return;
      }

      const newMessage = text;

      if (newMessage == null) return;

      setChatProcessing(true);
      const messageLog: Message[] = [
        ...chatLog,
        { role: "user", content: newMessage },
      ];
      setChatLog(messageLog);

      const messages: Message[] = [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messageLog,
      ];

      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL
        const response = await fetch(`${baseURL}getUECInfoStreaming?message=${encodeURIComponent(newMessage)}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Failed to get reader from response body');
        }

        const decoder = new TextDecoder('utf-8');
        let receivedMessage = "";
        let aiTextLog = "";
        let tag = "";
        const sentences = new Array<string>();
        let isSentenceMatch = false;

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            // TODO: ここで、ほんとに発話をしたか（sentenceMatchのif文内に入ったかどうか）を確認する。
            if (done) {
              // 一度もSentenceMatchにマッチしなかった場合
              console.log("done!")
              if (!isSentenceMatch) {
                console.log("!isSentenceMatch.receivedMessage: ", receivedMessage);
                const aiText = `${tag} ${receivedMessage}`;
                const aiTalks = textsToScreenplay([aiText], koeiroParam);
                aiTextLog += aiText;

                // 文ごとに音声を生成 & 再生、返答を表示
                const currentAssistantMessage = sentences.join(" ");
                // const currentAssistantMessage = "星野 太佑　研究室"

                handleSpeakAi(aiTalks[0], () => {
                  setAssistantMessage(currentAssistantMessage);
                });
              }
              break;
            }
            receivedMessage += decoder.decode(value, { stream: true });

            const tagMatch = receivedMessage.match(/^\[(.*?)\]/);
            if (tagMatch && tagMatch[0]) {
              tag = tagMatch[0];
              receivedMessage = receivedMessage.slice(tag.length);
            }

            const sentenceMatch = receivedMessage.match(
              /^(.+[。．！？\n]|.{10,}[、,])/
            );
            if (sentenceMatch && sentenceMatch[0]) {
              isSentenceMatch = true;
              const sentence = sentenceMatch[0];
              sentences.push(sentence);
              receivedMessage = receivedMessage
                .slice(sentence.length)
                .trimStart();

              if (
                !sentence.replace(
                  /^[\s\[\(\{「［（【『〈《〔｛«‹〘〚〛〙›»〕》〉』】）］」\}\)\]]+$/g,
                  ""
                )
              ) {
                continue;
              }

              console.log(sentence)

              const aiText = `${tag} ${sentence}`;
              const aiTalks = textsToScreenplay([aiText], koeiroParam);
              aiTextLog += aiText;


              const currentAssistantMessage = sentences.join(" ");
              handleSpeakAi(aiTalks[0], () => {
                setAssistantMessage(currentAssistantMessage);
              });
            }
          }
        } catch (e) {
          console.error(e);
        } finally {
          reader.releaseLock();
        }

        const messageLogAssistant: Message[] = [
          ...messageLog,
          { role: "assistant", content: aiTextLog },
        ];

        setChatLog(messageLogAssistant);
      } catch (error) {
        console.error("Fetch error:", error);
        handleSpeakEcho("すみません、エラーが発生しました．");
      } finally {
        setChatProcessing(false);
      }
    },
    [systemPrompt, chatLog, handleSpeakAi, openAiKey, koeiroParam]
  );



  /**
   * アシスタントとの会話を行う
   */
  const handleSendChat = useCallback(
    async (text: string) => {
      if (!openAiKey) {
        setAssistantMessage("APIキーが入力されていません");
        return;
      }

      const newMessage = text;

      if (newMessage == null) return;

      setChatProcessing(true);
      // ユーザーの発言を追加して表示
      const messageLog: Message[] = [
        ...chatLog,
        { role: "user", content: newMessage },
      ];
      setChatLog(messageLog);

      // Chat GPTへ
      const messages: Message[] = [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messageLog,
      ];

      const stream = await getChatResponseStream(messages, openAiKey).catch(
        (e) => {
          console.error(e);
          return null;
        }
      );
      if (stream == null) {
        setChatProcessing(false);
        return;
      }

      const reader = stream.getReader();
      let receivedMessage = "";
      let aiTextLog = "";
      let tag = "";
      const sentences = new Array<string>();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          receivedMessage += value;

          // 返答内容のタグ部分の検出
          const tagMatch = receivedMessage.match(/^\[(.*?)\]/);
          if (tagMatch && tagMatch[0]) {
            tag = tagMatch[0];
            receivedMessage = receivedMessage.slice(tag.length);
          }

          // 返答を一文単位で切り出して処理する
          const sentenceMatch = receivedMessage.match(
            /^(.+[。．！？\n]|.{10,}[、,])/
          );
          if (sentenceMatch && sentenceMatch[0]) {
            const sentence = sentenceMatch[0];
            sentences.push(sentence);
            receivedMessage = receivedMessage
              .slice(sentence.length)
              .trimStart();

            // 発話不要/不可能な文字列だった場合はスキップ
            if (
              !sentence.replace(
                /^[\s\[\(\{「［（【『〈《〔｛«‹〘〚〛〙›»〕》〉』】）］」\}\)\]]+$/g,
                ""
              )
            ) {
              continue;
            }

            const aiText = `${tag} ${sentence}`;
            const aiTalks = textsToScreenplay([aiText], koeiroParam);
            aiTextLog += aiText;

            // 文ごとに音声を生成 & 再生、返答を表示
            const currentAssistantMessage = sentences.join(" ");
            handleSpeakAi(aiTalks[0], () => {
              setAssistantMessage(currentAssistantMessage);
            });
          }
        }
      } catch (e) {
        setChatProcessing(false);
        console.error(e);
      } finally {
        reader.releaseLock();
      }

      // アシスタントの返答をログに追加
      const messageLogAssistant: Message[] = [
        ...messageLog,
        { role: "assistant", content: aiTextLog },
      ];

      setChatLog(messageLogAssistant);
      setChatProcessing(false);
    },
    [systemPrompt, chatLog, handleSpeakAi, openAiKey, koeiroParam]
  );

  return (
    <div className={"font-M_PLUS_2"}>
      <Meta />
      <Introduction
        openAiKey={openAiKey || ""}
        onChangeAiKey={setOpenAiKey}
      />
      <VrmViewer />
      <MessageInputContainer
        isChatProcessing={chatProcessing}
        onChatProcessStart={handleSendChat}
        onChatQAProcessStart={handleSendQAStreaming}
      />
      <Menu
        openAiKey={openAiKey || ""}
        systemPrompt={systemPrompt}
        chatLog={chatLog}
        koeiroParam={koeiroParam}
        assistantMessage={assistantMessage}
        onChangeAiKey={setOpenAiKey}
        onChangeSystemPrompt={setSystemPrompt}
        onChangeChatLog={handleChangeChatLog}
        onChangeKoeiromapParam={setKoeiroParam}
        handleClickResetChatLog={() => setChatLog([])}
        handleClickResetSystemPrompt={() => setSystemPrompt(SYSTEM_PROMPT)}
        handleSpeakEcho={handleSpeakEcho}
      />
      <GitHubLink />
    </div>
  );
}
