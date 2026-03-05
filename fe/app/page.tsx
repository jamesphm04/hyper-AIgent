"use client";

import { Card } from "@/components/atoms/Card/Card";
import { Table } from "@/components/atoms/Table/Table";
import styles from "./page.module.css";

const Home = () => {
  return (
    <div>
      <Card>
        <div className={styles.fileInfo}>
          <span className={styles.fileName}></span>
        </div>
        <div className={styles.tableWrapper}>
          <Table data={[]} />
        </div>
      </Card>
    </div>
  );
};

export default Home;
