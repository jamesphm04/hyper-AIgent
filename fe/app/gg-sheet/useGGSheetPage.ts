import {
  addGGSheets,
  setCurrentGGSheetId,
} from "@/lib/redux/slices/gg-sheet/ggSheetSlice";
import { RootState } from "@/lib/redux/store";
import {
  getAllGGSheetsInfo,
  fetchGGSheetData,
  uploadGGSheetURL,
} from "@/services/gg-sheets/ggSheetService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChatId } from "@/lib/redux/slices/chat/chatSlice";
import * as XLSX from "xlsx";
import { usePathname } from "next/navigation";
import { clearCurrentFileId } from "@/lib/redux/slices/upload/uploadSlice";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { clearCurrentDocumentId } from "@/lib/redux/slices/document/documentSlice";

export const useGGSheetPage = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const { currentGGSheetId } = useSelector(
    (state: RootState) => state.ggSheetReducer.value
  );

  // Column description modal
  const [isOpenColDescModal, setIsOpenColDescModal] = useState(false);

  // Display the data
  const [data, setData] = useState<any[]>([]);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [currentSheetIdx, setCurrentSheetIdx] = useState<number>(0);
  const [workbook, setWorkbook] = useState<any | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Upload url
  const [inputValue, setInputValue] = useState<string>("");

  // Switching modules will clear the previous
  useEffect(() => {
    dispatch(clearCurrentFileId());
    dispatch(clearCurrentDocumentId());
  }, [pathname]);

  // handle fetching data
  useEffect(() => {
    if (currentGGSheetId && status === "authenticated" && session?.user) {
      fetchGGSheetData(session.user.id, currentGGSheetId).then((res) => {
        dispatch(setChatId(res.chatId));

        setFileName(res.fileName);

        // add file to the item list if create new
        dispatch(
          addGGSheets([
            {
              id: currentGGSheetId,
              name: res.fileName,
              chatID: res.chatId,
            },
          ])
        );

        res.workbook.SheetNames.forEach((sheetName: string) => {
          const sheetData = XLSX.utils.sheet_to_json(
            res.workbook.Sheets[sheetName]
          );
          res.workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(
            sheetData.slice(0, 100)
          );
        });

        setWorkbook(res.workbook);
        setAvailableSheets([...res.workbook.SheetNames]);

        setCurrentSheetIdx(0);

        const sheetName = res.workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(
          res.workbook.Sheets[sheetName]
        );

        setData([...sheetData]);
        return;
      });
    }
  }, [currentGGSheetId]);

  // Update data when the sheet changes
  useEffect(() => {
    if (workbook) {
      const sheetData = XLSX.utils.sheet_to_json(
        workbook.Sheets[availableSheets[currentSheetIdx]]
      );
      setData([...sheetData]);
    }
  }, [currentSheetIdx]);

  // handle loggin
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      getAllGGSheetsInfo(session.user.id).then((data) => {
        dispatch(addGGSheets(data));
      });
    }
  }, [status, pathname]);

  // Open and close column description modal
  const openColDescModal = () => setIsOpenColDescModal(true);
  const closeColDescModal = () => setIsOpenColDescModal(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (inputValue.trim() === "") return;

    setUploading(true);
    try {
      if (!session?.user?.id) {
        toast.error("User session not found. Please log in.");
        return;
      }

      const resData = await uploadGGSheetURL(inputValue, session.user.id);

      dispatch(setCurrentGGSheetId(resData.ggSheetFileId));
      setFileName(resData.ggSheetFileName);
      toast.success("Google Sheet URL uploaded successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload Google Sheet URL.");
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    isOpenColDescModal,
    fileName,
    data,
    availableSheets,
    currentSheetIdx,
    currentGGSheetId,
    inputValue,
    setCurrentSheetIdx,
    openColDescModal,
    closeColDescModal,
    handleInputChange,
    handleSubmit,
  };
};
