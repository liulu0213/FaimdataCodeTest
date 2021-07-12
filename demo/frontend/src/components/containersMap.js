import React, { useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TablePagination from "@material-ui/core/TablePagination";
import TablePaginationActions from "./tablePaginationActions";
import { useContainersMapStyles } from "./styles";
import useFetch from "../service/queryData";

export const ContainerList = (props) => {
    const { data, marker, handleMarker } = props;
    if (data.page_count === 0) return <></>;
    const rst = data.result.filter((e) => Boolean(e.location));
    return rst.map((ele, index) => (
        <FormControlLabel
        key={index}
        control={
            <Checkbox
            size="small"
            checked={marker.some((e) => e.name === ele.con_number)}
            onChange={handleMarker}
            name={ele.con_number}
            value={`${ele.location.lat},${ele.location.lon}`}
            />
        }
        label={ele.con_number}
        />
    ));
};

export const ContainersMap = () => {
    const classes = useContainersMapStyles();
    const pathBase = "/api/recognition_result/query/?con_number=any_number&final_location=true";
    const [map, setMap] = useState();
    const [marker, setMarker] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const google = window.google;
    const [{ data, isLoading }, setActions] = useFetch(
        `${pathBase}&camera=1&page=1&size=12`
    );
    function handleMarker(event) {
        const caller = event.target;
        const containerName = caller.name;
        if (!caller.checked) {
            const tmarkers = marker.filter((ele) => ele.name === containerName);
            const tmarker = tmarkers[0];
            tmarker.mapPoint.setMap(null);
            setMarker(marker.filter((ele) => ele.name !== containerName));
        } else {
            const attrLoc = caller.value.split(",");
            const position = new google.maps.LatLng(attrLoc[0], attrLoc[1]);
            const tmpMarker = new google.maps.Marker({
                position: position,
                label: containerName,
                map: map,
            });
            const nmarker = {
                name: containerName,
                mapPoint: tmpMarker,
            };
            setMarker(marker.concat(nmarker));
        }
    }
    function handleChangePage(event, newPage) {
        const npath = `${pathBase}&camera=1&page=${parseInt(newPage, 10) + 1}&size=${rowsPerPage}`;
        setPage(newPage);
        setActions[0](npath);
    }
    function handleChangeRowsPerPage(event) {
        const newRowsPerPage = parseInt(event.target.value, 10);
        const npath = `${pathBase}&camera=1&page=1&size=${newRowsPerPage}`;
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        setActions[0](npath);
    }
    useEffect(() => {
        const mapPart = document.getElementById("map");
        const mapOption = {
            zoom: 18,
            center: {
                lat: 45.484751,
                lng: -73.557290326,
            },
            mapTypeId: "satellite",
        };
        let mapObj = new google.maps.Map(mapPart, mapOption);
        mapObj.setTilt(25);
        mapObj.setHeading(270);
        setMap(mapObj);
    }, ['']);
    return (
        <div className={classes.mapContainer}>
        <div id="map" className={classes.map}></div>
        {isLoading ? (
            <CircularProgress />
        ) : (
            <>
            <div id="containersList" className={classes.containerList}>
            <FormControl component="fieldset">
            <FormLabel component="legend">
            Container Number
            </FormLabel>
            <FormGroup>
            <ContainerList
            data={data}
            marker={marker}
            handleMarker={handleMarker}
            />
            </FormGroup>
            </FormControl>
            </div>
            <TablePagination
            component="div"
            rowsPerPageOptions={[12, 24, 36]}
            count={data.page_count}
            page={page}
            rowsPerPage={rowsPerPage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
            />
            </>
        )}
        </div>
    );
};

export default ContainersMap;
