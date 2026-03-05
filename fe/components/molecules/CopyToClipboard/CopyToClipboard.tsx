import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import { MdContentCopy } from "react-icons/md";

const CopyToClipboard = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Paper
      className="copy-box"
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        margin: "10px 0",
      }}
    >
      <Box sx={{ flexGrow: 1, fontFamily: "monospace" }}>{text}</Box>
      <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
        <Button onClick={handleCopy} sx={{ minWidth: "30px" }}>
          <MdContentCopy />
        </Button>
      </Tooltip>
    </Paper>
  );
};

export default CopyToClipboard;
