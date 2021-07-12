import React, { useState, useEffect } from 'react';
import NavLink from 'react-router-dom/NavLink';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CameraIcon from '@material-ui/icons/CameraAlt';
import { useLayoutStyles } from './styles';
import Loading from './Loading';
import useFetch from '../service/queryData';

const Menu = (props) => {
  const { links, menuSelected, setMenuSelected } = props;
  const classes = useLayoutStyles();
  const [collaspe, setCollaspe] = useState([]);
  const dataSource = Object.values(props.data);
  const items = dataSource.map((item, index) => {
    const hasItem = Boolean(item.data);
    const linkUrl = !hasItem ? `/${item.code}/${item.crane_id}/` : '';
    if (!hasItem) {
      links.add(`${linkUrl}:${item.code}:${item.displayName}`);
    }
    return hasItem ? (
      <React.Fragment key={index}>
        <ListItem
          button
          onClick={() => {
            const tmp = new Set(collaspe);
            collaspe.includes(index)
              ? tmp.delete(index)
              : tmp.add(index);
            setCollaspe([...tmp]);
          }}
        >
          <ListItemText
            className={classes.nested}
            primary={item.displayName}
          />
          {collaspe.includes(index) ? <ExpandMore /> : <ExpandLess />}
        </ListItem>
        <Collapse
          className={classes.nested}
          in={!collaspe.includes(index)}
        >
          <Menu {...props} data={item.data} />
        </Collapse>
      </React.Fragment>
    ) : (
      <ListItem
        key={index}
        button
        selected={menuSelected === item.displayName ? true : false}
        component={NavLink}
        className={classes.nested}
        to={{
          pathname: linkUrl,
          state: {
            project: `${item.code}`,
            dsp_name: `${item.displayName}`,
          },
        }}
        onClick={() => {
          setMenuSelected(item.displayName);
        }}
      >
        <ListItemIcon className={classes.nested}>
          <CameraIcon />{' '}
        </ListItemIcon>
        <ListItemText>{item.displayName}</ListItemText>
      </ListItem>
    );
  });
  return items;
};

/*
 *  Lists is the component that building menu and jump to first link automaticly
 * */

export default function Lists(props) {
  const [menuSelected, setMenuSelected] = useState('');
  const [{ state }] = useFetch('/api/api/loaders/');
  const links = new Set();
  useEffect(() => {
    let firstLinkObj = [...links][0];
    if (firstLinkObj) {
      firstLinkObj = firstLinkObj.split(':');
      setMenuSelected(firstLinkObj[2]);

      const t = JSON.parse(
        `{"pathname":"${firstLinkObj[0]}","state":{"project":"${firstLinkObj[1]}","dsp_name":"${firstLinkObj[2]}"}}`,
      );
      props.setDefaultUrl(t);
    }
  }, [state]);
  return state.status === 'fetched' ? (
    <>
      <Divider />
      <Menu
        data={state.data.message}
        menuSelected={menuSelected}
        setMenuSelected={setMenuSelected}
        links={links}
        {...props}
      />
    </>
  ) : (
    <Loading />
  );
}
