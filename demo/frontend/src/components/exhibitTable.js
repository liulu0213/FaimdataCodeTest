import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { withStyles, makeStyles, createStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import FilterListIcon from "@material-ui/icons/FilterList";
import CollectionsOutlinedIcon from "@material-ui/icons/CollectionsOutlined";
import ContainerPhoto from "./containerPhoto";
import PopupMap from "./popupMap";
import TablePaginationActions from "./tablePaginationActions";
import Loading from "./Loading";
import FilterSetting from "./setting";
import { fmtDate, fetchPathBuilder } from "../utils/general";

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

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      maxHeight: "62vh",
    },
    table: {
      minWidth: 700,
    },
    hightlight: {
      backgroundColor: "#eeeeee",
    },
    conditionInfo: {
      flex: "1 1 auto",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  })
);

function paginationInfo(urlQuery) {
  const params = {
    page: 0,
    pageSize: 10,
    crane_id: "",
    unlockTime_lte: "",
    lockTime_gte: "",
    order_by: "unlockTime",
    sort: "DESC",
  };
  const obj = {};
  const p = new URLSearchParams(urlQuery);
  for (const key of p.keys()) {
    if (p.getAll(key).length > 1) {
      obj[key] = p.getAll(key);
    } else {
      obj[key] = key === "page" ? parseInt(p.get(key) - 1) : p.get(key);
    }
  }
  return { ...params, ...obj };
}

