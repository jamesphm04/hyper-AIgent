import { LuSendHorizontal } from "react-icons/lu";
import styles from "./Chat.module.css";
import { CustomButton } from "@/components/atoms/CustomButton/CustomButton";
import { Input } from "@/components/atoms/Input/Input";
import { Message } from "@/components/atoms/Message/Message";
import { useChat } from "./useChat";
import { CircularProgress } from "@mui/material";

const Chat = () => {
  const {
    history,
    isProcessing,
    inputValue,
    messagesEndRef,
    handleInputChange,
    handleKeyDown,
    handleSubmit,
  } = useChat();

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messageArea}>
        {history.map((message, index) => (
          <Message
            key={index}
            role={message.role}
            content={message.content}
            image={message.image}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputArea}>
        <div className={styles.inputContainer}>
          <Input
            isAutoFocus={true}
            placeholder="Ask something..."
            className={styles.input}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
          />
          <CustomButton onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? (
              <CircularProgress size={20} />
            ) : (
              <LuSendHorizontal size={20} color="#000" />
            )}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export { Chat };
