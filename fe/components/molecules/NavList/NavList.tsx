"use client";

import { FC } from "react";
import { NavLink } from "@/components/atoms/NavLink/NavLink";
import styles from "./NavList.module.css";
import { IconType } from "react-icons";

interface NavListProps {
  items: { href: string; icon: IconType }[];
  activePath: string;
}

const NavList: FC<NavListProps> = ({ items, activePath }) => {
  return (
    <nav className={styles.nav}>
      {items.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          icon={item.icon}
          isActive={item.href === activePath}
        />
      ))}
    </nav>
  );
};

export { NavList };
