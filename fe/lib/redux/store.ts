import { configureStore, combineReducers } from "@reduxjs/toolkit";
import uploadReducer from "./slices/upload/uploadSlice";
import chatReducer from "./slices/chat/chatSlice";
import ggSheetReducer from "./slices/gg-sheet/ggSheetSlice";
import documentReducer from "./slices/document/documentSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
    chatReducer,
    uploadReducer,
    ggSheetReducer,
    documentReducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: [
        "uploadReducer",
        "ggSheetReducer",
        "chatReducer",
        "documentReducer",
    ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
