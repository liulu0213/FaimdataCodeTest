import React from 'react';
import {useParams} from 'react-router-dom';
import './App.css';

const App = props => {
  console.log(props);
  let {param}=useParams();
  return(
    <div style={{marginLeft:300}}>
      <button onClick={()=>props.history.goBack()}>Back</button>
        <p>Params is <u>&nbsp;{ param }&nbsp;</u></p>
    </div>
  )
}

export default App;
