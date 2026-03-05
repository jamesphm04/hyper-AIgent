"use client";

import { FC } from "react";
import { Popover } from "@mui/material";
import { Chat } from "@/components/molecules/Chat/Chat";

interface PopupChatProps {
  anchorEl: HTMLElement | null;
  closePopup: () => void;
}

const PopupChat: FC<PopupChatProps> = ({ anchorEl, closePopup }) => {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={closePopup}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "8px",
            border: "1px solid #afafaf",
            background: "#e3e1d9",
          },
        },
      }}
    >
      <Chat />
    </Popover>
  );
};

export { PopupChat };
