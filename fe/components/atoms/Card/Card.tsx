"use client";

import { FC, ReactNode } from "react";
import clsx from "clsx";
import styles from "./Card.module.css";

interface CardProps {
  children: ReactNode;
  className?: string; // Optional className for additional styling
}

const Card: FC<CardProps> = ({ children, className }) => {
  return <div className={clsx(styles.card, className)}>{children}</div>;
};
export { Card };
