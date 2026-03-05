"use client";

import stylesIconButton from "@/components/atoms/CustomIcon/CustomIcon.module.css";
import styles from "./SubSideBar.module.css";
import { ListItems } from "@/components/molecules/ListItems/ListItems";
import { CiSquarePlus } from "react-icons/ci";
import { useUploadPage } from "@/app/upload/useUploadPage";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useUploadDocPage } from "@/app/upload-doc/useUploadDocPage";

type SubSideBarProps = {
  setIsOpenGGSheetURLModal: (isOpenGGSheetURLModel: boolean) => void;
};

const SubSideBar: React.FC<SubSideBarProps> = ({
  setIsOpenGGSheetURLModal,
}) => {
  const { pathname, handleUpload } = useUploadPage();
  const { handleUpload: handleUploadDoc } = useUploadDocPage();
  return (
    <aside className={styles.subSideBar}>
      <div className={styles.info}>
        <span className={styles.title}>Files</span>
        {pathname == "/upload" || pathname == "/upload-doc" ? (
          <label style={{ cursor: "pointer" }}>
            <span className={stylesIconButton.icon}>
              <CiSquarePlus size={30} color="#000" />
            </span>
            <input
              type="file"
              className={styles.hiddenInput}
              onChange={pathname == "/upload" ? handleUpload : handleUploadDoc}
              style={{ display: "none" }}
            />
          </label>
        ) : (
          <span
            className={stylesIconButton.icon}
            onClick={() => setIsOpenGGSheetURLModal(true)}
          >
            <IoCloudUploadOutline size={20} color="#000" />
          </span>
        )}
      </div>
      <div className={styles.listWrapper}>
        <ListItems />
      </div>
    </aside>
  );
};

export { SubSideBar };
