import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

export default function BasicTable({ title, rows }) {
  let index = 0;

  return (
    <TableContainer component={Paper}>
      <Table className={style.table} size='small'>
        <TableBody>
          {rows.length > 0 &&
            rows.map((row) => {
              index++;

              return (
                <TableRow style={style.tableRow}>
                  {row.map((item) => (
                    <TableCell
                      key={index}
                      component='th'
                      scope='row'
                      style={{ backgroundColor: item === 1 && "yellow" }}
                    >
                      {item}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const style = {
  tableHead: {
    fontSize: "10px",
    width: "10%",
    height: "10%"
  },
  tableCell: {
    fontSize: "14px",
    maxWidth: "10px"
  },
  tableRow: {
    maxWidth: "10px"
  },
  table: {
    maxWidth: "800px",
    maxHeight: "300px"
  }
};
