import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import DistanceMatrixTable from "./DistanceMatrixTable";
import PropTypes from "prop-types";

export default function MatrixModal({ isOpen, onClose, distanceMatrix }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Distance Matrix</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <DistanceMatrixTable distanceMatrix={distanceMatrix} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

MatrixModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  distanceMatrix: PropTypes.array,
};
