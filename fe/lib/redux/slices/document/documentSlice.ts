import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type DocumentInfo = {
  name: string;
  id: number;
  chatID: number;
};

type State = {
  uploadedDocuments: DocumentInfo[];
  currentDocumentId: number | null;
};

type InitialState = {
  value: State;
};

export const documentSlice = createSlice({
  name: "document",
  initialState: {
    value: {
      uploadedDocuments: [],
      currentDocumentId: null,
    },
  } as InitialState,
  reducers: {
    addDocuments: (state, action: PayloadAction<DocumentInfo[]>) => {
      state.value.uploadedDocuments.push(
        ...action.payload.filter(
          (doc) =>
            !state.value.uploadedDocuments.some(
              (uploadedDoc) => uploadedDoc.id === doc.id
            )
        )
      );
      return state;
    },

    removeDocument: (state, action: PayloadAction<number>) => {
      state.value.uploadedDocuments = state.value.uploadedDocuments.filter(
        (doc) => doc.id !== action.payload
      );
      return state;
    },

    clearDocumentState: (state) => {
      state.value.uploadedDocuments = [];
      state.value.currentDocumentId = null;
      return state;
    },

    removeDocumentByChatID: (state, action: PayloadAction<number>) => {
      state.value.uploadedDocuments = state.value.uploadedDocuments.filter(
        (doc) => doc.chatID !== action.payload
      );
      return state;
    },

    setCurrentDocumentId: (state, action: PayloadAction<number>) => {
      state.value.currentDocumentId = action.payload;
    },

    clearCurrentDocumentId: (state) => {
      state.value.currentDocumentId = null;
    },
  },
});

export const {
  addDocuments,
  removeDocument,
  clearDocumentState,
  removeDocumentByChatID,
  setCurrentDocumentId,
  clearCurrentDocumentId,
} = documentSlice.actions;

export default documentSlice.reducer;
