import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Message = {
  content: string;
  role: string;
  image?: string;
};

type InitialState = {
  chatId: number | null;
  history: Message[];
};

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatId: null,
    history: [],
  } as InitialState,
  reducers: {
    setChatId: (state, action: PayloadAction<number>) => {
      state.chatId = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.history.push(action.payload);
    },
    clearChatState: (state) => {
      state.chatId = null;
      state.history = [];
    },
  },
});

export const { setChatId, addMessage, clearChatState } = chatSlice.actions;
export default chatSlice.reducer;
