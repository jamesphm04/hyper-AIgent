import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export const useListItems = () => {
  const pathname = usePathname();
  const session = useSession();

  const { uploadedFiles, currentFileId } = useSelector(
    (state: RootState) => state.uploadReducer.value
  );
  const { linkedGGSheets, currentGGSheetId } = useSelector(
    (state: RootState) => state.ggSheetReducer.value
  );
  const { currentDocumentId, uploadedDocuments } = useSelector(
    (state: RootState) => state.documentReducer.value
  );

  const [itemInfoList, setItemInfoList] = useState<
    { id: number; name: string; chatID: number }[]
  >([]);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      setItemInfoList([]);
      setCurrentItemId(null);
    } else {
      if (pathname === "/upload") {
        setItemInfoList(uploadedFiles);
        setCurrentItemId(currentFileId);
      } else if (pathname === "/gg-sheet") {
        setItemInfoList(linkedGGSheets);
        setCurrentItemId(currentGGSheetId);
      } else if (pathname === "/upload-doc") {
        setItemInfoList(uploadedDocuments);
        setCurrentItemId(currentDocumentId);
      } else {
        setItemInfoList([]);
        setCurrentItemId(null);
      }
    }
  }, [
    session.status,
    pathname,
    uploadedFiles,
    currentFileId,
    linkedGGSheets,
    currentGGSheetId,
    uploadedDocuments,
    currentDocumentId,
  ]);

  return {
    currentItemId,
    itemInfoList,
  };
};
