import { FileInfo } from "@/lib/redux/slices/upload/uploadSlice";
import api from "../axiosInstance";
import * as XLSX from "xlsx";

export const getAllGGSheetsInfo = async (
  userId: number
): Promise<FileInfo[]> => {
  const response = await api.get(`users/${userId}/gg-sheets/all-gg-sheets`);
  return response.data;
};

export const fetchGGSheetData = async (
  userId: number,
  ggSheetId: number
): Promise<any> => {
  try {
    const response = await api.get(`users/${userId}/gg-sheets/${ggSheetId}`, {
      responseType: "json",
    });

    const { chatId, fileContent, fileName } = response.data;

    const data =
      fileContent instanceof Uint8Array
        ? fileContent
        : typeof fileContent === "string"
          ? new Uint8Array(Buffer.from(fileContent, "base64"))
          : new Uint8Array(fileContent);

    const workbook = XLSX.read(data, { type: "array" });

    return { type: "xlsx", workbook, chatId, fileName };
  } catch (error) {
    console.error("Error fetching gg sheet:", error);
  }
};

export const uploadGGSheetURL = async (url: string, userID: number) => {
  try {
    const response = await api.post(`users/${userID}/gg-sheets/fetch`, { url });

    return response.data;
  } catch (error) {
    console.error("Error uploading Google Sheet URL:", error);
    throw error;
  }
};

export const getColDesc = async (ggSheetId: number | null): Promise<any> => {
  if (!ggSheetId) {
    console.error("GGSheet ID is required to fetch column descriptions.");
  }

  try {
    const response = await api.get(`gg-sheets/${ggSheetId}/column-description`);
    return response.data;
  } catch (error) {
    console.error("Error fetching column description:", error);
    throw error;
  }
};

export const updateColDesc = async (
  ggSheetID: number | null,
  colDescString: string
): Promise<void> => {
  if (!ggSheetID) {
    console.error("GGSheet ID is required to update column descriptions.");
    return;
  }

  try {
    await api.put(`gg-sheets/${ggSheetID}/column-description`, colDescString, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error updating column descriptions:", error);
    throw error;
  }
};
