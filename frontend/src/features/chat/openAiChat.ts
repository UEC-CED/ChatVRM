import { Configuration, OpenAIApi } from "openai";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { Message } from "../messages/messages";

export async function getChatResponse(messages: Message[], apiKey: string) {
  if (!apiKey) {
    throw new Error("Invalid API Key");
  }

  const configuration = new Configuration({
    apiKey: apiKey,
  });
  // ブラウザからAPIを叩くときに発生するエラーを無くすworkaround
  // https://github.com/openai/openai-node/issues/6#issuecomment-1492814621
  delete configuration.baseOptions.headers["User-Agent"];

  const openai = new OpenAIApi(configuration);

  const { data } = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });

  const [aiRes] = data.choices;
  const message = aiRes.message?.content || "エラーが発生しました";

  return { message: message };
}

export async function getChatResponseStream(messages: Message[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const response = await fetch("/ced-iot/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages: messages }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = response.body;
  if (!data) {
    return;
  }

  const reader = data.getReader();

  const onParseGPT = (event: ParsedEvent | ReconnectInterval) => {
    if (event.type === "event") {
      const data = event.data;
      try {
        const text = JSON.parse(data).text ?? "";
      } catch (e) {
        console.error(e);
      }
    }
  };

  function isValidJSON(jsonString: string) {
    try {
      JSON.parse(jsonString);
      return true; // JSON.parseが成功した場合
    } catch (e) {
      return false; // JSON.parseが失敗した場合
    }
  }

  const stream = new ReadableStream({
    async start(controller: ReadableStreamDefaultController) {
      const decoder = new TextDecoder();
      const parser = createParser(onParseGPT);
      let done = false;
      try {
        while (true) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          if (done) break;

          const chunkValue = await decoder.decode(value); //await追加
          parser.feed(chunkValue);
          const chunks = await chunkValue //await追加
            .split("data:")
            .filter((val) => !!val && val.trim() !== "[DONE]");

          for (const chunk of chunks) {
            // 正しくJSONをパースできた場合
            let json: any = { text: "" };
            if (isValidJSON(chunk)) {
              json = await JSON.parse(chunk); //await追加 // TODO: ここが正しくパースできない。元のデータが壊れているため（デプロイ後）。
            } else {
              json = { text: chunk.replace(/[{}"\n:\s]|text|tex|ext|/g, "") };
            }

            const messagePiece = json.text;
            if (!!messagePiece) {
              controller.enqueue(messagePiece);
            }
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return stream;
}
