import { useDispatch } from "react-redux";
import {
  removeFileByChatID,
  setCurrentFileId as setCurrentFileIdRedux,
} from "@/lib/redux/slices/upload/uploadSlice";
import {
  removeGGSheetByChatID,
  setCurrentGGSheetId as setCurrentGGSheetIdRedux,
} from "@/lib/redux/slices/gg-sheet/ggSheetSlice";
import {
  removeDocumentByChatID,
  setCurrentDocumentId as setCurrentDocumentIdRedux,
} from "@/lib/redux/slices/document/documentSlice";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { deleteFileByChatID } from "@/services/files/fileService";
import { deleteDoc } from "@/services/documents/documentService";

export const useFileItem = (id: number, chatID: number) => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const setCurrentFileId = () => {
    if (pathname === "/upload") {
      dispatch(setCurrentFileIdRedux(id));
    } else if (pathname === "/gg-sheet") {
      dispatch(setCurrentGGSheetIdRedux(id));
    } else if (pathname === "/upload-doc") {
      dispatch(setCurrentDocumentIdRedux(id));
    }
  };

  const handleOpenMoreOptions = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMoreOptions = () => {
    setAnchorEl(null);
  };

  const handleShare = () => {
    console.log("Clicked Share option", chatID, id);
    handleCloseMoreOptions();
  };

  const handleDelete = async () => {
    if (pathname === "/upload-doc") {
      await deleteDoc(chatID);
    } else {
      await deleteFileByChatID(chatID, pathname);
    }

    if (pathname === "/upload") {
      dispatch(removeFileByChatID(chatID));
    } else if (pathname === "/gg-sheet") {
      dispatch(removeGGSheetByChatID(chatID));
    } else if (pathname === "/upload-doc") {
      dispatch(removeDocumentByChatID(chatID));
    }

    handleCloseMoreOptions();
  };

  return {
    anchorEl,
    setCurrentFileId,
    handleOpenMoreOptions,
    handleCloseMoreOptions,
    handleShare,
    handleDelete,
  };
};
