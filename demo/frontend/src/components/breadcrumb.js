import React from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';
import { useBreadcrumbStyles } from './styles';

const Breadcrumb = (props) => {
  const location = useLocation();
  const { state } = location || undefined;
  const arr = state
    ? Object.values(state)
    : location.pathname.split('/');
  const rst = arr.filter((e) => e !== '' && e !== 'show');
  const classes = useBreadcrumbStyles();
  return (
    <Breadcrumbs className={classes.breadcrumb}>
      <HomeIcon className={classes.icon} />
      <Typography>Home</Typography>
      {rst.map((e, i) => (
        <Typography key={i}>
          {i === rst.length - 1 ? (state ? e : `Loader# ${e}`) : e}
        </Typography>
      ))}
    </Breadcrumbs>
  );
};
export default Breadcrumb;
