import React from "react";
import { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Slider from "@material-ui/core/Slider";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TimePicker from "./timepicker";
import { useSettingStyles } from "./styles";
import { fmtDT } from "../utils/general.js";

export function DateTimePickers(props) {
  const classes = useSettingStyles();
  const { id, label, value, setValue } = props;
  const defaultValue = !value ? fmtDT(new Date()) : fmtDT(new Date(value));
  const defaultDate = defaultValue.slice(0, 10);
  const defaultTime = defaultValue.slice(-5);
  const [dateValue, setDateValue] = useState(defaultDate);
  const [timeValue, setTimeValue] = useState(defaultTime);
  const changeDate = (e) => {
    setDateValue(e.target.value);
    const dtStr = e.target.value + "T" + timeValue;
    handleChange(dtStr);
  };
  const changeTime = (newValue) => {
    setTimeValue(newValue);
    const dtStr = dateValue + "T" + newValue;
    handleChange(dtStr);
  };
  const handleChange = (dtStr) => {
    const date = new Date(dtStr);
    const GMTDate = fmtDT(date);
    setValue(GMTDate.indexOf("aN") > 0 ? null : GMTDate);
  };
  return (
    <Box className={classes.datePicker}>
      <Typography variant="body2" gutterBottom>
        {label}
      </Typography>
      <TextField type="date" value={dateValue} onChange={changeDate} />
      <TimePicker
        data_id={id}
        defaultValue={timeValue}
        handleChange={changeTime}
      />
    </Box>
  );
}

export function RangeSlider(props) {
  const classes = useSettingStyles();
  const { defaultValue, setValue } = props;
  const marks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 25,
      label: "25%",
    },
    {
      value: 50,
      label: "50%",
    },
    {
      value: 90,
      label: "90%",
    },
    {
      value: 100,
      label: "100%",
    },
  ];
  const handleChange = (e, newValue) => {
    setValue(newValue);
  };
  return (
    <div className={classes.rangeRoot}>
      <Typography id="confidence" variant="body2" gutterBottom>
        Confidence (%)
      </Typography>
      <Slider
        max={100}
        min={0}
        step={1}
        marks={marks}
        valueLabelDisplay="auto"
        defaultValue={defaultValue}
        onChange={handleChange}
        aria-labelledby="confidence-range-slider"
      />
    </div>
  );
}

export const FilterSetting = (props) => {
  const classes = useSettingStyles();
  const {
    open,
    setOpen,
    containerNum,
    rangeValue,
    lockTime,
    unlockTime,
    comfirmFilter,
  } = props;
  const [filterNum, setFilterNum] = useState(containerNum);
  const [filterRange, setFilterRange] = useState(rangeValue);
  const [filterLockTime, setFilterLockTime] = useState(lockTime);
  const [filterUnlockTime, setFilterUnlockTime] = useState(unlockTime);
  const handleClose = () => {
    setOpen(false);
  };
  const handleComfirm = () => {
    comfirmFilter(filterNum, filterRange, filterLockTime, filterUnlockTime);
    handleClose();
  };
  const handleReset = () => {
    setFilterNum(null);
    setFilterRange(null);
    setFilterLockTime(null);
    setFilterUnlockTime(null);
    comfirmFilter(null, null, null, null);
    handleClose();
  };
  return (
    <Dialog open={open} aria-labelledby="Filter Condition">
      <DialogTitle>Filter Condition Setting</DialogTitle>
      <DialogContent className={classes.container}>
        <TextField
          label="Container Number"
          defaultValue={containerNum}
          onChange={(e) => setFilterNum(e.target.value)}
        />
        <DateTimePickers
          id="lock"
          label="Lock At"
          value={filterLockTime}
          setValue={setFilterLockTime}
        />
        <DateTimePickers
          id="unlock"
          label="Unlock At"
          value={filterUnlockTime}
          setValue={setFilterUnlockTime}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleReset} color="primary">
          Reset
        </Button>
        <Button color="primary" onClick={handleComfirm}>
          Comfirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterSetting;
