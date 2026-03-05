"use client";

import { Card } from "@/components/atoms/Card/Card";
import styles from "./page.module.css";
import stylesCard from "@/components/atoms/Card/Card.module.css";
import { useGGSheetPage } from "./useGGSheetPage";
import { SheetsBar } from "@/components/organisms/SheetsBar/SheetsBar";
import { Table } from "@/components/atoms/Table/Table";
import stylesTable from "@/app/page.module.css";
import { Input } from "@/components/atoms/Input/Input";
import { CustomButton } from "@/components/atoms/CustomButton/CustomButton";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import ColumnDescriptionModal from "@/components/organisms/ColumnDescriptionModal/ColumnDescriptionModal";
import CopyToClipboard from "@/components/molecules/CopyToClipboard/CopyToClipboard";
import { CircularProgress } from "@mui/material";

export default function GgSheetPage() {
  const {
    uploading,
    isOpenColDescModal,
    fileName,
    inputValue,
    data,
    availableSheets,
    currentSheetIdx,
    setCurrentSheetIdx,
    handleInputChange,
    handleSubmit,
    openColDescModal,
    closeColDescModal,
  } = useGGSheetPage();

  return (
    <>
      {fileName ? (
        <Card>
          <div className={stylesTable.fileInfo}>
            <span className={stylesTable.fileName}>{fileName}</span>
            <CustomButton onClick={openColDescModal}>
              <FiEdit size={20} color="#000" />
            </CustomButton>
          </div>
          <div className={stylesTable.tableWrapper}>
            <Table data={data} />
          </div>
          <SheetsBar
            setCurrentSheetIdx={setCurrentSheetIdx}
            currentSheetIdx={currentSheetIdx}
            availableSheets={availableSheets}
          />
        </Card>
      ) : (
        <Card className={stylesCard.center}>
          <div className={styles.flexColumn}>
            <p className={styles.instructionText}>
              Please share the Google Sheet file with this email first:
            </p>
            <CopyToClipboard text="python-api@calm-velocity-441008-u3.iam.gserviceaccount.com" />

            <div className={styles.inputContainer}>
              <Input
                placeholder="Paste your Google Sheet URL here..."
                value={inputValue}
                onChange={handleInputChange}
              />
              <CustomButton onClick={handleSubmit} disabled={uploading}>
                {uploading ? (
                  <CircularProgress size={20} />
                ) : (
                  <IoCloudUploadOutline size={20} color="#000" />
                )}
              </CustomButton>
            </div>
          </div>
        </Card>
      )}
      <ColumnDescriptionModal
        isOpenColDescModal={isOpenColDescModal}
        handleClose={closeColDescModal}
      />
    </>
  );
}
