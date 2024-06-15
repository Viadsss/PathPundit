import {
  Box,
  Button,
  Card,
  Flex,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { initLoginForm } from "../utils";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import PropTypes from "prop-types";
import axios from "axios";

export default function Login({ setUserData, setIsRegistering }) {
  const [formData, setFormData] = useState(initLoginForm);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        formData
      );
      const data = response.data;
      setUserData(data);
      setFormData(initLoginForm);
    } catch (err) {
      const message = err.response.data;
      setError(message);
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
      <Heading mb={"16px"}>Login</Heading>
      <Card minWidth={"2xl"} p="16px">
        <form onSubmit={handleSubmit}>
          <FormControl isRequired isInvalid={error}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              maxLength={20}
              value={formData.username}
              onChange={handleChange}
            />
            <FormLabel mt="12px">Password</FormLabel>
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
            <FormErrorMessage>
              <FormErrorIcon />
              {error}
            </FormErrorMessage>
          </FormControl>

          <Flex justifyContent={"center"} mt={"12px"}>
            <Button isLoading={isLoading} type="submit" colorScheme="blue">
              Log in
            </Button>
          </Flex>
        </form>

        <Button variant="link" onClick={() => setIsRegistering(true)} mt="12px">
          Create New Account
        </Button>
      </Card>
    </Box>
  );
}

Login.propTypes = {
  setUserData: PropTypes.func.isRequired,
  setIsRegistering: PropTypes.func.isRequired,
};
