import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { IoMdCheckmark } from "react-icons/io";
import styles from "./ColumnDescriptionModal.module.css";
import { CustomButton } from "@/components/atoms/CustomButton/CustomButton";
import { useColumnDescriptionModal } from "./useColumnDescriptionModal";

interface Props {
  isOpenColDescModal: boolean;
  handleClose: () => void;
}

const ColumnDescriptionModal: React.FC<Props> = ({
  isOpenColDescModal,
  handleClose,
}) => {
  const { colDescState, handleInputChange, handleSave } =
    useColumnDescriptionModal(handleClose);

  return (
    <Dialog
      open={isOpenColDescModal}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: "#f2efe5",
          borderRadius: "30px",
          padding: "10px",
          maxHeight: "60vh",
        },
      }}
    >
      <DialogTitle>Column Description</DialogTitle>
      <DialogContent
        dividers
        sx={{
          overflowY: "auto",
          maxHeight: "60vh",
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari
        }}
      >
        {Object.entries(colDescState).map(([sheetName, columns]) => (
          <Box key={sheetName} sx={{ marginBottom: 2 }}>
            <Typography variant="h6" gutterBottom>
              {sheetName}
            </Typography>
            {Object.entries(columns as Record<string, string>).map(
              ([colName, desc]) => (
                <TextField
                  key={colName}
                  label={colName}
                  value={desc}
                  fullWidth
                  margin="dense"
                  onChange={(e) =>
                    handleInputChange(sheetName, colName, e.target.value)
                  }
                />
              )
            )}
          </Box>
        ))}
      </DialogContent>
      <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
        <CustomButton onClick={handleSave}>
          <IoMdCheckmark size={20} color="#000" />
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default ColumnDescriptionModal;
