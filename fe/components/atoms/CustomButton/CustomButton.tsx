"use client";

import { FC, ReactNode } from "react";
import clsx from "clsx";
import styles from "./CustomButton.module.css";
import { Button, styled } from "@mui/material";

const StyledButton = styled(Button)(({ theme }) => ({
  "&:active": {
    backgroundColor: "#afafaf",
  },
  backgroundColor: "transparent",
  color: "white",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.2s",
  "&:disabled": {
    backgroundColor: "#d3d3d3",
    cursor: "not-allowed",
  },
}));

interface CustomButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const CustomButton: FC<CustomButtonProps> = ({
  children,
  onClick,
  className,
  disabled,
}) => {
  return (
    <StyledButton
      onClick={onClick}
      className={clsx(styles.customButton, className)}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

export { CustomButton };
