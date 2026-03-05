"use client";

import { FC } from "react";
import clsx from "clsx";
import styles from "./Message.module.css";
import { useMessage } from "./useMessage";
import { Modal } from "@mui/material";
import { Box } from "@mui/material";

interface MessageProps {
  content: string;
  role: string;
  image?: string;
  className?: string;
}

const Message: FC<MessageProps> = ({ content, role, image, className }) => {
  const { expandImage, handleExpand, handleClose } = useMessage();

  return (
    <div
      className={clsx(styles.message, className, {
        [styles.userMessage]: role === "user", // Align right for user
        [styles.assistantMessage]: role === "assistant", // Align left for assistant
      })}
    >
      {image && (
        <img
          src={`data:image/png;base64, ${image}`}
          alt="uploaded"
          width="200px"
          onClick={handleExpand}
        />
      )}
      <div>
        <p style={{ whiteSpace: "pre-wrap" }}>{content}</p>
      </div>
      <Modal open={expandImage} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            padding: "10px",
          }}
        >
          <img
            src={`data:image/png;base64,${image}`}
            alt="expanded"
            style={{ maxWidth: "100%", maxHeight: "90vh" }}
          />
        </Box>
      </Modal>
    </div>
  );
};

export { Message };
