import { EditIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Box,
  PopoverArrow,
  PopoverCloseButton,
  IconButton,
  FocusLock,
  Stack,
  ButtonGroup,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Grid,
  Text,
  Flex,
  useToast,
  Select,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import React from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

function RegistrationForm() {
  const toast = useToast();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [editableIndex, setEditableIndex] = useState(null);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    username: "",
    password: "",
    role: "",
    email: "",
  });
  const history = useHistory();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDeleteIndex, setUserToDeleteIndex] = useState(null);

  const updateData = (e, index) => {
    const name = e.target.name;
    const value = e.target.value;
    setUsers((prev) => [
      ...prev.slice(0, index),
      { ...prev[index], [name]: value },
      ...prev.slice(index + 1),
    ]);
  };

  const fetchUsers = () => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/get-users`;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Please refresh the page");
        return response.json();
      })
      .then((data) => {
        setUsers(data.data);
      })
      .catch((error) =>
        toast({
          status: "error",
          title: error.message,
          position: "top",
          duration: 5000,
          isClosable: true,
        })
      );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRegister = async () => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/register`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    };

    if (user.username && user.password && user.role && user.email) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
        const data = await response.json();
        toast({
          status: "success",
          title: data.message,
          position: "top",
          duration: 5000,
          isClosable: true,
        });

        setUser({
          username: "",
          password: "",
          role: "",
          email: "",
        });
        fetchUsers();
      } catch (error) {
        toast({
          status: "error",
          title: error.message,
          position: "top",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleSave = (index) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/update-role`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(users[index]),
    };
    fetch(url, options)
      .then(async (response) => {
        if (!response.ok) {
          const errorData =
            (await response.json().message) ||
            "Something went wrong, Please try again!";
          throw new Error(errorData);
        }
        return response.json();
      })
      .then((data) => {
        toast({
          status: "success",
          title: data.message,
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        fetchUsers();
        onClose();
      })
      .catch((error) =>
        toast({
          status: "error",
          title: error.message,
          position: "top",
          duration: 5000,
          isClosable: true,
        })
      );
  };

  const handleDeleteClick = (index) => {
    setUserToDeleteIndex(index);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/delete-user`; // Assuming users have an 'id' property
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(users[userToDeleteIndex]),
    };

    fetch(url, options)
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Something went wrong, Please try again!"
          );
        }
        return response.json();
      })
      .then((data) => {
        toast({
          status: "success",
          title: data.message,
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        fetchUsers(); // Refresh the user list
        onClose();
      })
      .catch((error) =>
        toast({
          status: "error",
          title: error.message,
          position: "top",
          duration: 5000,
          isClosable: true,
        })
      )
      .finally(() => {
        setIsDeleteDialogOpen(false);
        setUserToDeleteIndex(null);
      });
  };

  return (
    <Box p={6} minHeight="100vh" bg="gray.50">
      {/* Heading */}
      <Flex direction="column" align="center" mb={5}>
        <Heading
          as="h1"
          size="2xl"
          mb={2}
          fontWeight="extrabold"
          color="#FF5733"
          textAlign="center"
        >
          User Management & Registration
        </Heading>
        <Box width="100%" height="4px" backgroundColor="#FF5733" mb={2} />
        <Button
          colorScheme="blue"
          cursor="pointer"
          onClick={() => history.replace("/admin-dashboard")}
          alignSelf="flex-end"
          p={6}
          mt={1}
        >
          Go to Dashboard
        </Button>
      </Flex>

      {/* User List */}
      <Heading size="lg" mb={4} fontSize="xl">
        Registered Users :
      </Heading>
      <Box mb={10}>
        <Text fontSize="lg" mb={4} fontWeight="bold" color="gray.700" />
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
        >
          {users.map((user, index) => (
            <Box
              key={index}
              position="relative"
              p={4}
              borderWidth={1}
              borderRadius="lg"
              boxShadow="lg"
              bg="white"
              _hover={{ bg: "gray.100", cursor: "pointer" }}
              transition="all 0.2s"
            >
              <Box fontWeight="bold" mb={2} fontSize="lg" color="teal.800">
                {user.email}
              </Box>
              <Popover
                isOpen={index === editableIndex && isOpen}
                onOpen={() => {
                  setEditableIndex(index);
                  onOpen();
                }}
                onClose={() => {
                  setEditableIndex(null);
                  onClose();
                }}
                placement="right"
                closeOnBlur={false}
              >
                <PopoverTrigger>
                  <IconButton
                    size="sm"
                    icon={<EditIcon />}
                    onClick={() => setEditableIndex(index)}
                    aria-label="Edit user"
                    position="absolute"
                    top={2}
                    right={2}
                    zIndex="tooltip"
                    variant="outline"
                    colorScheme="teal"
                  />
                </PopoverTrigger>
                <PopoverContent
                  p={6}
                  maxWidth="400px"
                  borderRadius="md"
                  boxShadow="lg"
                >
                  <FocusLock returnFocus persistentFocus={false}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <Stack spacing={4}>
                      <FormControl>
                        <FormLabel>Username</FormLabel>
                        <Input
                          type="text"
                          name="username"
                          value={user.email}
                          isReadOnly={true}
                          onChange={(e) => updateData(e, index)}
                        />
                      </FormControl>

                      <FormControl id="role">
                        <FormLabel>Role</FormLabel>
                        <Select
                          name="role"
                          value={user.role}
                          onChange={(e) => updateData(e, index)}
                          placeholder="Select a role"
                          required
                        >
                          <option value="Viewer">Viewer</option>
                          <option value="Admin">Admin</option>
                          <option value="Data Entry Operator">
                            Data Entry Operator
                          </option>
                        </Select>
                      </FormControl>

                      <ButtonGroup display="flex" justifyContent="flex-end">
                        <Button
                          colorScheme="red"
                          variant="outline"
                          onClick={() => handleDeleteClick(index)}
                        >
                          Delete
                        </Button>

                        <Button
                          colorScheme="teal"
                          onClick={() => handleSave(index)}
                        >
                          Save
                        </Button>
                      </ButtonGroup>
                    </Stack>
                  </FocusLock>
                </PopoverContent>
              </Popover>
            </Box>
          ))}
        </Grid>
      </Box>

      {/* Register Form */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        mx="auto"
        maxWidth="700px"
        p={8}
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        borderWidth={1}
      >
        <Heading as="h2" size="lg" mb={6}>
          Register
        </Heading>
        <Box width="100%" height="4px" backgroundColor="#FF5733" mb={2} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <Stack
          >
            <FormControl id="username" isRequired width="350px">
              <FormLabel fontWeight="bold" color="blue.600">
                Username
              </FormLabel>
              <Input
                type="text"
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                value={user.username}
                placeholder="Enter your username"
                focusBorderColor="blue.500"
                bg="white"
                _placeholder={{ color: "gray.400" }}
                borderColor="gray.300"
                _hover={{ borderColor: "blue.500" }}
              />
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel fontWeight="bold" color="blue.600">
                Email
              </FormLabel>
              <Input
                type="email"
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                value={user.email}
                placeholder="Enter your email"
                focusBorderColor="blue.500"
                bg="white"
                _placeholder={{ color: "gray.400" }}
                borderColor="gray.300"
                _hover={{ borderColor: "blue.500" }}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel fontWeight="bold" color="blue.600">
                Password
              </FormLabel>
              <Input
                type="password"
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                value={user.password}
                placeholder="Enter your password"
                focusBorderColor="blue.500"
                bg="white"
                _placeholder={{ color: "gray.400" }}
                borderColor="gray.300"
                _hover={{ borderColor: "blue.500" }}
              />
            </FormControl>

            <FormControl id="role" isRequired>
              <FormLabel fontWeight="bold" color="blue.600">
                Role
              </FormLabel>
              <Select
                value={user.role}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
                placeholder="Select a role"
                focusBorderColor="blue.500"
                bg="white"
                borderColor="gray.300"
                _hover={{ borderColor: "blue.500" }}
              >
                <option value="Viewer">Viewer</option>
                <option value="Data Entry Operator">Data Entry Operator</option>
                {/* Add more options as needed */}
              </Select>
            </FormControl>

            <Button
              colorScheme="blue"
              type="submit"
              size="lg"
              mt={4}
              _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
              transition="0.2s ease"
            >
              Register
            </Button>
          </Stack>
        </form>
       
      </Flex>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Deletion
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default RegistrationForm;
