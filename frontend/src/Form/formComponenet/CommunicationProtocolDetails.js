import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  Text,
  Box,
  VStack,
  FormControl,
  FormLabel,
  useToast,
  Icon,
  Grid,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { MdSave, MdRefresh, MdClose } from "react-icons/md";
import PopupContext from "../../context/popupContext";

// Regular expression for validating an email address
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function CommunicationProtocolDetails(props) {
  const {
    company,
    setCompany,
    setCommunicationProtocols,
    communicationProtocols,
  } = useContext(PopupContext);
  const toast = useToast(); // For showing notifications

  const [departments, setDepartments] = useState("");
  const [otherDepartment, setOtherDepartment] = useState("");
  const [subdepart, setSubDepart] = useState("");
  const [note, setNote] = useState(""); // State for the note
  const [emailErrors, setEmailErrors] = useState({
    toEmails: "",
    ccEmailsRKD: "",
    ccEmailsClients: "",
    // otherDepartment: "",
    subdepart: "",
    note: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control
  const [modalData, setModalData] = useState({}); // State for modal data
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedData, setEditedData] = useState({});

  const closeProtocolPopup = () => {
    props.setIsProtocolPopupOpen(false);
  };

  const handleKeyDown = (e) => {
    const { name, value } = e.target;

    // Automatically add a comma and space when Enter, Comma, or Space is pressed
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault(); // Prevent the default behavior (like form submission)

      const emails = value
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);

      // Add a new empty string for the next email entry
      const newEmailList = [...emails, ""].join(", ");

      setEditedData((prev) => ({
        ...prev,
        [name]: newEmailList, // Update the state with the new email list
      }));
    }
  };

  const handleEditClick = (index, ele) => {
    setEditingIndex(index);
    setEditedData({ ...ele });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSaveClick = () => {
    const updatedManageCP = [...company.manageCP];
    updatedManageCP[editingIndex] = editedData;
    setCompany((prevCompany) => ({
      ...prevCompany,
      manageCP: updatedManageCP,
    }));
    setEditingIndex(null);
  };

  const handleDeleteClick = (index) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedProtocols = company.manageCP.filter((_, i) => i !== index);
      setCompany((prev) => ({
        ...prev,
        manageCP: updatedProtocols,
      }));

      toast({
        title: "Deleted Successfully.",
        description: "The item has been removed.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const resetFields = () => {
    setDepartments("");
    setOtherDepartment("");
    setSubDepart("");
    setNote(""); // Reset the note field
    setCommunicationProtocols({
      departments: "",
      toEmails: "",
      ccEmailsRKD: "",
      ccEmailsClients: "",
      // otherDepartment: "",
      note: "",
      subdepart: "",
    });
    setEmailErrors({
      toEmails: "",
      ccEmailsRKD: "",
      ccEmailsClients: "",
      note: "",
      subdepart: "",
    });
  };

  const handleDepartmentChange = (e) => {
    const selectedValue = e.target.value;
    setDepartments(selectedValue);
    setCommunicationProtocols((prev) => ({
      ...prev,
      departments: selectedValue === "others" ? otherDepartment : selectedValue,
    }));

    if (selectedValue !== "others") {
      setOtherDepartment("none");
    }
  };

  const validateEmails = (field, value) => {
    const emails = value
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);
    const invalidEmails = emails.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      setEmailErrors((prev) => ({
        ...prev,
        [field]: `Invalid email(s): ${invalidEmails.join(", ")}`,
      }));
    } else {
      setEmailErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleEmailChange = (field) => (e) => {
    const value = e.target.value;

    // Automatically add a comma and space when Enter, Comma, or Space is pressed
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();

      const emails = value
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);

      // Add a new empty string for the next email entry
      const newEmailList = [...emails, ""].join(", ");

      setCommunicationProtocols((prev) => ({
        ...prev,
        [field]: newEmailList,
      }));

      validateEmails(field, newEmailList);
      return;
    }

    // For other key presses, just update the state
    setCommunicationProtocols((prev) => ({
      ...prev,
      [field]: value,
    }));

    validateEmails(field, value);
  };

  const handleSave = () => {
    if (
      emailErrors.toEmails ||
      emailErrors.ccEmailsRKD ||
      emailErrors.ccEmailsClients
    ) {
      alert("Please fix the email errors before saving.");
      return;
    }

    // Set modal data and open the modal
    setModalData({
      ...communicationProtocols,
      note, // Include the note in modal data
      subdepart,
    });
    onOpen(); // Open the modal

    setCompany((prevCompany) => {
      console.log("Previous company state:", prevCompany);
      const protocols = Array.isArray(prevCompany.manageCP)
        ? prevCompany.manageCP
        : []; // Fallback to an empty array if it's not

      return {
        ...prevCompany,
        manageCP: [
          ...protocols,
          { ...communicationProtocols, note, subdepart },
        ], // Save the note
      };
    });

    toast({
      title: "Saved!",
      description: "Details saved successfully.",
      status: "success",
      position: "top-right",
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    console.log("Current company state:", company);
  }, [company]);

  return (
    <div>
      <Box
        p={3}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
        maxWidth="600px"
        mx="auto"
        borderColor="teal.500"
      >
        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
          <FormControl>
            <FormLabel fontWeight="bold">Select Department</FormLabel>
            <Select
              placeholder="Select Department"
              value={communicationProtocols.departments}
              onChange={handleDepartmentChange}
              focusBorderColor="teal.400"
            >
              <option value="Renewal">Renewal</option>
              <option value="All Patent">All Patent</option>
              <option value="others">Others</option>
            </Select>
          </FormControl>

          {departments === "others" && (
            <FormControl>
              <FormLabel fontWeight="bold">Specify Other Department</FormLabel>
              <Input
                placeholder="Specify Other Department"
                value={otherDepartment}
                onChange={(e) => setOtherDepartment(e.target.value)}
                focusBorderColor="teal.400"
              />
            </FormControl>
          )}

          <FormControl>
            <FormLabel fontWeight="bold">Sub-Department</FormLabel>
            <Input
              value={subdepart}
              onChange={(e) => setSubDepart(e.target.value)}
              focusBorderColor="teal.400"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="bold">To</FormLabel>
            <Input
              value={communicationProtocols.toEmails}
              onChange={handleEmailChange("toEmails")}
              onKeyDown={handleEmailChange("toEmails")}
              focusBorderColor="teal.400"
            />
            {emailErrors.toEmails && (
              <Text color="red.500">{emailErrors.toEmails}</Text>
            )}
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="bold">CC for RKD</FormLabel>
            <Input
              value={communicationProtocols.ccEmailsRKD}
              onChange={handleEmailChange("ccEmailsRKD")}
              onKeyDown={handleEmailChange("ccEmailsRKD")}
              focusBorderColor="teal.400"
            />
            {emailErrors.ccEmailsRKD && (
              <Text color="red.500">{emailErrors.ccEmailsRKD}</Text>
            )}
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="bold">CC for Clients</FormLabel>
            <Input
              value={communicationProtocols.ccEmailsClients}
              onChange={handleEmailChange("ccEmailsClients")}
              onKeyDown={handleEmailChange("ccEmailsClients")}
              focusBorderColor="teal.400"
            />
            {emailErrors.ccEmailsClients && (
              <Text color="red.500">{emailErrors.ccEmailsClients}</Text>
            )}
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="bold">Note</FormLabel>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              focusBorderColor="teal.400"
            />
          </FormControl>

            <Grid templateColumns="repeat(3, 1fr)" gap={3}>
              <Button
                colorScheme="teal"
                onClick={handleSave}
                leftIcon={<Icon as={MdSave} />}
              >
                Save
              </Button>
              <Button
                variant="outline"
                colorScheme="teal"
                onClick={resetFields}
                leftIcon={<Icon as={MdRefresh} />}
              >
                Reset
              </Button>
              <Button
                variant="outline"
                colorScheme="teal"
                onClick={closeProtocolPopup}
                leftIcon={<Icon as={MdClose} />}
              >
                Close
              </Button>
            </Grid>
        </Grid>
      </Box>

      {/* Enhanced Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="teal.500" color="white">
            <Text fontSize="lg" fontWeight="bold">
              Entered Data
            </Text>
          </ModalHeader>
          <ModalBody p={3}>
            <VStack spacing={2} align="stretch">
              <Box
                p={2}
                borderWidth={1}
                borderRadius="md"
                bg="gray.50"
                borderColor="teal.300"
              >
                <Text fontWeight="bold">Department:</Text>
                <Text>{modalData.departments}</Text>
              </Box>
              <Box
                p={2}
                borderWidth={1}
                borderRadius="md"
                bg="gray.50"
                borderColor="teal.300"
              >
                <Text fontWeight="bold">Sub-Department:</Text>
                <Text>{modalData.subdepart}</Text>
              </Box>
              <Box
                p={2}
                borderWidth={1}
                borderRadius="md"
                bg="gray.50"
                borderColor="teal.300"
              >
                <Text fontWeight="bold">To:</Text>
                <Text>{modalData.toEmails}</Text>
              </Box>
              <Box
                p={2}
                borderWidth={1}
                borderRadius="md"
                bg="gray.50"
                borderColor="teal.300"
              >
                <Text fontWeight="bold">CC for RKD:</Text>
                <Text>{modalData.ccEmailsRKD}</Text>
              </Box>
              <Box
                p={2}
                borderWidth={1}
                borderRadius="md"
                bg="gray.50"
                borderColor="teal.300"
              >
                <Text fontWeight="bold">CC for Clients:</Text>
                <Text>{modalData.ccEmailsClients}</Text>
              </Box>
              <Box
                p={2}
                borderWidth={1}
                borderRadius="md"
                bg="gray.50"
                borderColor="teal.300"
              >
                <Text fontWeight="bold">Note:</Text>
                <Text>{modalData.note}</Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Manage Communication Protocol Edit functionality Button */}
      {company?.manageCP?.map((ele, index) => {
        const isEditing = editingIndex === index;

        return (
          <VStack
            key={index}
            borderWidth={1}
            borderRadius="lg"
            p={3}
            mb={4}
            mt={4}
            boxShadow="lg"
            alignItems="stretch"
            borderColor="teal.500"
          >
            <Grid templateColumns="150px 1fr" gap={2} alignItems="center">
              {/* Department */}
              <Text fontSize="xl" fontWeight="bold" color="teal">
                {ele.departments}
              </Text>
              <Text></Text>

              {/* Sub-Department */}
              <Text fontWeight="bold">Sub-Department:</Text>
              {isEditing ? (
                <Input
                  type="text"
                  name="subdepart"
                  value={editedData.subdepart || ""}
                  onChange={handleChange}
                  size="sm"
                />
              ) : (
                <Text>{ele.subdepart}</Text>
              )}

              {/* To Emails */}
              <Text fontWeight="bold">To:</Text>
              {isEditing ? (
                <Input
                  type="text"
                  name="toEmails"
                  value={editedData.toEmails || ""}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  size="sm"
                />
              ) : (
                <Text>{ele.toEmails}</Text>
              )}

              {/* CC for RKD */}
              <Text fontWeight="bold">CC for RKD:</Text>
              {isEditing ? (
                <Input
                  type="text"
                  name="ccEmailsRKD"
                  value={editedData.ccEmailsRKD || ""}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  size="sm"
                />
              ) : (
                <Text>{ele.ccEmailsRKD}</Text>
              )}

              {/* CC for Clients */}
              <Text fontWeight="bold">CC for Clients:</Text>
              {isEditing ? (
                <Input
                  type="text"
                  name="ccEmailsClients"
                  value={editedData.ccEmailsClients || ""}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  size="sm"
                />
              ) : (
                <Text>{ele.ccEmailsClients}</Text>
              )}

              {/* Note */}
              <Text fontWeight="bold">Note:</Text>
              {isEditing ? (
                <Input
                  type="text"
                  name="note"
                  value={editedData.note || ""}
                  onChange={handleChange}
                  size="sm"
                />
              ) : (
                <Text>{ele.note}</Text>
              )}
            </Grid>

            <HStack spacing={5} mt={2}>
              <Button
                onClick={() =>
                  isEditing ? handleSaveClick() : handleEditClick(index, ele)
                }
                colorScheme={isEditing ? "green" : "blue"}
                className={`protocol-button ${isEditing ? "save" : "edit"}`}
              >
                {isEditing ? "Save" : "Edit"}
              </Button>

              <Button
                onClick={() => handleDeleteClick(index)}
                colorScheme="red"
                className="protocol-button delete"
              >
                Delete
              </Button>
            </HStack>
          </VStack>
        );
      })}
    </div>
  );
}

export default CommunicationProtocolDetails;
