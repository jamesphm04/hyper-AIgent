import api from "../axiosInstance";
import { DocumentInfo } from "@/lib/redux/slices/document/documentSlice";

export const uploadFile = async (file: File, userID: number) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await api.post(`users/${userID}/documents/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const getAllFileInfo = async (
  userId: number
): Promise<DocumentInfo[]> => {
  const response = await api.get(`users/${userId}/documents/all-info`);
  return response.data.data;
};

export const fetchFileData = async (documentID: number): Promise<any> => {
  const response = await api.get(`documents/${documentID}`, {
    responseType: "json",
  });

  const { chatId, content, headers, name } = response.data;

  return {
    chatId,
    content,
    headers,
    fileName: name,
  };
};

export const deleteDoc = async (chatID: number) => {
  try {
    await api.delete(`documents/${chatID}`);
  } catch (error) {
    console.error("Error deleting RAG vector:", error);
    throw error;
  }
};
