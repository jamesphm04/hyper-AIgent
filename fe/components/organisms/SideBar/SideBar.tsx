"use client";

import { FC } from "react";
import { NavList } from "@/components/molecules/NavList/NavList";
import styles from "./SideBar.module.css";
import { IconType } from "react-icons";
import { useSideBar } from "./useSideBar";
import { Profile } from "../Profile/Profile";

interface SideBarProps {
  items: { href: string; icon: IconType }[];
  activePath: string;
}

const SideBar: FC<SideBarProps> = ({ items, activePath }) => {
  return (
    <aside className={styles.sidebar}>
      <a href="/">
        <img className={styles.logo} src="/logo.png" alt="Logo" />
      </a>
      <div className={styles.divider} />
      <NavList items={items} activePath={activePath} />
      <div className={styles.spacer} />
      <Profile />
    </aside>
  );
};

export { SideBar };
