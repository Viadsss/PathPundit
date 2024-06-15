import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import PropTypes from "prop-types";
import { Box } from "@chakra-ui/react";
import { Marker, Tooltip } from "react-leaflet";
import RouteLine from "./RouteLine";

const ZOOM = 15;

export default function PathMap({ path }) {
  return (
    <Box height={"100%"}>
      <MapContainer
        center={path.markers[0].geoCode}
        zoom={ZOOM}
        doubleClickZoom={false}
        style={{ height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {path.markers.map((marker, index) => (
          <Marker position={marker.geoCode} key={index}>
            <Tooltip permanent>{marker.popUp}</Tooltip>
          </Marker>
        ))}
        {path.filteredRoutesData.map((route, index) => (
          <RouteLine
            route={route}
            markers={path.markers}
            index={index}
            key={index}
          />
        ))}
      </MapContainer>
    </Box>
  );
}

PathMap.propTypes = {
  path: PropTypes.object.isRequired,
};
