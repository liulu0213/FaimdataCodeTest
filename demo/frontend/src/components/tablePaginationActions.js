import React from "react";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import transitions from "@material-ui/core/styles/transitions";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    backgroundColor: transitions,
  },
  gotoPage: {
    margin: theme.spacing(1),
    width: 100,
    paddingLeft: 50,
    fontSize: "inherit",
    "&::before": {
      content: '"Goto:"',
      lineHeight: "28px",
    },
  },
}));
export default function TablePaginationActions(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage)) - 1);
  };

  const handleGotoPageClick = (event) => {
    onPageChange(event, parseInt(event.target.value) - 1);
  };
  const pages = () => {
    let rst = [];
    for (let i = 1; i <= Math.ceil(count / rowsPerPage); i++) {
      rst.push(
        <MenuItem key={i} value={i}>
          {i}
        </MenuItem>
      );
    }
    return (
      <>
        <Select
          className={classes.gotoPage}
          labelId="gotoPageLabel"
          value={parseInt(page) + 1}
          onChange={handleGotoPageClick}
        >
          {rst}
        </Select>
      </>
    );
  };

  return (
    <div className={classes.root}>
      {pages()}
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}
