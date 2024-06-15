import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import {
  Alert,
  AlertIcon,
  Button,
  Card,
  Grid,
  GridItem,
  useDisclosure,
  useToast,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  IconChevronDown,
  IconCurrentLocation,
  IconDeviceFloppy,
  IconGrid4x4,
  IconLogout2,
  IconProgressDown,
  IconRestore,
  IconRoute,
} from "@tabler/icons-react";
import {
  AddMarker,
  LocationMarker,
  createDistanceMatrix,
  filterRoutesData,
  tsp,
} from "../utils";
import "./mapLayout.css";
import axios from "axios";
import MatrixModal from "../components/MatrixModal";
import RouteLine from "./RouteLine";
import PropTypes from "prop-types";
import SaveModal from "../components/SaveModal";
import PathModal from "../components/PathModal";

const CENTER = [14.5979, 121.0108];
const LIMIT = 10;
const ZOOM = 14;

export default function MapLayout({ userData, setUserData, handleLogOut }) {
  const [markers, setMarkers] = useState([]);
  const [locateClicked, setLocateClicked] = useState(false);
  const [distanceMatrix, setDistanceMatrix] = useState([]);
  const [routesData, setRoutesData] = useState([]);
  const [filteredRoutesData, setFilteredRoutesData] = useState([]);
  const [tspData, setTspData] = useState({});
  const [isProcessed, setIsProcessed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenSave,
    onOpen: onOpenSave,
    onClose: onCloseSave,
  } = useDisclosure();
  const toast = useToast();
  const [currentUserPath, setCurrentUserPath] = useState({});
  const [currentPathIndex, setCurrentPathIndex] = useState(null);
  const {
    isOpen: isOpenPath,
    onOpen: onOpenPath,
    onClose: onClosePath,
  } = useDisclosure();

  const handleUserPath = (data, index) => {
    setCurrentUserPath(data);
    setCurrentPathIndex(index);
    onOpenPath();
  };

  const handleClearMarkers = () => {
    setMarkers([]);
    setDistanceMatrix([]);
    setRoutesData([]);
    setFilteredRoutesData([]);
    setTspData({});
    setIsProcessed(false);
    setLocateClicked(false);
    setErrors([]);
  };

  const handleLocateMe = () => {
    setLocateClicked(true);
  };

  const handleSaveButton = () => {
    onOpenSave();
  };

  const handleProcessMarkers = async (markers) => {
    setIsLoading(true);
    const startTime = performance.now();
    let flat = [];
    let routeDetails = [];

    for (let i = 0; i < markers.length; i++) {
      for (let j = 0; j < markers.length; j++) {
        if (i < j) {
          flat.push({ x: markers[i].geoCode, y: markers[j].geoCode });
          routeDetails.push({ src: i, dest: j });
        }
      }
    }

    const apiCalls = flat.map(async (pair, index) => {
      try {
        const url = "https://graphhopper.com/api/1/route";
        const query = {
          key: import.meta.env.VITE_GRASSHOPPER_API_KEY,
        };

        const payload = {
          points: [
            [pair.x[1], pair.x[0]],
            [pair.y[1], pair.y[0]],
          ],
          snap_preventions: ["motorway", "ferry", "tunnel"],
          details: ["road_class", "surface"],
          profile: "car",
          locale: "en",
          instructions: true,
          calc_points: true,
          points_encoded: false,
        };

        const response = await axios.post(url, payload, {
          headers: { "Content-Type": "application/json" },
          params: query,
        });

        const distance = response.data.paths[0].distance;
        const coordinates = response.data.paths[0].points.coordinates;
        const properCoords = coordinates.map((coord) => [coord[1], coord[0]]);
        const curRoute = routeDetails[index];

        return {
          distance,
          properCoords,
          src: curRoute.src,
          dest: curRoute.dest,
        };
      } catch (error) {
        const errorMsg = `Unable to find a right route between Marker ${
          routeDetails[index].src + 1
        } and ${routeDetails[index].dest + 1}`;
        setErrors((prev) => [...prev, errorMsg]);
      }
    });

    const fetchRouteData = async () => {
      const results = await Promise.all(apiCalls);
      setRoutesData(results);
      const matrix = createDistanceMatrix(results);
      const { finalPath, finalRes } = tsp(matrix);
      const tspRoutes = filterRoutesData(results, finalPath);
      console.log(matrix);
      console.log(finalRes);
      console.log(tspRoutes);
      setDistanceMatrix(matrix);
      setFilteredRoutesData(tspRoutes);
      setTspData({ finalPath, finalRes });

      const endTime = performance.now();
      const duration = endTime - startTime;

      console.log(`Time taken: ${duration}ms`);
      setIsProcessed(true);
    };

    // Wait for all API calls to complete
    try {
      toast.promise(fetchRouteData(), toastDetails);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" height="100%" gap={4}>
        <GridItem colSpan={9}>
          <Card height={"100%"} p="16px">
            <MapContainer
              center={CENTER}
              zoom={ZOOM}
              doubleClickZoom={false}
              style={{ height: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {markers.map((marker, index) => (
                <Marker position={marker.geoCode} key={index}>
                  <Tooltip permanent>{marker.popUp}</Tooltip>
                </Marker>
              ))}

              {filteredRoutesData != 0 &&
                filteredRoutesData.map((route, index) => (
                  <RouteLine
                    route={route}
                    markers={markers}
                    index={index}
                    key={index}
                  />
                ))}

              {/* functions */}
              {locateClicked && (
                <LocationMarker markers={markers} setMarkers={setMarkers} />
              )}

              {!isProcessed && markers.length < LIMIT && (
                <AddMarker markers={markers} setMarkers={setMarkers} />
              )}
            </MapContainer>
          </Card>
        </GridItem>
        <GridItem colSpan={3}>
          <Card
            gap={"10px"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            p="12px"
            mb="32px"
          >
            <Heading align={"center"} size={"xl"}>
              Welcome
              <br />
              {userData.name}!
            </Heading>
            <Button leftIcon={<IconLogout2 />} onClick={handleLogOut}>
              Log out
            </Button>
            <Menu>
              <MenuButton
                colorScheme="blue"
                as={Button}
                rightIcon={<IconChevronDown />}
              >
                Saved Routes
              </MenuButton>
              <MenuList zIndex={9999999}>
                {userData.data &&
                  JSON.parse(userData.data).map((data, index) => (
                    <MenuItem
                      icon={<IconRoute />}
                      onClick={() => handleUserPath(data, index)}
                      key={index}
                    >
                      {data.routeName}
                    </MenuItem>
                  ))}
              </MenuList>
            </Menu>
          </Card>

          <Card
            gap={"10px"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            p="12px"
          >
            <Button onClick={handleClearMarkers} leftIcon={<IconRestore />}>
              Clear
            </Button>
            <Button
              onClick={handleLocateMe}
              isDisabled={markers.length != 0}
              leftIcon={<IconCurrentLocation />}
            >
              Locate Me
            </Button>
            <Button
              isLoading={isLoading}
              onClick={() => handleProcessMarkers(markers)}
              isDisabled={markers.length <= 2 || isProcessed}
              leftIcon={<IconProgressDown />}
              colorScheme="blue"
            >
              Process Markers
            </Button>
            {routesData.length != 0 && (
              <Button
                colorScheme="blue"
                onClick={onOpen}
                leftIcon={<IconGrid4x4 />}
              >
                Show Distance Matrix
              </Button>
            )}
            <Button
              colorScheme="green"
              onClick={handleSaveButton}
              isDisabled={!isProcessed}
              leftIcon={<IconDeviceFloppy />}
            >
              Save Route
            </Button>

            {isProcessed && (
              <>
                <p>
                  Final Path:{" "}
                  {tspData.finalPath.map((node) => node + 1).join(" -> ")}
                </p>
                <p>
                  Final Cost:{" "}
                  {tspData.finalRes > 1000
                    ? `${(tspData.finalRes / 1000).toFixed(3)} km`
                    : `${tspData.finalRes.toFixed(3)} m`}
                </p>
              </>
            )}
            {errors.map((error, index) => (
              <Alert status="error" key={index}>
                <AlertIcon />
                {error}
              </Alert>
            ))}
          </Card>
        </GridItem>
      </Grid>
      <MatrixModal
        isOpen={isOpen}
        onClose={onClose}
        distanceMatrix={distanceMatrix}
      />
      <SaveModal
        isOpen={isOpenSave}
        onClose={onCloseSave}
        username={userData.username}
        markers={markers}
        distanceMatrix={distanceMatrix}
        filteredRoutesData={filteredRoutesData}
        tspData={tspData}
        setUserData={setUserData}
        handleClearMarkers={handleClearMarkers}
      />
      <PathModal
        isOpen={isOpenPath}
        onClose={onClosePath}
        path={currentUserPath}
        username={userData.username}
        index={currentPathIndex}
        setUserData={setUserData}
      />
    </>
  );
}

const toastDetails = {
  success: {
    title: "Route Processed",
    description: "Route processing completed successfully.",
  },
  error: {
    title: "Route Processing Failed",
    description: "An error occurred while processing the routes.",
  },
  loading: {
    title: "Processing Routes",
    description: "Please wait while the routes are being processed.",
  },
};

MapLayout.propTypes = {
  userData: PropTypes.object.isRequired,
  setUserData: PropTypes.func.isRequired,
  handleLogOut: PropTypes.func.isRequired,
};
