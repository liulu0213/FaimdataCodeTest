import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import ContentTabs from "./contentTabs";
import MapModal from "./mapModal";
import ImgDialog from "./imageDialog";
import Recognitions from "./recognitions";
import Breadcrumb from "./breadcrumb";
import useFetch from "../service/queryData";

/** Moving Line Container */
export const MovingLine = (props) => {
  const craneId = props.match.params.crane_id;
  const [prevCraneId, setPrevCraneID] = useState("");
  const [showMap, switchShowMap] = useState(false);
  const [point, setPoint] = useState({
    container_code: "Faimdata.com",
    position: {
      lat: "45.49769527",
      lng: "-73.58026815",
    },
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [coordinate, setCoordinate] = useState();
  const [item, setItem] = useState();
  const apiPath = `/api/api/result/?crane_id=${craneId}`;
  const [param, setParam] = useState("");

  const [{ state }, setActions] = useFetch(`${apiPath}${param}`);
  if (craneId !== prevCraneId) {
    setPrevCraneID(craneId);
    setParam("");
    // setSwitchCrane to true mean refresh whole table component
    setActions[2](true);
  }
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setActions[0](`${apiPath}${param}`);
    }
    return () => {
      mounted = false;
    };
  }, [setActions]);

  return (
    <>
      <Breadcrumb />
      {state.status === "fetched" ? (
        <ContentTabs
          apiPath={apiPath}
          param={param}
          switchShowMap={switchShowMap}
          setPoint={setPoint}
          setOpenDialog={setOpenDialog}
          setCoordinate={setCoordinate}
          setParam={setParam}
          setItem={setItem}
          data={state.data}
        />
      ) : (
        <Loading />
      )}
      <MapModal showMap={showMap} switchShowMap={switchShowMap} {...point} />
      <ImgDialog
        open={openDialog}
        data={coordinate}
        setOpenDialog={setOpenDialog}
      />
      <Recognitions item={item} setItem={setItem} />
    </>
  );
};

export default MovingLine;
