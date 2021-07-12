import React, { useEffect } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import Loading from "./Loading";
import { useContainerStyles } from "./styles";
import useFetch from "../service/queryData";

export const ContainerPhoto = (props) => {
  const {
    uuid,
    containerCode,
    bucketName,
    src,
    coordinate,
    setOpenDialog,
    setCoordinate,
  } = props;
  const classes = useContainerStyles();
  const picurl = `/api/api/transform_url/?bucketName=${bucketName}&filePath=${src}`;
  const [
    {
      state: { data, status },
    },
    setActions,
  ] = useFetch(picurl);
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setActions[0](picurl);
    }
    return () => {
      mounted = false;
    };
  }, [setActions]);
  return status === "fetched" ? (
    <ButtonBase
      className={classes.image}
      onClick={() => {
        setCoordinate({
          containerCodex: `${uuid} ${containerCode}`,
          containerCode,
          coordinate: coordinate,
          imageData: data,
        });
        setOpenDialog(true);
      }}
    >
      <img
        className={classes.img}
        alt={containerCode}
        src={data.message.results}
      />
    </ButtonBase>
  ) : (
    <Loading />
  );
};

export default ContainerPhoto;
