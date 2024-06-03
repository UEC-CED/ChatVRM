import React, { useEffect, useState } from 'react';

const StreamingComponent = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:12344/questionStreaming?question_sentence=電気通信大学について教えて');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      if (!reader) {
        throw new Error("Stream reader not available");
      }

      const stream = new ReadableStream({
        async start(controller) {
          try {
            let done, value;
            while (true) {
              ({ done, value } = await reader.read());
              if (done) break;
              const data = decoder.decode(value, { stream: true });
              controller.enqueue(data);
            }
          } catch (error) {
            controller.error(error);
          } finally {
            reader.releaseLock();
            controller.close();
          }
        },
      });

      const processStream = async () => {
        const streamReader = stream.getReader();
        try {
          let done, value;
          while (true) {
            ({ done, value } = await streamReader.read());
            if (done) break;
            if (value) {
              setMessages(prev => [...prev, value]);
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          streamReader.releaseLock();
        }
      };

      processStream().catch(console.error);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Received Messages</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default StreamingComponent;
