import { useState } from "react";

export const useMessage = () => {
  const [expandImage, setExpandImage] = useState(false);

  const handleExpand = () => {
    setExpandImage(true);
  };
  const handleClose = () => setExpandImage(false);

  return {
    expandImage,
    handleExpand,
    handleClose,
  };
};
