import {
  Box,
  IconButton,
  Image,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

export default function Header() {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(<IconMoonStars />, <IconSun />);
  const logoSrc = useColorModeValue(
    "/iconlogo_light.png",
    "/iconlogo_dark.png"
  );

  return (
    <Box
      as="header"
      height="60px"
      display={"flex"}
      justifyContent="space-between"
    >
      <Image src={logoSrc} h="32px" />
      <IconButton onClick={toggleColorMode} icon={icon} />
    </Box>
  );
}
