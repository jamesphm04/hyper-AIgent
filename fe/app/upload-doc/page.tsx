"use client";

import { Card } from "@/components/atoms/Card/Card";
import styles from "./page.module.css";
import stylesCard from "@/components/atoms/Card/Card.module.css";
import { useUploadDocPage } from "./useUploadDocPage";
import PDFViewer from "@/components/molecules/PDFViewer/PDFViewer";

export default function UploadPage() {
  const { fileName, data, handleUpload } = useUploadDocPage();

  return (
    <>
      {fileName ? (
        <Card>
          <div className={styles.pdfViewerWrapper}>
            {/* <Table data={data} /> */}
            <PDFViewer fileName={fileName} data={data} />
          </div>
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
    </>
  );
}
