import PropTypes from "prop-types";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export default function SaveModal({
  isOpen,
  onClose,
  username,
  markers,
  distanceMatrix,
  filteredRoutesData,
  tspData,
  setUserData,
  handleClearMarkers,
}) {
  const [routeName, setRouteName] = useState("");

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const routeData = {
      routeName,
      markers,
      distanceMatrix,
      filteredRoutesData,
      tspData,
    };

    try {
      const response = await axios.put(
        `http://localhost:8080/routes/${username}`,
        routeData
      );
      const newData = response.data;
      console.log(newData);
      setUserData(newData);
      toast({
        title: "Route Saved",
        description: "Your route has been saved successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setRouteName("");
      handleClearMarkers();
      onClose();
    } catch (err) {
      console.error("Failed to save route", err);
      toast({
        title: "Error",
        description: "Failed to save route.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>Save Route</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Route Name</FormLabel>
            <Input
              type="text"
              name="routeName"
              maxLength={30}
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <HStack>
            <Button onClick={onClose}>Close</Button>
            <Button colorScheme="blue" type="submit">
              Save
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

SaveModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  markers: PropTypes.array.isRequired,
  distanceMatrix: PropTypes.array,
  filteredRoutesData: PropTypes.array.isRequired,
  tspData: PropTypes.object.isRequired,
  setUserData: PropTypes.func.isRequired,
  handleClearMarkers: PropTypes.func.isRequired,
};
