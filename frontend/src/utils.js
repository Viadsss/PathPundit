import { useMapEvents } from "react-leaflet";
import PropTypes from "prop-types";

const initLoginForm = {
  username: "",
  password: "",
};

const initRegisterForm = {
  name: "",
  username: "",
  password: "",
};

function AddMarker({ markers, setMarkers }) {
  useMapEvents({
    click: (e) => {
      const newMarker = {
        geoCode: [e.latlng.lat, e.latlng.lng],
        popUp: `Marker ${markers.length + 1}`,
      };
      console.log(e.latlng.lat, e.latlng.lng);
      console.log(markers);
      setMarkers([...markers, newMarker]);
    },
  });

  return null;
}

function LocationMarker({ markers, setMarkers }) {
  const map = useMapEvents({
    locationfound(e) {
      if (markers.length === 0) {
        const newMarker = {
          geoCode: [e.latlng.lat, e.latlng.lng],
          popUp: `Marker ${markers.length + 1}`,
        };
        setMarkers([newMarker]);
        console.log(e.latlng.lat, e.latlng.lng);

        map.flyTo(e.latlng, map.getZoom());
      }
    },
  });

  map.locate();

  return null;
}

function createDistanceMatrix(routes) {
  const lastRoute = routes.length - 1;
  const lastRouteDest = routes[lastRoute].dest;
  const matrixSize = lastRouteDest + 1;

  // Initialize a matrix with zeros
  const matrix = Array.from(Array(matrixSize), () =>
    Array(matrixSize).fill(Infinity)
  );

  routes.forEach((route) => {
    const { src, dest, distance } = route;
    matrix[src][dest] = distance;
    matrix[dest][src] = distance;
  });

  return matrix;
}

function tsp(adjacencyMatrix) {
  const N = adjacencyMatrix.length;
  const finalPath = new Array(N + 1);
  const visited = new Array(N).fill(false);
  let finalRes = Infinity;

  function copyToFinal(currPath) {
    for (let i = 0; i < N; i++) finalPath[i] = currPath[i];
    finalPath[N] = currPath[0];
  }

  function firstMin(adj, i) {
    let min = Infinity;
    for (let k = 0; k < N; k++) if (adj[i][k] < min && i !== k) min = adj[i][k];
    return min;
  }

  function secondMin(adj, i) {
    let first = Infinity,
      second = Infinity;
    for (let j = 0; j < N; j++) {
      if (i === j) continue;
      if (adj[i][j] <= first) {
        second = first;
        first = adj[i][j];
      } else if (adj[i][j] <= second && adj[i][j] !== first) {
        second = adj[i][j];
      }
    }
    return second;
  }

  function tspRec(adj, currBound, currWeight, level, currPath) {
    if (level === N) {
      if (adj[currPath[level - 1]][currPath[0]] !== 0) {
        const currRes = currWeight + adj[currPath[level - 1]][currPath[0]];
        if (currRes < finalRes) {
          copyToFinal(currPath);
          finalRes = currRes;
        }
      }
      return;
    }

    for (let i = 0; i < N; i++) {
      if (adj[currPath[level - 1]][i] !== 0 && !visited[i]) {
        const temp = currBound;
        currWeight += adj[currPath[level - 1]][i];
        if (level === 1)
          currBound -=
            (firstMin(adj, currPath[level - 1]) + firstMin(adj, i)) / 2;
        else
          currBound -=
            (secondMin(adj, currPath[level - 1]) + firstMin(adj, i)) / 2;

        if (currBound + currWeight < finalRes) {
          currPath[level] = i;
          visited[i] = true;
          tspRec(adj, currBound, currWeight, level + 1, currPath);
        }

        currWeight -= adj[currPath[level - 1]][i];
        currBound = temp;
        visited.fill(false);
        for (let j = 0; j <= level - 1; j++) visited[currPath[j]] = true;
      }
    }
  }

  const currPath = new Array(N + 1);
  let currBound = 0;
  currPath.fill(-1);
  visited[0] = true;
  currPath[0] = 0;

  for (let i = 0; i < N; i++)
    currBound += firstMin(adjacencyMatrix, i) + secondMin(adjacencyMatrix, i);
  currBound =
    currBound & 1 ? Math.floor(currBound / 2) + 1 : Math.floor(currBound / 2);

  tspRec(adjacencyMatrix, currBound, 0, 1, currPath);

  return { finalPath, finalRes };
}

function filterRoutesData(routesData, finalPath) {
  return routesData.filter((route) => {
    for (let i = 0; i < finalPath.length - 1; i++) {
      if (
        (route.src === finalPath[i] && route.dest === finalPath[i + 1]) ||
        (route.src === finalPath[i + 1] && route.dest === finalPath[i])
      ) {
        return true;
      }
    }
    return false;
  });
}

AddMarker.propTypes = {
  markers: PropTypes.array.isRequired,
  setMarkers: PropTypes.func.isRequired,
};

LocationMarker.propTypes = {
  markers: PropTypes.array.isRequired,
  setMarkers: PropTypes.func.isRequired,
};

export {
  initLoginForm,
  initRegisterForm,
  AddMarker,
  LocationMarker,
  createDistanceMatrix,
  tsp,
  filterRoutesData,
};
