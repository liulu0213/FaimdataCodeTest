import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import { useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuIcon from "@material-ui/icons/Menu";
import { useLayoutStyles } from "./styles";
import Lists from "./lists";
import Copyright from "./copyright";
import { logout, getCookie } from "../utils/general";
import Auth from "./auth";

const appName = "Container Monitor-DEMO";
const username = getCookie("username");
const accessToken = getCookie("accessToken");
const idToken = getCookie("idToken");
const loggedIn = Boolean(username && accessToken && idToken);

const Layout = (props) => {
  let history = useHistory();
  const classes = useLayoutStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [defaultUrl, setDefaultUrl] = React.useState("");
  const [loginInfo, setLoginInfo] = React.useState({
    isLogin: loggedIn,
    username: username,
    accessToken: accessToken,
    idToken: idToken,
  });
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    history.push(defaultUrl);
  }, [defaultUrl]);
  return (
    <Auth authInfo={loginInfo} setLogin={setLoginInfo}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap className={classes.title}>
              {appName}
            </Typography>
            <Box className={classes.button}>
              <Button
                variant="outlined"
                size="small"
                color="inherit"
                onClick={() => {
                  logout();
                  history.push("/");
                  setLoginInfo({ isLogin: false });
                }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <Typography className={classes.toolbarTitle}></Typography>
            <IconButton
              onClick={handleDrawerClose}
              style={{ padding: "10px 10px 10px 0" }}
            >
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Lists setDefaultUrl={setDefaultUrl} />
        </Drawer>
        <main className={classes.content}>
          <Box className={classes.mainArea}>{props.children}</Box>
          <Box className={classes.foot}>
            <Copyright />
          </Box>
        </main>
      </div>
    </Auth>
  );
};

export default Layout;
