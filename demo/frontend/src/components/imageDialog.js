import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DragdropDiv from "./DragDropDiv";

export const ImgDialog = (props) => {
  const { open, data, setOpenDialog } = props;
  const handleClose = () => {
    setOpenDialog(false);
  };
  if (open) {
    const {
      containerCode,
      coordinate: { top, left, width, height },
      imageData: {
        message: { results: img },
      },
    } = data;
    const w = width == null ? "100%" : `${width}px`;
    const h = height == null ? "100%" : `${height}px`;
    const l = left == null ? "0" : `-${left}px`;
    const t = top == null ? "0" : `-${top}px`;
    const styles = makeStyles({
      imgContainer: {
        display: "block",
        width: w,
        height: h,
        overflow: width == null ? "scroll" : "hidden",
      },
      imgSnap: {
        marginLeft: l,
        marginTop: t,
      },
      closeButton: {
        position: "absolute",
        right: "5px",
        top: "5px",
        color: "gray",
      },
    })();
    return (
      <Dialog
        maxWidth="lg"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Container: {containerCode}
          <IconButton
            aria-label="close"
            className={styles.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DragdropDiv>
            <img
              className={styles.imgSnap}
              alt="The part be identified"
              src={img}
            />
          </DragdropDiv>
        </DialogContent>
      </Dialog>
    );
  }
  return null;
};

export default ImgDialog;
