import { RootState } from "@/lib/redux/store";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

const useLayout = () => {
  const pathname = usePathname();

  //pop up chat
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isOpenGGSheetURLModal, setIsOpenGGSheetURLModal] =
    useState<boolean>(false);

  const currentFileId =
    useSelector(
      (state: RootState) => state.uploadReducer.value.currentFileId
    ) ?? null;

  const currentGGSheetId = useSelector(
    (state: RootState) => state.ggSheetReducer.value.currentGGSheetId
  );

  const currentDocumentId = useSelector(
    (state: RootState) => state.documentReducer.value.currentDocumentId
  );

  // Chat
  const openPopup = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopup = () => {
    setAnchorEl(null);
  };

  return {
    isOpenGGSheetURLModal,
    currentGGSheetId,
    currentFileId,
    currentDocumentId,
    pathname,
    anchorEl,
    openPopup,
    closePopup,
    setIsOpenGGSheetURLModal,
  };
};

export default useLayout;
