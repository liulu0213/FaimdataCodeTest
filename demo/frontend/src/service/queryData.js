import {
  useState,
  useEffect,
  useContext,
  useRef,
  useReducer,
} from 'react';
import { getCookie } from '../utils/general';
import { AuthContext } from '../components/auth';

let accessToken = getCookie('accessToken');
let idToken = getCookie('idToken');
const initialState = {
  status: 'idle',
  error: null,
  data: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCHING':
      return { ...initialState, status: 'fetching' };
    case 'FETCHED':
      return {
        ...initialState,
        status: 'fetched',
        data: action.payload,
      };
    case 'FETCH_ERROR':
      return {
        ...initialState,
        status: 'error',
        error: action.payload,
      };
    default:
      return state;
  }
}
function DefaultRqrHeader() {
  const authInfo = useContext(AuthContext);
  if (accessToken === '') {
    accessToken = authInfo.accessToken;
    idToken = authInfo.idToken;
  }
  return {
    headers: {
      'Content-Type': 'text/plain',
      authority: `bearer ${accessToken}`,
      token: `${idToken}`,
    },
    method: 'GET',
  };
}
export default function useFetch(initialUrl, initialOptions = {}) {
  const DEFAULT_OPTIONS = DefaultRqrHeader();
  const [url, setUrl] = useState(initialUrl);
  const [options, setOptions] = useState({
    ...DEFAULT_OPTIONS,
    ...initialOptions,
  });
  const absoluteUrl =
    url &&
    url.replace(
      /^(\/)?api(\/#)?/i,
      process.env.REACT_APP_API_DATASOURCE_URL,
    );
  const cache = useRef({});
  const [state, dispatch] = useReducer(reducer, initialState);
  const [switchCrane, setSwitchCrane] = useState(true);
  // console.log("useFetch Hook " + absoluteUrl + "|" + JSON.stringify(options));
  useEffect(() => {
    let mounted = false;
    const fetchData = async () => {
      if (switchCrane) {
        dispatch({ type: 'FETCHING' });
      }
      if (cache.current[absoluteUrl]) {
        const data = cache.current[absoluteUrl];
        dispatch({ type: 'FETCHED', payload: data });
        setSwitchCrane(false);
      } else {
        try {
          const response = await fetch(absoluteUrl, options);
          const data = await response.json();
          cache.current[absoluteUrl] = data;
          if (mounted) return;
          dispatch({ type: 'FETCHED', payload: data });
          setSwitchCrane(false);
        } catch (error) {
          if (mounted) return;
          dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
      }
    };
    fetchData();
    return function cleanup() {
      mounted = true;
    };
  }, [absoluteUrl, options]);
  /*
  useEffect(() => {
    console.log(state);
  }, [state]);
  */
  const setActions = [setUrl, setOptions, setSwitchCrane];
  return [{ state, switchCrane }, setActions];
}
