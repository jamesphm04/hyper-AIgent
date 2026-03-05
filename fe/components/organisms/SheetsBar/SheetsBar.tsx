import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";

type SheetsBarProps = {
  currentSheetIdx: number;
  availableSheets: string[];
  setCurrentSheetIdx: (sheetIdx: number) => void;
};

const SheetsBar: React.FC<SheetsBarProps> = ({
  currentSheetIdx,
  availableSheets,
  setCurrentSheetIdx,
}) => {
  const handleChange = (event: React.SyntheticEvent, newSheetIdx: number) => {
    setCurrentSheetIdx(newSheetIdx);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f2efe5",
        color: "#C7C8CC",
        ".MuiTabs-root": {
          overflow: "hidden",
          minHeight: "30px",
        },
        ".MuiTab-root": {
          minHeight: "30px",
          height: "30px",
          backgroundColor: "#f2efe5",
          color: "#C7C8CC",
        },
        ".Mui-selected": {
          backgroundColor: "#E3E1D9",
          color: "#000",
        },
        ".mui-1qltlow-MuiTabs-indicator": {
          backgroundColor: "#000",
        },
      }}
    >
      <Tabs
        value={currentSheetIdx}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons={false}
        aria-label="scrollable prevent tabs example"
      >
        {availableSheets.map((sheetName, sheetIdx) => (
          <Tab key={sheetIdx} label={sheetName} />
        ))}
      </Tabs>
    </Box>
  );
};

export { SheetsBar };
