import axios from 'axios';

export const apiClient = axios.create({
    baseURL: "http://uec_qa:12344/",
    responseType: "stream"
});

export const apiViaClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL
});

export const getUECInfo = async (newMessage: string) => {
    const encodedMessage = encodeURIComponent(newMessage);
    const response = await apiClient.get(`/question?question_sentence=${encodedMessage}`);
    return response.data;
}

export const getUECInfoStreaming = async (newMessage: string) => {
    const encodedMessage = encodeURIComponent(newMessage);
    const res = await apiClient.get(`/questionStreaming?question_sentence=${encodedMessage}`);

    const reader = res.data?.getReader();
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

    return stream;
}

export const helloWorld = async () => {
    const response = await apiClient.get(`/helloworld`);
    return response.data;
}

export const getUECInfoviaLocalAPI = async (message: string) => {
    try {
        const response = await apiViaClient.post('/getUECInfo/', {
            message: message
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const getUECInfoStreamingviaLocalAPI = async (message: string) => {
    try {
        const response = await apiViaClient.post('/getUECInfoStreaming/', {
            message: message
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}