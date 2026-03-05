"use client";

import { FC } from "react";
import clsx from "clsx";
import styles from "./Input.module.css";

interface InputProps {
  isAutoFocus?: boolean; // Auto focus on the input field
  placeholder: string;
  name?: string;
  className?: string;
  type?: string;
  register?: any; // Include register from react-hook-form
  validationRules?: any; // Validation rules for react-hook-form
  error?: string; // Error message
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({
  isAutoFocus = false,
  placeholder,
  name,
  className,
  type = "text",
  register,
  validationRules,
  error,
  value,
  disabled,
  onChange,
  onKeyDown,
}) => {
  return (
    <div className={styles.inputWrapper}>
      <input
        autoFocus={isAutoFocus}
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={clsx(styles.input, className)}
        placeholder={placeholder}
        {...(register && name ? register(name, validationRules) : {})}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export { Input };
