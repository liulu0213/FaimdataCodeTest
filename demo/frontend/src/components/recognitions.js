import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import RcgCardMedia from './recognitionCardMedia';
import { useRecognitionStyles } from './styles';
import { fmtDate } from '../utils/general';

export const Recognition = (props) => {
  const { item, setItem } = props;
  const classes = useRecognitionStyles();
  let rst = [];
  if (item && item.recognitions.positive) {
    rst = rst.concat(item.recognitions.positive.data);
  } else if (item && item.recognitions.negative) {
    item.recognitions.negative.map((ele) => {
      const negativeDatas = ele.data.map((item) => ({
        ...item,
        location: { lat: 0, lon: 0, alt: 0 },
      }));
      rst = rst.concat(negativeDatas);
    });
  }
  const continueFlag = Boolean(rst.length);

  if (!continueFlag) return <></>;

  const lockGMTTime = fmtDate(item.lockAt);
  const unlockGMTTime = fmtDate(item.unlockAt);

  const handleClose = () => {
    setItem(undefined);
  };
  return (
    <Dialog
      fullScreen
      open={item !== undefined}
      onClose={handleClose}
      aria-labelledby="dialog-recognitions"
      aria-describedby="photos-recognized"
    >
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <DialogTitle
            id="recognitions-title"
            className={classes.dialogTitle}
          >
            Container:<u> {item.containerName || ''} </u>
            <Typography variant="body2">
              Be recognized{' '}
              <u>
                {item.recognizedCount > 0
                  ? item.recognizedCount
                  : '0'}
              </u>{' '}
              times, selected <u>{rst.length}</u> photos here
            </Typography>
          </DialogTitle>
          <Button autoFocus color="inherit" onClick={handleClose}>
            Close
          </Button>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent dividers className={classes.content}>
        {rst.map((list, index) => {
          return (
            <Card key={index} className={classes.card}>
              <RcgCardMedia
                className={classes.media}
                imgInfo={list}
                title={`Lock At: ${lockGMTTime} Unlock At: ${unlockGMTTime}`}
              />
              <CardContent className={classes.infoContainer}>
                <Typography variant="subtitle2">Alt</Typography>
                <Typography variant="body2">
                  {list.location.alt}
                </Typography>
                <Typography variant="subtitle2">Lat</Typography>
                <Typography variant="body2">
                  {list.location.lat}
                </Typography>
                <Typography variant="subtitle2">Lon</Typography>
                <Typography variant="body2">
                  {list.location.lon}
                </Typography>
                <Typography variant="subtitle2"></Typography>
                <Typography variant="body2"> </Typography>
              </CardContent>
            </Card>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default Recognition;
