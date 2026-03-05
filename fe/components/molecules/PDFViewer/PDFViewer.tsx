"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import styles from "./PDFViewer.module.css";
import { FC, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { usePDFViewer } from "./usePDFViewer";
import { FaPlus, FaMinus } from "react-icons/fa";
import { CustomButton } from "@/components/atoms/CustomButton/CustomButton";
import { RiRestartLine } from "react-icons/ri";

const PDFViewer: FC<{ fileName: string; data: string }> = ({
  fileName,
  data,
}) => {
  const {
    numPages,
    onDocumentLoadSuccess,
    onPageLoadSuccess,
    zoomOut,
    scale,
    zoomIn,
    resetZoom,
    loading,
    error,
    onLoadSuccess,
    onLoadError,
  } = usePDFViewer();

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
  }, []);

  return (
    <div className={styles.pdfViewer}>
      {fileName && <div className={styles.fileName}>{fileName}</div>}

      <div className={styles.zoomControls}>
        <CustomButton onClick={zoomOut} disabled={scale <= 0.2}>
          <FaMinus size={12} color="#000" />
        </CustomButton>
        <span>{(scale * 100).toFixed(0)}%</span>
        <CustomButton onClick={zoomIn} disabled={scale >= 5}>
          <FaPlus size={12} color="#000" />
        </CustomButton>
        <CustomButton onClick={resetZoom}>
          <RiRestartLine size={20} color="#000" />
        </CustomButton>
      </div>

      <div className={styles.documentContainer}>
        {loading && <div className={styles.loading}>Loading PDF...</div>}

        {error && (
          <div className={styles.error}>Error loading PDF: {error}</div>
        )}

        <Document
          file={`data:application/pdf;base64,${data}`}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={<div className={styles.loading}>Loading PDF...</div>}
          error={<div className={styles.error}>Failed to load PDF</div>}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale} // <-- apply zoom scale here
              onLoadSuccess={onPageLoadSuccess}
              className={styles.page}
              loading={<div className={styles.loading}>Loading page...</div>}
              error={<div className={styles.error}>Failed to load page</div>}
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