/** Use to exhibit data in MovingLine component */
export const ExhibitTable = (props) => {
  const {
    apiPath,
    param,
    setParam,
    data: {
      message: {
        results: rst,
        responseInfo: { totalRows },
      },
    },
    setPoint,
    switchShowMap,
    setOpenDialog,
    setCoordinate,
  } = props;
  const pinfo = paginationInfo(param);
  const [page, setPage] = useState(pinfo.page);
  const [rowsPerPage, setRowsPerPage] = useState(pinfo.pageSize);
  const [orderby, setOrderby] = useState(pinfo.order_by);
  const [sortDirection, setSortDirection] = useState(pinfo.sort);
  const [rowsDataLoaded, setRowsDataLoaded] = useState(false);
  /* rangeValue, lockat, unlockat is used by Filter setting component */
  const [openFilter, setOpenFilter] = useState(false);
  const [containerNum, setContainerNum] = useState();
  const [rangeValue, setRangeValue] = useState();
  const [lockTime, setLockTime] = useState();
  const [unlockTime, setUnlockTime] = useState();

  const classes = useStyles();
  const rows = rst.map((ele) => {
    const {
      result: con_list,
      code: con_number,
      confidence,
      craneId: crane_id,
      lock: lock_action,
      unlock: unlock_action,
      lock: { action_time: lockTime },
      unlock: { action_time: unlockTime },
      lockBlock,
      unlockBlock,
      movePath,
      result: { uuid },
    } = ele;

    lock_action.location = lock_action.location || {
      lat: 0,
      lon: 0,
    };
    unlock_action.location = unlock_action.location || {
      lat: 0,
      lon: 0,
    };
    /************************************** */
    return {
      containerName: con_number || "UNKNOWN",
      recognizedCount:
        (con_list.positive && con_list.positive.count) ||
        (con_list.negative && -con_list.negative[0].data.length) ||
        0,
      picture:
        (con_list.positive &&
          con_list.positive.data[0] &&
          con_list.positive.data[0].rpath) ||
        (con_list.negative &&
          con_list.negative[0] &&
          con_list.negative[0].data[0] &&
          con_list.negative[0].data[0].rpath) ||
        "NA",
      bucketName:
        (con_list.positive &&
          con_list.positive.data[0] &&
          con_list.positive.data[0].bucketName) ||
        (con_list.negative &&
          con_list.negative[0].data[0] &&
          con_list.negative[0].data[0].bucketName) ||
        "",
      coordinate: unlock_action.location || "",
      recognitions: con_list || "",
      confidence: confidence || "",
      crane: crane_id,
      lockAt: lockTime,
      unlockAt: unlockTime,
      lockBlock: lockBlock,
      unlockBlock: unlockBlock,
      movePath,
      pos: {
        uPos: lock_action.location,
        dPos: unlock_action.location,
      },
      uuid,
    };
  });
  const handlePageChange = (event, newPage) => {
    const size = rowsPerPage;
    const page = newPage;
    const order = orderby;
    const confidenceRange = rangeValue;
    const lockat = lockTime;
    const unlockat = unlockTime;
    const fetchPath = fetchPathBuilder(
      apiPath,
      size,
      page,
      order,
      sortDirection,
      containerNum,
      confidenceRange,
      lockat,
      unlockat
    );
    //setRowsPerPage(size);
    setPage(page);
    setParam(fetchPath);
    setRowsDataLoaded(false);
  };
  const handleRowsPerPageChange = (event) => {
    const size = parseInt(event.target.value, 10);
    const page = 0;
    const order = orderby;
    const confidenceRange = rangeValue;
    const lockat = lockTime;
    const unlockat = unlockTime;
    const fetchPath = fetchPathBuilder(
      apiPath,
      size,
      page,
      order,
      sortDirection,
      containerNum,
      confidenceRange,
      lockat,
      unlockat
    );
    setRowsPerPage(size);
    setPage(page);
    setParam(fetchPath);
  };
  const handleSortRqt = (e, clickedId) => {
    const size = rowsPerPage;
    const page = 0;
    const order = clickedId;
    const sort =
      orderby !== order ? "DESC" : sortDirection === "ASC" ? "DESC" : "ASC";
    const confidenceRange = rangeValue;
    const lockat = lockTime;
    const unlockat = unlockTime;
    setSortDirection(sort);
    setOrderby(order);
    const fetchPath = fetchPathBuilder(
      apiPath,
      size,
      page,
      order,
      sort,
      containerNum,
      confidenceRange,
      lockat,
      unlockat
    );
    //setRowsPerPage(size);
    setPage(page);
    setParam(fetchPath);
    setRowsDataLoaded(false);
  };
  const handleComfirmFilter = (conNum, rangeArea, lockat, unlockat) => {
    setContainerNum(conNum);
    setRangeValue(rangeArea);
    setLockTime(lockat);
    setUnlockTime(unlockat);
    const size = rowsPerPage;
    const page = 0;
    const order = orderby;
    const fetchPath = fetchPathBuilder(
      apiPath,
      size,
      page,
      order,
      sortDirection,
      conNum,
      rangeArea,
      lockat,
      unlockat
    );
    //setRowsPerPage(size);
    setPage(page);
    //    setFetchPath(apiPath);
    setParam(fetchPath);
    setRowsDataLoaded(false);
  };
  const handleDelete = (stateToDel) => () => {
    const states = {
      containerNum: function () {
        handleComfirmFilter(null, rangeValue, lockTime, unlockTime);
      },
      rangeValue: function () {
        handleComfirmFilter(containerNum, null, lockTime, unlockTime);
      },
      lockTime: function () {
        handleComfirmFilter(containerNum, rangeValue, null, unlockTime);
      },
      unlockTime: function () {
        handleComfirmFilter(containerNum, rangeValue, lockTime, null);
      },
    };
    states[stateToDel]();
  };
  const listItemGenerator = (content, stateName) => (
    <Chip
      label={content}
      onDelete={handleDelete(stateName)}
      color="secondary"
    />
  );
  useEffect(() => {
    // Here is for reset the filter info after did switchCrane
    if (param === "") {
      setPage(pinfo.page);
      setRowsPerPage(pinfo.pageSize);
      setOrderby(pinfo.order_by);
      setSortDirection(pinfo.sort);
      setContainerNum(pinfo.crane_id);
      setLockTime(pinfo.lockTime);
      setUnlockTime(pinfo.unlockTime);
    }
  }, [param]);
  useEffect(() => {
    // use to spinning table body part when filter condition changed in seem crane info
    setRowsDataLoaded(true);
  }, [rst]);
  return (
    <>
      <Toolbar
        className={clsx({
          [classes.hightlight]:
            containerNum || rangeValue || lockTime || unlockTime,
        })}
      >
        <Box className={classes.conditionInfo}>
          {!containerNum ||
            listItemGenerator(
              `Container Number: ${containerNum}`,
              "containerNum"
            )}
          {!lockTime ||
            listItemGenerator(
              `Lock Time start at ${lockTime.replace(/T/, " ")}`,
              "lockTime"
            )}
          {!unlockTime ||
            listItemGenerator(
              `Unlock Time end at ${unlockTime.replace(/T/, " ")}`,
              "unlockTime"
            )}
        </Box>
        <IconButton
          aria-label="Filter List"
          onClick={() => setOpenFilter(true)}
        >
          <FilterListIcon />
        </IconButton>
      </Toolbar>
      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} aria-label="data exhibit" stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell>Container</StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={orderby === "lockTime"}
                  direction={sortDirection.toLowerCase()}
                  onClick={(e) => {
                    // request sort url
                    handleSortRqt(e, "lockTime");
                    e.preventDefault();
                  }}
                >
                  Lock
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={orderby === "unlockTime"}
                  direction={sortDirection.toLowerCase()}
                  onClick={(e) => {
                    setOrderby("unlockTime");
                    handleSortRqt(e, "unlockTime");
                    e.preventDefault();
                  }}
                >
                  Unlock
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>Moving Line</StyledTableCell>
              <StyledTableCell>Details</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody className={classes.autoHeight}>
            {rowsDataLoaded ? (
              totalRows === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={8}>
                    <Typography align="center" component="h2">
                      No Result Found.
                    </Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                rows.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>
                      <ContainerPhoto
                        uuid={row.uuid}
                        containerCode={row.containerName}
                        bucketName={row.bucketName}
                        src={row.picture}
                        setOpenDialog={setOpenDialog}
                        coordinate={row.coordinate}
                        setCoordinate={setCoordinate}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="body2">
                        {row.containerName}
                      </Typography>
                      <Typography variant="caption" color="secondary">
                        (recognized{" "}
                        {row.recognizedCount >= 0 ? row.recognizedCount : 0}{" "}
                        times)
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="body2">
                        {fmtDate(row.lockAt)}
                      </Typography>
                      {row.lockBlock ? (
                        <Typography variant="caption" color="secondary">
                          {row.lockBlock}
                        </Typography>
                      ) : (
                        ""
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="body2">
                        {fmtDate(row.unlockAt)}
                      </Typography>
                      {row.unlockBlock ? (
                        <Typography variant="caption" color="secondary">
                          {row.unlockBlock}
                        </Typography>
                      ) : (
                        ""
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      <PopupMap
                        setPoint={setPoint}
                        switchShowMap={switchShowMap}
                        {...row}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button
                        size="small"
                        startIcon={<CollectionsOutlinedIcon />}
                        onClick={() => {
                          props.setItem(row);
                        }}
                        disabled={row.recognizedCount === 0}
                      >
                        Check-out
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={8}>
                  <Loading />
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 50]}
        component="div"
        count={parseInt(totalRows) || 0}
        rowsPerPage={rowsPerPage}
        page={parseInt(page) || 0}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count !== 0 ? count : to}`
        }
        ActionsComponent={TablePaginationActions}
      />
      <FilterSetting
        open={openFilter}
        setOpen={setOpenFilter}
        containerNum={containerNum}
        rangeValue={rangeValue || [0, 100]}
        setRangeValue={setRangeValue}
        lockTime={lockTime}
        setLockTime={setLockTime}
        unlockTime={unlockTime}
        setUnlockTime={setUnlockTime}
        comfirmFilter={handleComfirmFilter}
      />
    </>
  );
};
export default ExhibitTable;
