import axios from 'axios';

export const apiClient = axios.create({
    baseURL: "http://uec_qa:12344/"
});

export const apiViaClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL
});

export const getUECInfo = async (newMessage: string) => {
    const encodedMessage = encodeURIComponent(newMessage);
    const response = await apiClient.get(`/question?question_sentence=${encodedMessage}`);
    return response.data;
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