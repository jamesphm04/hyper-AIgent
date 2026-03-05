import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  uploadFile,
  fetchFileData,
  getAllFileInfo,
} from "@/services/documents/documentService";

import {
  addDocuments,
  setCurrentDocumentId,
} from "@/lib/redux/slices/document/documentSlice";

import { setChatId } from "@/lib/redux/slices/chat/chatSlice";
import { usePathname } from "next/navigation";
import { clearCurrentGGSheetId } from "@/lib/redux/slices/gg-sheet/ggSheetSlice";
import { clearCurrentFileId } from "@/lib/redux/slices/upload/uploadSlice";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export const useUploadDocPage = () => {
  const { data: session, status } = useSession();

  const currentDocumentId = useSelector(
    (state: RootState) => state.documentReducer.value.currentDocumentId
  );

  const [data, setData] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);

  const dispatch = useDispatch();
  const pathname = usePathname();

  // Switching modules will clear the previous
  useEffect(() => {
    dispatch(clearCurrentGGSheetId());
    dispatch(clearCurrentFileId());
  }, [pathname]);

  // Fetch document data when currentDocumentId changes
  useEffect(() => {
    if (currentDocumentId && status === "authenticated") {
      fetchFileData(currentDocumentId).then((res) => {
        dispatch(setChatId(res.chatId));
        setFileName(res.fileName);
        setData(res.content);
      });
    }
  }, [currentDocumentId]);

  // useEffect(() => {
  //   if (status === "authenticated" && session?.user) {
  //     getAllFileInfo(session.user.id).then((res) => {
  //       console.log("Documents: ", res);
  //       dispatch(addDocuments(res));
  //     });
  //   }
  // }, [status, session, pathname]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];

    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    if (
      !file.name.endsWith(".pdf") &&
      !file.name.endsWith(".txt") &&
      !file.name.endsWith(".docx") &&
      !file.name.endsWith(".doc")
    ) {
      toast.error(
        "Please upload a valid Document file (.pdf, .txt, .docx, .doc)."
      );
      return;
    }

    if (session?.user.id === undefined) {
      toast.error("User session not found. Please log in.");
      return;
    }

    uploadFile(file, session.user.id).then((uploadedData) => {
      // console.log(uploadedData);

      dispatch(setCurrentDocumentId(uploadedData.id));
      setFileName(uploadedData.fileName);
      toast.success("File uploaded successfully!");
    });
  };

  return {
    fileName,
    data,
    handleUpload,
  };
};
