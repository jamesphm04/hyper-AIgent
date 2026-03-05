import api from "../axiosInstance";

export const getHistory = async (chatId: number) => {
  const response = await api.get(`chats/${chatId}/history`);
  return response.data;
};

export const getAnswerUpload = async (chatId: number, userMessage: string) => {
  const body = {
    content: userMessage,
  };

  const response = await api.patch(`files/chats/${chatId}`, body);
  return response.data;
};

export const getAnswerGGSheet = async (chatId: number, userMessage: string) => {
  const body = {
    content: userMessage,
  };

  const response = await api.patch(`gg-sheets/chats/${chatId}`, body);
  return response.data;
};

export const getAnswerUploadDoc = async (
  chatId: number,
  userMessage: string
) => {
  const body = {
    content: userMessage,
  };

  const response = await api.patch(`documents/chats/${chatId}`, body);

  return response.data.data;
};
