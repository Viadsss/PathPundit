import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export default function DeleteDialog({
  isOpen,
  onClose,
  username,
  index,
  setUserData,
  onClosePath,
}) {
  const cancelRef = useRef();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/routes/${username}/${index}`
      );
      const newData = response.data;
      setUserData(newData);
      toast({
        title: "Route Deleted",
        description: "The route has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      onClosePath();
    } catch (err) {
      console.error("Failed to delete route", err.response.data);
      toast({
        title: "Error",
        description: "Failed to delete route.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Delete Route?</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Are you sure you want to delete this route? You can&apos;t undo this
          action afterwards.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            No
          </Button>
          <Button onClick={handleDelete} colorScheme="red" ml={3}>
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

DeleteDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  index: PropTypes.number,
  setUserData: PropTypes.func.isRequired,
  onClosePath: PropTypes.func.isRequired,
};
