import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FileInfo = {
  name: string;
  id: number;
  chatID: number;
};

type UploadState = {
  uploadedFiles: FileInfo[];
  currentFileId: number | null;
};

type InitialState = {
  value: UploadState;
};

export const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    value: {
      uploadedFiles: [],
      currentFileId: null,
    },
  } as InitialState,
  reducers: {
    addFiles: (state, action: PayloadAction<FileInfo[]>) => {
      state.value.uploadedFiles.push(
        ...action.payload.filter(
          (file) =>
            !state.value.uploadedFiles.some(
              (uploadedFile) => uploadedFile.id === file.id
            )
        )
      );
      return state;
    },
    removeFile: (state, action: PayloadAction<number>) => {
      state.value.uploadedFiles = state.value.uploadedFiles.filter(
        (file) => file.id !== action.payload
      );
      return state;
    },

    clearFileState: (state) => {
      state.value.uploadedFiles = [];
      state.value.currentFileId = null;
      return state;
    },

    removeFileByChatID: (state, action: PayloadAction<number>) => {
      state.value.uploadedFiles = state.value.uploadedFiles.filter(
        (file) => file.chatID !== action.payload
      );
      return state;
    },

    setCurrentFileId: (state, action: PayloadAction<number>) => {
      state.value.currentFileId = action.payload;
    },

    clearCurrentFileId: (state) => {
      state.value.currentFileId = null;
    },
  },
});

export const {
  addFiles,
  removeFile,
  setCurrentFileId,
  clearCurrentFileId,
  removeFileByChatID,
  clearFileState,
} = uploadSlice.actions;
export default uploadSlice.reducer;
