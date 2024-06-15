import {
  Box,
  Button,
  Card,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { initRegisterForm } from "../utils";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import PropTypes from "prop-types";
import axios from "axios";

export default function Register({ setUserData, setIsRegistering }) {
  const [formData, setFormData] = useState(initRegisterForm);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/register",
        formData
      );
      const data = response.data;
      console.log(data);
      setUserData(data);
      setIsRegistering(false);
      toast({
        title: "Account created.",
        description: "Your account has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "An error occurred.",
        description: err.response.data.message || "Username is already taken.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      height={"100%"}
    >
      <Heading mb={"16px"}>Register</Heading>
      <Card minWidth={"2xl"} p="16px">
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              maxLength={100}
              value={formData.name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel mt={"12px"}>Username</FormLabel>
            <Input
              type="text"
              name="username"
              maxLength={20}
              value={formData.username}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel mt={"12px"}>Password</FormLabel>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                name="password"
                maxLength={20}
                value={formData.password}
                onChange={handleChange}
              />
              <InputRightElement>
                <IconButton
                  icon={show ? <IconEye /> : <IconEyeClosed />}
                  onClick={() => setShow(!show)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Flex justifyContent={"center"} mt={"12px"}>
            <Button isLoading={isLoading} type="submit" colorScheme="blue">
              Create
            </Button>
          </Flex>
        </form>
        <Button
          mt={"12px"}
          variant="link"
          onClick={() => setIsRegistering(false)}
        >
          I have an account
        </Button>
      </Card>
    </Box>
  );
}

Register.propTypes = {
  setUserData: PropTypes.func.isRequired,
  setIsRegistering: PropTypes.func.isRequired,
};
