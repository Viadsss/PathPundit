import {
  Table,
  TableContainer,
  Tbody,
  Tr,
  Td,
  Th,
  Thead,
  TableCaption,
} from "@chakra-ui/react";
import { IconInfinity } from "@tabler/icons-react";
import PropTypes from "prop-types";

export default function DistanceMatrixTable({ distanceMatrix }) {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th></Th>
            {distanceMatrix.map((row, index) => (
              <Th key={index}>{`Marker ${index + 1}`}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {distanceMatrix.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              <Th>{`Marker ${rowIndex + 1}`}</Th>
              {row.map((value, colIndex) => (
                <Td key={colIndex}>
                  {value != null && value !== Infinity ? (
                    `${value}m`
                  ) : (
                    <IconInfinity />
                  )}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
        <TableCaption>Distance Matrix of all Markers</TableCaption>
      </Table>
    </TableContainer>
  );
}

DistanceMatrixTable.propTypes = {
  distanceMatrix: PropTypes.array,
};
