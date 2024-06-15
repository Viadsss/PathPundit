import {
  Button,
  GridItem,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import PathMap from "../map/PathMap";
import MatrixModal from "./MatrixModal";
import { IconGrid4x4, IconTrashX } from "@tabler/icons-react";
import DeleteDialog from "./DeleteDialog";

export default function PathModal({
  isOpen,
  onClose,
  path,
  username,
  index,
  setUserData,
}) {
  const {
    isOpen: isOpenMatrix,
    onOpen: onOpenMatrix,
    onClose: onCloseMatrix,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{path.routeName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"grid"} gridTemplateRows="repeat(12, 1fr)">
            <GridItem rowSpan={10}>
              <PathMap path={path} />
            </GridItem>
            <GridItem rowSpan={3}>
              {path.tspData && (
                <>
                  <p>
                    Final Path:{" "}
                    {path.tspData.finalPath
                      .map((node) => node + 1)
                      .join(" -> ")}
                  </p>
                  <p>
                    Final Cost:{" "}
                    {path.tspData.finalRes > 1000
                      ? `${(path.tspData.finalRes / 1000).toFixed(3)} km`
                      : `${path.tspData.finalRes.toFixed(3)} m`}
                  </p>
                </>
              )}
              <HStack>
                <Button leftIcon={<IconGrid4x4 />} onClick={onOpenMatrix}>
                  Show Distance Matrix
                </Button>
                <Button
                  leftIcon={<IconTrashX />}
                  onClick={onOpenDelete}
                  colorScheme="red"
                >
                  Delete Path
                </Button>
              </HStack>
            </GridItem>
          </ModalBody>
        </ModalContent>
      </Modal>
      <MatrixModal
        isOpen={isOpenMatrix}
        onClose={onCloseMatrix}
        distanceMatrix={path.distanceMatrix}
      />
      <DeleteDialog
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        username={username}
        index={index}
        setUserData={setUserData}
        onClosePath={onClose}
      />
    </>
  );
}

PathModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  path: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  index: PropTypes.number,
  setUserData: PropTypes.func.isRequired,
};
