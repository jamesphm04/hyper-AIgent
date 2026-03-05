import { RootState } from "@/lib/redux/store";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getAnswerUpload,
  getAnswerGGSheet,
  getHistory,
  getAnswerUploadDoc,
} from "@/services/chats/chatService";
import { Message } from "@/lib/redux/slices/chat/chatSlice";
import { usePathname } from "next/navigation";

export const useChat = () => {
  const pathname = usePathname();

  const { chatId } = useSelector((state: RootState) => state.chatReducer);

  const [history, setHistory] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      getHistory(chatId).then((resHistory) => {
        console.log("Fetched chat history.", resHistory);
        setHistory(resHistory);
      });

      scrollToBottom();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (inputValue.trim() === "") return;
    if (!chatId) return;

    setIsProcessing(true);

    // Add user message to chat
    const userMessage: Message = {
      role: "user",
      content: inputValue,
    };

    setHistory((prevHistory) => prevHistory.concat(userMessage));

    // Clear the input field
    setInputValue("");

    try {
      let res = null;

      if (pathname == "/gg-sheet") {
        res = await getAnswerGGSheet(chatId, inputValue);
      } else if (pathname == "/upload") {
        res = await getAnswerUpload(chatId, inputValue);
      } else if (pathname == "/upload-doc") {
        res = await getAnswerUploadDoc(chatId, inputValue);
      }

      setHistory((prevHistory) =>
        prevHistory.concat(res.slice(1) as Message[])
      );
    } catch (error) {
      console.error("Error sending chat request:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    history,
    inputValue,
    isProcessing,
    messagesEndRef,
    handleInputChange,
    handleKeyDown,
    handleSubmit,
  };
};
