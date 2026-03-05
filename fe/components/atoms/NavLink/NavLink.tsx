"use client";

import { FC } from "react";
import Link from "next/link";
import clsx from "clsx";
import styles from "./NavLink.module.css";
import { IconType } from "react-icons";
import { CustomIcon } from "../CustomIcon/CustomIcon";

interface NavLinkProps {
  href: string;
  icon: IconType; // Accepts an icon component
  isActive: boolean;
}

const NavLink: FC<NavLinkProps> = ({ href, icon, isActive }) => {
  return (
    <Link
      href={href}
      className={clsx(styles.link, { [styles.active]: isActive })}
    >
      <CustomIcon
        IconComponent={icon}
        size={30}
        color={isActive ? "#000" : "#C7C8CC"}
        className={styles.icon}
      />
      {/* <span className={styles.label}>{label}</span> */}
    </Link>
  );
};

export { NavLink };
