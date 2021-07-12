import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

//const props = require('../mock/container.json')

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontWeight: 700,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  container: {
    maxHeight: "70vh",
  },
  table: {
    minWidth: 700,
  },
  preStyle: {
    whiteSpace: "break-spaces",
  },
});

export const MetaTable = (props) => {
  const classes = useStyles();
  const {
    data: {
      message: { results: data },
    },
  } = props;
  return (
    <>
      <TableContainer className={classes.container} component={Paper}>
        <Table className={classes.table} aria-label="meta data" stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell className={classes.sticky}>#</StyledTableCell>
              <StyledTableCell>Crane ID</StyledTableCell>
              <StyledTableCell>Info</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((ele, index) => {
              return (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>
                    <pre>{ele.craneId}</pre>
                  </StyledTableCell>
                  <StyledTableCell>
                    <pre className={classes.preStyle}>
                      {JSON.stringify(ele, null, 2)}
                    </pre>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default MetaTable;
