import { useState } from "react";
import Header from "./pages/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Box, useColorModeValue } from "@chakra-ui/react";
import MapLayout from "./map/MapLayout";

function App() {
  const [userData, setUserData] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const bg = useColorModeValue("gray.50", "gray.800");

  const handleLogOut = () => {
    console.log(userData);
    setUserData(null);
  };

  return (
    <>
      <Box p={"16px"} bgColor={bg}>
        <Header />
        <Box height="calc(100vh - 60px)" as="main" pb="32px">
          {userData ? (
            <MapLayout
              userData={userData}
              setUserData={setUserData}
              handleLogOut={handleLogOut}
            />
          ) : isRegistering ? (
            <Register
              setUserData={setUserData}
              setIsRegistering={setIsRegistering}
            />
          ) : (
            <Login
              setUserData={setUserData}
              setIsRegistering={setIsRegistering}
            />
          )}
        </Box>
      </Box>
    </>
  );
}

export default App;
