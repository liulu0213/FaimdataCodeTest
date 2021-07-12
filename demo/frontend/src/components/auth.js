import React from 'react';
import SignIn from './signin';

export const AuthContext = React.createContext();
const Auth = (props) => {
  const {
    authInfo: { isLogin },
  } = props;
  return isLogin ? (
    <AuthContext.Provider value={props.authInfo}>
      {props.children}
    </AuthContext.Provider>
  ) : (
    <SignIn setLogin={props.setLogin} />
  );
  return isLogin ? (
    props.children
  ) : (
    <SignIn setLogin={props.setLogin} />
  );
};
export default Auth;
