import {
  Box,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

export default function Header() {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(<IconMoonStars />, <IconSun />);

  return (
    <Box as="header" height="60px" display={"flex"} justifyContent={"flex-end"}>
      <IconButton onClick={toggleColorMode} icon={icon} />
    </Box>
  );
}
