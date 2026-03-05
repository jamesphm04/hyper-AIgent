import { RootState } from "@/lib/redux/store";
import {
  getColDesc as getColDescFile,
  updateColDesc as updateColDescFile,
} from "@/services/files/fileService";
import {
  getColDesc as getColDescGGSheet,
  updateColDesc as updateColDescGGSheet,
} from "@/services/gg-sheets/ggSheetService";
import { stat } from "fs";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useColumnDescriptionModal = (handleClose: () => void) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Fetched column description string of json
  const [colDescJson, setColDescJson] = useState<any>({});

  // State to hold the column description state
  const [colDescState, setColDescState] = useState<typeof colDescJson>({});

  const {
    ggSheet: { currentGGSheetId },
    upload: { currentFileId },
  } = useSelector((state: RootState) => ({
    ggSheet: state.ggSheetReducer.value,
    upload: state.uploadReducer.value,
  }));

  const handleInputChange = (
    sheetName: string,
    columnName: string,
    value: string
  ) => {
    setColDescState((prev: any) => ({
      ...prev,
      [sheetName]: {
        ...prev[sheetName],
        [columnName]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!currentGGSheetId && !currentFileId) {
      console.error("No current GG Sheet ID or File ID available.");
      return;
    }

    const colDescString = JSON.stringify(colDescState);

    if (currentFileId && pathname === "/upload") {
      await updateColDescFile(currentFileId, colDescString);
    } else if (currentGGSheetId && pathname === "/gg-sheet") {
      await updateColDescGGSheet(currentGGSheetId, colDescString);
    }

    handleClose();
  };

  useEffect(() => {
    setColDescState(colDescJson); // initialize when modal opens
  }, [colDescJson]);

  useEffect(() => {
    const fetchColDesc = async () => {
      if (status !== "authenticated" || (!currentGGSheetId && !currentFileId)) {
        return;
      }

      if (currentFileId && pathname === "/upload") {
        const colDescJson = await getColDescFile(currentFileId);
        setColDescJson(colDescJson);
      } else if (currentGGSheetId && pathname === "/gg-sheet") {
        const colDescJson = await getColDescGGSheet(currentGGSheetId);
        setColDescJson(colDescJson);
      }
    };
    fetchColDesc();
  }, [status, currentGGSheetId, currentFileId]);

  return {
    colDescJson,
    colDescState,
    handleInputChange,
    handleSave,
  };
};
