import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import useFetch from '../service/queryData';

export const RcgCardMedia = (props) => {
  const {
    className,
    imgInfo: { bucketName, rpath: imgUrl },
    title,
  } = props;
  //const title = imgUrl.match(/[^/]*.jpg/gi);
  const blank =
    'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';
  const picurl = `/api/api/transform_url/?bucketName=${bucketName}&filePath=${imgUrl}`;
  const [
    {
      state: { data, status },
    },
  ] = useFetch(picurl);
  return status === 'fetched' ? (
    <>
      <Box width="100%">
        <CardMedia
          className={className}
          component="img"
          image={data === 'UNKNOWN' ? blank : data.message.results}
          title={title}
        />
      </Box>
      <CardContent>
        <Typography variant="body2">{title}</Typography>
      </CardContent>
    </>
  ) : (
    <CircularProgress />
  );
};

export default RcgCardMedia;
