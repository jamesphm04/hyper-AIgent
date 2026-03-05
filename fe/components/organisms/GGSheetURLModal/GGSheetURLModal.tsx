import { Modal, Typography, Box, Card, CircularProgress } from "@mui/material";
import { Input } from "@/components/atoms/Input/Input";
import React from "react";
import { CustomButton } from "@/components/atoms/CustomButton/CustomButton";
import { IoCloudUploadOutline } from "react-icons/io5";
import stylesGGSheetPage from "@/app/gg-sheet/page.module.css";
import CopyToClipboard from "@/components/molecules/CopyToClipboard/CopyToClipboard";
import { useGGSheetModal } from "./useGGSheetModal";

type GGSheetURLModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#f2efe5",
  boxShadow: 24,
  p: 4,
  borderRadius: "30px",
  color: "black",
  width: "500px",
};

const GGSheetURLModal: React.FC<GGSheetURLModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const { uploading, inputValue, handleInputChange, handleSubmit } =
    useGGSheetModal({ setIsOpen });

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <Box sx={style}>
        <h2>Upload Google Sheet URL</h2>

        <div className={stylesGGSheetPage.flexColumn}>
          <p className={stylesGGSheetPage.instructionText}>
            Please share the Google Sheet file with this email first:
          </p>
          <CopyToClipboard text="python-api@calm-velocity-441008-u3.iam.gserviceaccount.com" />

          <div className={stylesGGSheetPage.inputContainer}>
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
      </Box>
    </Modal>
  );
};

export default GGSheetURLModal;
