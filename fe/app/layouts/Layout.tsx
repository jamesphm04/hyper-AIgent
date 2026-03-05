"use client";

import { FC, ReactNode } from "react";
import { SideBar } from "@/components/organisms/SideBar/SideBar";
import styles from "./Layout.module.css";
import { MdOutlineFileUpload } from "react-icons/md";
import { LuFileSpreadsheet } from "react-icons/lu";
import { GrDocumentUpload } from "react-icons/gr";
import { SubSideBar } from "@/components/organisms/SubSideBar/SubSideBar";
import useLayout from "./useLayout";
import { PopupChat } from "@/components/organisms/PopupChat/PopupChat";
import GGSheetURLModal from "@/components/organisms/GGSheetURLModal/GGSheetURLModal";
import AuthModal from "@/components/organisms/AuthModal/AuthModal";

const navItems = [
  { href: "/upload", icon: MdOutlineFileUpload },
  {
    href: "/gg-sheet",
    icon: LuFileSpreadsheet,
  },
  { href: "/upload-doc", icon: GrDocumentUpload },
];

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const {
    isOpenGGSheetURLModal,
    currentGGSheetId,
    currentFileId,
    currentDocumentId,
    pathname,
    anchorEl,
    openPopup,
    setIsOpenGGSheetURLModal,
    closePopup,
  } = useLayout();

  return (
    <div className={styles.layout}>
      <AuthModal />

      {pathname !== "/sign-in" && (
        <>
          <SideBar items={navItems} activePath={pathname} />
          <SubSideBar setIsOpenGGSheetURLModal={setIsOpenGGSheetURLModal} />
          <main className={styles.main}>
            {(currentGGSheetId || currentFileId || currentDocumentId) && (
              <img
                className={styles.logo}
                src="/logo.png"
                alt="Logo"
                onClick={(event) =>
                  openPopup(event as React.MouseEvent<HTMLElement>)
                }
              />
            )}
            {(currentGGSheetId || currentFileId || currentDocumentId) && (
              <PopupChat anchorEl={anchorEl} closePopup={closePopup} />
            )}
            {isOpenGGSheetURLModal && (
              <GGSheetURLModal
                isOpen={isOpenGGSheetURLModal}
                setIsOpen={setIsOpenGGSheetURLModal}
              />
            )}

            {children}
          </main>
        </>
      )}
    </div>
  );
};

export { Layout };
