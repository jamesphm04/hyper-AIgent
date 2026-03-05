import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clear } from "console";

export type GGSheetInfo = {
  name: string;
  id: number;
  chatID: number;
};

type GGSheetState = {
  linkedGGSheets: GGSheetInfo[];
  currentGGSheetId: number | null;
};

type InitialState = {
  value: GGSheetState;
};

export const ggSheetSlice = createSlice({
  name: "ggSheet",
  initialState: {
    value: {
      linkedGGSheets: [],
      currentGGSheetId: null,
    },
  } as InitialState,
  reducers: {
    addGGSheets: (state, action: PayloadAction<GGSheetInfo[]>) => {
      state.value.linkedGGSheets.push(
        ...action.payload.filter(
          (comingGGsheet) =>
            !state.value.linkedGGSheets.some(
              (sheet) => sheet.id === comingGGsheet.id
            )
        )
      );
      return state;
    },

    clearGGSheetState: (state) => {
      state.value.linkedGGSheets = [];
      state.value.currentGGSheetId = null;
      return state;
    },

    removeGGSheet: (state, action: PayloadAction<number>) => {
      state.value.linkedGGSheets = state.value.linkedGGSheets.filter(
        (sheet) => sheet.id !== action.payload
      );
      return state;
    },

    removeGGSheetByChatID: (state, action: PayloadAction<number>) => {
      state.value.linkedGGSheets = state.value.linkedGGSheets.filter(
        (sheet) => sheet.chatID !== action.payload
      );
      return state;
    },

    setCurrentGGSheetId: (state, action: PayloadAction<number | null>) => {
      state.value.currentGGSheetId = action.payload;
    },

    clearCurrentGGSheetId: (state) => {
      state.value.currentGGSheetId = null;
    },
  },
});

export const {
  addGGSheets,
  removeGGSheet,
  setCurrentGGSheetId,
  clearCurrentGGSheetId,
  removeGGSheetByChatID,
  clearGGSheetState,
} = ggSheetSlice.actions;
export default ggSheetSlice.reducer;
