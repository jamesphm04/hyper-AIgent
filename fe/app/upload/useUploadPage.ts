import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  fetchFileData,
  getAllFileInfo,
  uploadFile,
} from "@/services/files/fileService";
import {
  addFiles,
  setCurrentFileId,
} from "@/lib/redux/slices/upload/uploadSlice";
import * as XLSX from "xlsx";
import { setChatId } from "@/lib/redux/slices/chat/chatSlice";
import { usePathname } from "next/navigation";
import { clearCurrentGGSheetId } from "@/lib/redux/slices/gg-sheet/ggSheetSlice";
import { clearCurrentDocumentId } from "@/lib/redux/slices/document/documentSlice";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export const useUploadPage = () => {
  const { data: session, status } = useSession();

  const { currentFileId, uploadedFiles } = useSelector(
    (state: RootState) => state.uploadReducer.value
  );

  // Column description modal
  const [isOpenColDescModal, setIsOpenColDescModal] = useState(false);

  const [data, setData] = useState<any[]>([]);
  const [type, setType] = useState<string | null>(null);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [currentSheetIdx, setCurrentSheetIdx] = useState<number>(0);
  const [workbook, setWorkbook] = useState<any | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const dispatch = useDispatch();
  const pathname = usePathname();

  // Switching modules will clear the previous
  useEffect(() => {
    dispatch(clearCurrentGGSheetId());
    dispatch(clearCurrentDocumentId());
  }, [pathname]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) {
      return;
    }

    if (currentFileId) {
      fetchFileData(currentFileId).then((res) => {
        // console.log("Fetched data.", res);
        dispatch(setChatId(res.chatId));

        setType(res.type);
        setFileName(res.fileName);

        // add file to the item list if create new
        dispatch(
          addFiles([
            {
              id: currentFileId,
              name: res.fileName,
              chatID: res.chatId,
            },
          ])
        );

        if (res.type === "xlsx") {
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
        } else if (res.type === "csv") {
          setData([...res.workbook.slice(0, 100)]);
          return;
        }
      });
    }
  }, [currentFileId]);

  // Update data when the sheet changes
  useEffect(() => {
    if (workbook) {
      const sheetData = XLSX.utils.sheet_to_json(
        workbook.Sheets[availableSheets[currentSheetIdx]]
      );
      setData([...sheetData]);
    }
  }, [currentSheetIdx]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      getAllFileInfo(session.user.id).then((data) => {
        dispatch(addFiles(data));
      });
    }
  }, [status, session, pathname]);

  // Open and close column description modal
  const openColDescModal = () => setIsOpenColDescModal(true);
  const closeColDescModal = () => setIsOpenColDescModal(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status !== "authenticated" || !session?.user) {
      return;
    }

    e.preventDefault();
    const file = e.target.files?.[0];

    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    if (
      !file.name.endsWith(".csv") &&
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls")
    ) {
      toast.error(
        "Please upload a valid CSV or Excel file (.csv, .xlsx, .xls)"
      );
      return;
    }

    const uploadedData = await uploadFile(file, session.user.id);

    dispatch(setCurrentFileId(uploadedData.id));

    setFileName(uploadedData.name);
    toast.success("File uploaded successfully!");
  };

  return {
    isOpenColDescModal,
    currentFileId,
    pathname,
    fileName,
    data,
    type,
    availableSheets,
    currentSheetIdx,
    setCurrentSheetIdx,
    openColDescModal,
    closeColDescModal,
    handleUpload,
  };
};
