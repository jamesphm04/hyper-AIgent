"use client";

import { FC, useState } from "react";
import stylesIconButton from "@/components/atoms/CustomIcon/CustomIcon.module.css";
import styles from "./FileItem.module.css";
import { RiMore2Line } from "react-icons/ri";
import { useFileItem } from "./useFileItem";
import { Menu, MenuItem } from "@mui/material";

interface FileItemProps {
  name: string;
  id: number;
  chatID: number;
  isActive: boolean;
}

const FileItem: FC<FileItemProps> = ({ name, id, isActive, chatID }) => {
  const {
    anchorEl,
    setCurrentFileId,
    handleOpenMoreOptions,
    handleCloseMoreOptions,
    handleShare,
    handleDelete,
  } = useFileItem(id, chatID);

  return (
    <div className={styles.wrapper}>
      <div className={styles.fileInfo} onClick={setCurrentFileId}>
        <span
          className={styles.fileName}
          style={{ color: isActive ? "#000" : "#C7C8CC" }}
        >
          {name}
        </span>
      </div>

      <span onClick={handleOpenMoreOptions}>
        <RiMore2Line size={16} color="#000" className={stylesIconButton.icon} />
      </span>

      <Menu
        id="more-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMoreOptions}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleShare}>Share</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export { FileItem };
