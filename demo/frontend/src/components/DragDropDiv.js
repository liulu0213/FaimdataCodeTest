import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles({
  container: {
    display: 'block',
    width: '100%',
    height: '100%',
    overflow: 'scroll',
  },
});

export const DragdropDiv = (props) => {
  const classes = styles();
  const [active, setActive] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const handleMousedown = (e) => {
    const t = e.currentTarget;
    setActive(true);
    setStartX(e.pageX - t.offsetLeft);
    setStartY(e.pageY - t.offsetTop);
    setScrollX(t.scrollLeft);
    setScrollY(t.scrollTop);
    e.preventDefault();
  };
  const handleMouseup = (e) => {
    setActive(false);
    e.preventDefault();
  };
  const handleMousemove = (e) => {
    if (active) {
      const t = e.currentTarget;
      const x = e.pageX - t.offsetLeft;
      const y = e.pageY - t.offsetTop;
      const walkX = x - startX;
      const walkY = y - startY;
      t.scrollLeft = scrollX - walkX;
      t.scrollTop = scrollY - walkY;
    }
    e.preventDefault();
  };
  const handleMouseleave = (e) => {
    e.preventDefault();
  };
  return (
    <div
      className={classes.container}
      onMouseUp={handleMouseup}
      onMouseDown={handleMousedown}
      onMouseMove={handleMousemove}
      onMouseLeave={handleMouseleave}
    >
      {props.children}
    </div>
  );
};
export default DragdropDiv;
