import React from "react";
import Button from "@material-ui/core/Button";
import RoomOutlineIcon from "@material-ui/icons/RoomOutlined";
import { fmtDate } from "../utils/general";

/** Pop-up Google Map */
export const PopupMap = (props) => {
  const { containerName, upAt, downAt, pos, movePath } = props;
  const pathPoints = !movePath || movePath === "" ? [] : JSON.parse(movePath);
  //const pathPoints = movePath || [];
  pathPoints.unshift({
    lat: parseFloat(pos.uPos.lat),
    lng: parseFloat(pos.uPos.lon),
  });
  pathPoints.push({
    lat: parseFloat(pos.dPos.lat),
    lng: parseFloat(pos.dPos.lon),
  });
  const pointInfo = {
    container_code:
      containerName +
      " lock at " +
      fmtDate(upAt) +
      ", unlock at " +
      fmtDate(downAt),
    position: [
      {
        label: "A",
        content: "Lock",
        lat: parseFloat(pos.uPos.lat),
        lng: parseFloat(pos.uPos.lon),
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
      },
      {
        label: "B",
        content: "Unlock",
        lat: parseFloat(pos.dPos.lat),
        lng: parseFloat(pos.dPos.lon),
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      },
    ],
    path: pathPoints,
  };
  return (
    <Button
      size="small"
      startIcon={<RoomOutlineIcon />}
      onClick={() => {
        props.setPoint(pointInfo);
        props.switchShowMap(true);
      }}
      disabled={parseInt(pos.uPos.lat) === 0}
    >
      Pop-up
    </Button>
  );
};

export default PopupMap;
