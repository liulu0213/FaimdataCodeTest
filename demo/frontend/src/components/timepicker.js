import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Popover from "@material-ui/core/Popover";

const useStyles = makeStyles((theme) => ({
	inputContainer:{
	color: 'rgba(0, 0, 0, 0.87)',
	cursor: 'text',
	display: 'inline-flex',
	position: 'relative',
	fontSize: '1rem',
	boxSizing: 'border-box',
	alignItems: 'center',
	fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
	fontWeight: 400,
	lineHeight: '1.1876em',
	letterSpacing: '0.00938em',
		"&::after":{
			left: 0,
			right: 0,
			bottom: 0,
			content: "",
			position: 'absolute',
			transform: 'scaleX(0)',
			transition: 'transform 200ms cubicbezier(0.0, 0, 0.2, 1) 0ms',
			borderBottom: '2px solid #3f51b5',
			pointerEvents: 'none',
		}
	},
	inputTime:{
		font:'inherit',
		border: 0,
		height: '1.1876em',
		margin: 0,
		padding: '6px 0 7px',
		minWidth: 0,
		background: 'none',
		boxSizing: 'content-box',
	},
	container: {
		width: "90px",
		height: "150px",
		display: "flex",
		flexFlow: "row nowrap",
		overflow: "hidden",
		paddRight: "-17px",
	},
	timerItem: {
		display: "flex",
		flexFlow: "column nowrap",
		flex: "1 0 55px",
		height: "150px",
		backgroundColor: "#fff",
		cursor: "pointer",
		"&>span": {
			display: "block",
			padding: "3px",
			textAlign: "center",
			"&:hover": {
				color: "#fff",
				backgroundColor: theme.palette.primary.main,
			},
		},
	},
	z1: {
		zIndex: 1,
		overflowY: "scroll",
		marginLeft: "8px",
	},
	z2: {
		zIndex: 2,
		overflowY: "scroll",
		marginLeft: "-15px",
	},
	z3: {
		width: "30px",
		zIndex: 3,
		marginLeft: "-17px",
	},
	hightLight: {
		backgroundColor: theme.palette.primary.main,
	},
}))

export function TimePicker(props) {
	const {data_id,defaultValue,handleChange}=props;
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState(null);
	const [timeValue, setTimeValue] = useState({ hour: defaultValue.slice(0,2), minute: defaultValue.slice(-2)});
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const open = Boolean(anchorEl);
	const id = open ? "timepicker" : undefined;
	function timerClick(event) {
		const itemName = event.currentTarget.getAttribute("usedby");
		event.currentTarget.style = "background-color:#9FA8DA";
		const numStr = ("0" + timeValue[itemName]).slice(-2);
		if (timeValue[itemName] !== null) {
			document.getElementById(itemName + numStr).style = "background-color:auto";
		}
		let v = timeValue;
		v[itemName] = event.currentTarget.innerText;

		setTimeValue(v);
        const timeStr=v.hour+":"+v.minute;
        handleChange(timeStr)
        document.getElementById('tpi'+data_id).value=timeStr;
	}
	function optList(upNum, itemName) {
		let rst = [];
		for (let i = 0; i <= upNum; i++) {
			const numStr = ("0" + i).slice(-2);
			rst[i] = (
				<span
                    key={`${itemName}${numStr}`}
					id={`${itemName}${numStr}`}
					usedby={itemName}
					onClick={timerClick}
				>
					{numStr}
				</span>
			);
		}
		return rst;
	}
	const hourOpts = optList(23, "hour");
	const minueOpts = optList(59, "minute");
	return (
		<>
			<FormControl className={classes.inputContainer}>
			<TextField
				id={`tpi${data_id}`}
				type="time"
				aria-describedby={id}
				onClick={handleClick}
//can not be triggered use js change value in Firefox and Chrome 
                //onChange={handleInputChange}
                defaultValue={ timeValue.hour + ":" + timeValue.minute}
			/>
			</FormControl>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
			>
				<div className={classes.container}>
					<div
						id="hours"
						className={`${classes.timerItem} ${classes.z1}`}
					>
						{hourOpts}
					</div>
					<div
						id="minutes"
						className={`${classes.timerItem} ${classes.z2}`}
					>
						{minueOpts}
					</div>
					{/* z3 div use to hidden scroll bar of previous div */}
					<div className={`${classes.timerItem} ${classes.z3}`}></div>
				</div>
			</Popover>
		</>
	);
}

export default TimePicker;
