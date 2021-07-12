import React, { useState, useEffect } from "react";
import { useMapStyles } from "./styles";
import GoogleMap from "google-map-react";

const markers = [];
let line = null;

function animateCircle(line) {
  let count = 0;
  window.setInterval(() => {
    count = (count + 1) % 200;
    const icons = line.get("icons");
    icons[0].offset = count / 2 + "%";
    line.set("icons", icons);
  }, 20);
}
const handleApiLoaded = (map, maps, places, path) => {
  // Clear all markers and line object
  markers.forEach((marker, index) => {
    marker.setMap(null);
  });
  markers.length = 0;
  line && line.setMap(null);
  line = null;
  markers.length = 0;
  const infowindows = [];
  // Create markers and line object
  places.forEach((place) => {
    const marker = new maps.Marker({
      position: {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lng),
      },
      icon: place.icon,
      animation: maps.Animation.DROP,
      map: map,
    });
    markers.push(marker);
    infowindows.push(
      new maps.InfoWindow({
        content: place.content,
      })
    );
  });

  markers.forEach((marker, i) => {
    marker.addListener("mouseover", () => {
      infowindows[i].open(map, marker);
    });
    marker.addListener("mouseout", () => {
      infowindows[i].close();
    });
  });

  const lineSymbol = {
    path: maps.SymbolPath.FORWARD_CLOSED_ARROW,
    strokeColor: "#393",
  };

  line = new maps.Polyline({
    path: path,
    icons: [
      {
        icon: lineSymbol,
        offset: "100%",
      },
    ],
    map: map,
  });

  animateCircle(line);
};
export default function MapModal(props) {
  const classes = useMapStyles();
  const { showMap, position, switchShowMap, path } = props;
  const [googlemap, setGoogleMap] = useState();
  const [googlemaps, setGoogleMaps] = useState();
  const mapObj = [googlemap, googlemaps];
  const mapConfig = {
    apikey: { key: process.env.REACT_APP_GMap_API_KEY },
    center: position[0],
    zoom: 20,
    options: { mapTypeId: "satellite" },
  };
  useEffect(() => {
    mapObj[0] &&
      position[0] &&
      handleApiLoaded(mapObj[0], mapObj[1], position, path);
  }, [position, path]);
  return (
    <div
      className={`${classes.mapModal} ${
        showMap ? classes.showMap : classes.hidden
      }`}
    >
      <div className={classes.buttonDiv}>
        <button onClick={() => switchShowMap(false)}>Close</button>
      </div>
      <div id="map" className={classes.map}>
        {position[0] && (
          <GoogleMap
            bootstrapURLKeys={mapConfig.apikey}
            center={mapConfig.center}
            zoom={mapConfig.zoom}
            options={mapConfig.options}
            onGoogleApiLoaded={({ map, maps }) => {
              setGoogleMap(map);
              setGoogleMaps(maps);
              handleApiLoaded(map, maps, position, path);
            }}
            yesIWantToUseGoogleMapApiInternals
          ></GoogleMap>
        )}
      </div>
    </div>
  );
}
