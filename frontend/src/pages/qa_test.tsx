import React, { useEffect, useState } from 'react';

const StreamingComponent = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://uec_qa:12344/query?question_sentence=電気通信大学について教えて');
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      const processStream = async () => {
        let done, value;
        do {
          ({ done, value } = await reader.read());
          value = decoder.decode(value);
          if (value) {
            setMessages(prev => [...prev, value]);
          }
        } while (!done);
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
