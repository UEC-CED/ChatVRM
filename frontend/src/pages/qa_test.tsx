import React, { useEffect, useState } from 'react';

const StreamingComponent = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('../api/getUECInfoStreaming?message=電気通信大学について教えて');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      if (!reader) {
        throw new Error("Stream reader not available");
      }

      const processStream = async () => {
        try {
          let done, value;
          while (true) {
            ({ done, value } = await reader.read());
            if (done) break;
            if (value) {
              const data = decoder.decode(value, { stream: true });
              setMessages(prev => [...prev, data]);
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          reader.releaseLock();
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
