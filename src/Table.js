import React from "react";

import Paper from "@material-ui/core/Paper";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

export default function BasicTable({ title, rows }) {
  return (
    <TableContainer component={Paper}>
      <Table className={style.table} size='small'>
        <TableBody>
          {rows.length > 0 &&
            rows.map((row) => {
              return (
                <TableRow style={style.tableRow}>
                  {row.map((item) => (
                    <TableCell
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
  tableRow: {
    maxWidth: "10px"
  },
  table: {
    maxWidth: "800px",
    maxHeight: "300px"
  }
};
