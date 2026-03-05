"use client";

import styles from "./ListItems.module.css";
import { FileItem } from "../FileItem/FileItem";
import { useListItems } from "./useListItems";

const ListItems = () => {
  const { currentItemId, itemInfoList } = useListItems();

  return (
    <div className={styles.wrapper}>
      {itemInfoList.map((item, index) => (
        <FileItem
          key={`${item.id}-${index}`}
          name={item.name}
          id={item.id}
          chatID={item.chatID}
          isActive={currentItemId === item.id}
        />
      ))}
    </div>
  );
};

export { ListItems };
