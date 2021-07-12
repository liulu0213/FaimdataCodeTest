import { createStyles, makeStyles, lighten } from "@material-ui/core/styles";

export const useSignStyles = makeStyles((theme) => ({
  root: {
    height: "96vh",
  },
  leftItem: {
    flex: "2",
    background: `no-repeat center/700px url('/background.jpg')`,
    height: "520px",
  },
  rightItem: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
  },
  topItem: {
    flex: "1 0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  footItem: {
    flex: "0 0 60px",
  },
  avatarIcon: {
    margin: theme.spacing(1),
    "&:first-child": {
      color: theme.palette.grey[100],
      backgroundColor: theme.palette.primary.light,
    },
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const drawerWidth = 260;
const backgroundPos = 1179 * Math.random().toString().slice(0, 4);

export const useLayoutStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flex: "auto",
    minHeight: "100vh",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  title: {
    flex: 4,
  },
  button: {
    flex: 1,
    textAlign: "center",
    background: "url('/favicon.png') 30px/30px no-repeat",
    backgroundPosition: "right top",
  },
  menuButton: {
    marginRight: "36",
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    background: `url('/background.jpg') -${backgroundPos}px/102em no-repeat fixed!important`,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: "rgb(255,255,255,0.5)",
    backdropFilter: "blur(8px)",
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
    background: "rgb(255,255,255,0.5)",
    backdropFilter: "blur(8px)",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  toolbarTitle: {
    fontSize: "2.8em",
    fontWeight: "800",
    color: "#5c6bc0",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flex: "1 0 auto",
  },
  breadcrumb: {
    flex: "0",
    padding: "80px 10px 0",
  },
  mainArea: {
    display: "flex",
    flexDirection: "column",
    flex: "1 0 auto",
    padding: "10px",
  },
  foot: {
    flex: "0 0 60px",
  },
  nested: {
    paddingLeft: theme.spacing(2),
  },
  activeNav: {
    background: "rgb(255,255,255,0.3)",
  },
}));

export const useContainerStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    margin: "3px",
    padding: "10px",
  },
  leftItem: {
    flex: "0 0 220px",
    display: "flex",
    justifyContent: "center",
  },
  rightItem: {
    flex: "1 0 auto",
    display: "flex",
    padding: "0 20px",
  },
  image: {
    border: "1px solid #e8e8e9",
    padding: "2px",
    display: "block",
    width: "225px",
    height: "150px",
    overflow: "hidden",
  },
  img: {
    maxWidth: "220px",
    maxHeight: "145px",
  },
}));

export const useRecognitionStyles = makeStyles({
  appBar: {
    position: "sticky",
  },
  toolbar: {
    display: "flex",
    flexFlow: "row nowrap",
  },
  dialogTitle: {
    flex: "1 1 auto!important",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    overflow: "visible!important",
  },
  card: {
    flex: "0 0 auto",
    margin: "15px auto",
    width: "95%",
    display: "flex",
    flexDirection: "column",
  },
  media: {
    height: "auto",
    width: "100vw",
    overflow: "hidden",
  },
  infoContainer: {
    display: "flex",
    flexFlow: "row wrap",
    "& *": {
      borderBottom: "1px solid gray",
    },
    "& :nth-child(2n+1)": {
      flex: "1 0 20%",
    },
    "& :nth-child(2n)": {
      flex: "1 1 30%",
    },
  },
});

export const useBreadcrumbStyles = makeStyles((theme) => ({
  breadcrumb: {
    display: "flex",
    margin: theme.spacing(10, 1, 1, 3),
  },
  link: {
    display: "flex",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));

export const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    "&$dense": {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  hightlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: lighten(theme.palette.secondary.dark),
        },
}));

export const useMapStyles = makeStyles((theme) => ({
  mapModal: {
    backgroundColor: "rgba(0,0,0,0.5)",
    height: "100%",
    width: "100%",
    position: "fixed",
    top: "0",
    right: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    paddingLeft: "220px",
    zIndex: "1209",
  },
  buttonDiv: {
    width: "800px",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: "100",
    margin: "0 20px -90px 0",
    "& button": {
      border: "1px solid black",
    },
  },
  map: {
    width: "800px",
    height: "600px",
    backgroundColor: "wheat",
    border: "2px solid black",
  },
  hidden: {
    display: "none",
  },
  show: {
    display: "",
  },
}));
export const useContainersMapStyles = makeStyles((theme) => ({
  mapContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    flexFlow: "row wrap",
  },
  containerList: {
    paddingLeft: "10px",
    border: "2px solid #000",
    borderRightWidth: "1px",
    width: "15%",
    height: "550px",
    overflowY: "scroll",
    backgroundColor: "#EEE",
  },
  map: {
    width: "85%",
    height: "550px",
    backgroundColor: "wheat",
    border: "2px solid black",
    borderLeftWidth: "0",
  },
}));
export const useSettingStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
    },
    container: {
      display: "flex",
      width: 560,
      flexFlow: "column wrap",
      justifyContent: "space-between",
      alignItems: "center",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 320,
    },
    rangeRoot: {
      width: 520,
    },
    datePicker: {
      margin: theme.spacing(2),
    },
    action: {
      marginTop: theme.spacing(3),
    },
  })
);

export const useContentTabStyles = makeStyles(() =>
  createStyles({
    flexContainer: {
      flex: "1 0 auto",
    },
  })
);
