

export async function getUECInfoStream(message: string) {
  const encodedMessage = encodeURIComponent(message);
  const res = await fetch(`http://uec_qa:12344/questionStreaming?question_sentence=${encodedMessage}`);
  // const res = await fetch(`http://localhost:12344/questionStreaming?question_sentence=${encodedMessage}`);

  const reader = res.body?.getReader();
    if (res.status !== 200 || !reader) {
        throw new Error("Something went wrong");
    }

    const stream = new ReadableStream({
        async start(controller: ReadableStreamDefaultController) {
            const decoder = new TextDecoder("utf-8");
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const data = decoder.decode(value);
                    const chunks = data
                        .split("data:")
                        .filter((val) => !!val && val.trim() !== "[DONE]");
                    for (const chunk of chunks) {
                        const json = JSON.parse(chunk);
                        const messagePiece = json.choices[0].delta.content;
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