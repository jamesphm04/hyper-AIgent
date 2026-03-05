import { FileInfo } from "@/lib/redux/slices/upload/uploadSlice";
import api from "../axiosInstance";
import * as XLSX from "xlsx";
import Papa from "papaparse";

export const getAllFileInfo = async (userId: number): Promise<FileInfo[]> => {
  const response = await api.get(`users/${userId}/files/all-files`);
  return response.data;
};

export const fetchFileData = async (fileId: number): Promise<any> => {
  const response = await api.get(`files/${fileId}`, {
    responseType: "json",
  });

  const { chatId, fileContent, headers, fileName } = response.data;

  const contentType = headers["Content-Type"][0] || headers["content-type"][0];

  const data =
    fileContent instanceof Uint8Array
      ? fileContent
      : typeof fileContent === "string"
        ? new Uint8Array(Buffer.from(fileContent, "base64"))
        : new Uint8Array(fileContent);

  if (contentType === "text/csv") {
    const text = new TextDecoder().decode(data);
    const result = Papa.parse(text, { header: true });
    return {
      type: "csv",
      workbook: result.data,
      fileName,
      chatId,
    };
  } else if (
    contentType ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    // Handle XLSX
    const workbook = XLSX.read(data, { type: "array" });

    return { type: "xlsx", workbook, chatId, fileName };
  } else {
    console.error("Unsupported file type:", contentType);
    return [{ error: "Unsupported file type" }];
  }
};

export const uploadFile = async (file: File, userId: number) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await api.post(`users/${userId}/files/upload`, formData, {
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

export const deleteFileByChatID = async (chatID: number, pathname: string) => {
  const fileType = pathname === "/upload" ? "files" : "gg-sheets";
  try {
    await api.delete(`${fileType}/${chatID}`);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const getColDesc = async (fileID: number | null) => {
  if (!fileID) {
    console.error("File ID is required to fetch column descriptions.");
    return {};
  }

  try {
    const res = await api.get(`files/${fileID}/column-description`);
    return res.data;
  } catch (error) {
    console.error("Error fetching column descriptions:", error);
    throw error;
  }
};

export const updateColDesc = async (
  fileID: number | null,
  colDescString: string
): Promise<void> => {
  if (!fileID) {
    console.error("File ID is required to update column descriptions.");
    return;
  }

  try {
    await api.put(`files/${fileID}/column-description`, colDescString, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error updating column descriptions:", error);
    throw error;
  }
};
