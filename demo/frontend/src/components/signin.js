import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Copyright from './copyright';
import { useSignStyles } from './styles';
import { setCookie } from '../utils/general';
import auth0 from 'auth0-js';

const CLIENT_ID = 'ucCBuqY67DCcKwfwM13ECudo28LFbHDJ';
const CLIENT_DOMAIN = 'faimdata.auth0.com';

const authObj = new auth0.Authentication({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN,
});

const REALM = 'Admin-User-DB';

const Hint = (props) => {
  const { state, message } = props;
  return state === 1 ? (
    <></>
  ) : (
    <Typography variant="body2" color="error">
      {message}
    </Typography>
  );
};

export default function SignIn(props) {
  const classes = useSignStyles();
  // username , password is api name, can not be change
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const loginCallback = (err, result) => {
    if (err) {
      console.log(err);
      setErrMsg({ state: 0, message: err.description });
      return false;
    }
    setErrMsg({ state: 1, message: '' });
    const expHours = remember ? 4392 : undefined;
    const { accessToken, idToken } = result;
    const loginInfo = {
      isLogin: true,
      username: `${username}`,
      accessToken: accessToken,
      idToken: idToken,
    };
    setCookie({ username, accessToken, idToken }, expHours);
    props.setLogin(loginInfo);
    return loginInfo;
  };
  const accountLogin = (u, p, cb) => {
    authObj.login({ username: u, password: p, realm: REALM }, cb);
  };
  return (
    <Grid
      className={classes.root}
      container
      direction="row"
      justify="center"
      alignItems="center"
      spacing={4}
    >
      <Grid item xs={7}>
        <Box className={classes.leftItem} boxShadow={3} />
      </Grid>
      <Grid item xs={3} className={classes.rightItem}>
        <Box className={classes.topItem}>
          <Avatar className={classes.avatarIcon}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={(e) => {
              accountLogin(username, password, loginCallback);
              e.preventDefault();
            }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="User Name"
              name="username"
              autoComplete="username"
              autoFocus
              onInput={(e) => setUserName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onInput={(e) => setPassword(e.target.value)}
            />
            {<Hint {...errMsg} />}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              onClick={(e) =>
                e.target.checked
                  ? setRemember(e.target.value)
                  : setRemember('')
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
          </form>
        </Box>
        <Box className={classes.footItem}>
          <Copyright />
        </Box>
      </Grid>
    </Grid>
  );
}
