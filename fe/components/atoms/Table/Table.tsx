import * as React from "react";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress } from "@mui/material";
import { useTable } from "./useTable";

interface CustomTableProps {
  data: Object[];
}

const CustomTable: React.FC<CustomTableProps> = ({ data }) => {
  const { pathname } = useTable();

  if (data.length === 0 && pathname !== "/") {
    return <CircularProgress />;
  } else if (data.length === 0 && pathname === "/") {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "black" }}>
        <h2>Welcome!</h2>
        <p>Please select a service on the left sidebar to get started.</p>
      </div>
    );
  }

  return (
    <TableContainer component={Paper}>
      <MuiTable sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {Object.keys(data[0]).map((key, index) => (
              <TableCell
                key={key}
                align={index === 0 ? "left" : "right"}
                sx={{ backgroundColor: "#b4b4b8", fontWeight: "bold" }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={`${index}-${crypto.randomUUID()}`} // Use crypto.randomUUID() to create a unique key
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {Object.values(row).map((value, index) => (
                <TableCell
                  key={index}
                  align={index === 0 ? "left" : "right"}
                  sx={{ backgroundColor: "#E3E1D9" }}
                >
                  {String(value)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export { CustomTable as Table };
