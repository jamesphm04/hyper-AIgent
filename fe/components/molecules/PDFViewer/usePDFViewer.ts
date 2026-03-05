import { useState } from "react";
import { pdfjs } from "react-pdf";

export const usePDFViewer = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.8);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onLoadSuccess = (pdf: any) => {
    setLoading(false);
    setError(null);
    onDocumentLoadSuccess(pdf);
  };

  const onLoadError = (error: Error) => {
    setLoading(false);
    setError(error.message || "Failed to load PDF");
  };

  const onPageLoadSuccess = () => {
    setLoading(false);
  };

  // Zoom handlers
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 5)); // max 5x
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.2)); // min 0.2x
  const resetZoom = () => setScale(1);

  return {
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
  };
};
