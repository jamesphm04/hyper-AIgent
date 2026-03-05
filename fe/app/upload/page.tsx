"use client";

import { Card } from "@/components/atoms/Card/Card";
import styles from "./page.module.css";
import stylesCard from "@/components/atoms/Card/Card.module.css";
import { useUploadPage } from "./useUploadPage";
import { Table } from "@/components/atoms/Table/Table";
import stylesTable from "@/app/page.module.css";
import { SheetsBar } from "@/components/organisms/SheetsBar/SheetsBar";
import ColumnDescriptionModal from "@/components/organisms/ColumnDescriptionModal/ColumnDescriptionModal";
import { CustomButton } from "@/components/atoms/CustomButton/CustomButton";
import { FiEdit } from "react-icons/fi";

export default function UploadPage() {
  const {
    isOpenColDescModal,
    fileName,
    data,
    type,
    availableSheets,
    currentSheetIdx,
    setCurrentSheetIdx,
    handleUpload,
    openColDescModal,
    closeColDescModal,
  } = useUploadPage();

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
          {type === "xlsx" && (
            <SheetsBar
              currentSheetIdx={currentSheetIdx}
              setCurrentSheetIdx={setCurrentSheetIdx}
              availableSheets={availableSheets}
            />
          )}
        </Card>
      ) : (
        <Card className={stylesCard.center}>
          <label className={styles.uploadLabel}>
            <img
              className={styles.logo}
              src="/upload_icon_btn.png"
              alt="Upload icon"
            />
            <input
              type="file"
              className={styles.hiddenInput}
              onChange={handleUpload}
            />
          </label>
        </Card>
      )}
      <ColumnDescriptionModal
        isOpenColDescModal={isOpenColDescModal}
        handleClose={closeColDescModal}
      />
    </>
  );
}
