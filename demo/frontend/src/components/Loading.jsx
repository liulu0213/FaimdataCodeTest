import React from "react";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

const Loading = () => (
  <Grid
    container
    direction="row"
    justify="center"
    alignItems="center"
    style={{ height: "100%", backgroundColor: "#EEE", opacity: 0.5 }}
  >
    <CircularProgress />
  </Grid>
);

export default Loading;
