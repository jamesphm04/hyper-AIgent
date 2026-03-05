import clsx from "clsx";
import { FC } from "react";
import { IconType } from "react-icons";
import styles from "./CustomIcon.module.css";

interface CustomIconProps {
  IconComponent: IconType;
  size?: number;
  color?: string;
  className?: string;
}

const CustomIcon: FC<CustomIconProps> = ({
  IconComponent,
  size = 24,
  color = "#000",
  className,
}) => {
  return (
    <IconComponent
      size={size}
      color={color}
      className={clsx(styles.icon, className)}
    />
  );
};

export { CustomIcon };
