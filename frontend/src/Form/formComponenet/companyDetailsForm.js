import React, { useContext, useState, useEffect } from "react";
import PopupContext from "../../context/popupContext.js";
import { sectors } from "../../utils/sectors.js";
import CommunicationProtocolDetails from "./CommunicationProtocolDetails";
// import "./protocol.css";
// import "./style.css";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Modal,
  VStack,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Text,
  ModalBody,
  HStack,
  Grid,
  ModalFooter,
  useDisclosure,
  Flex,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";

function CompanyDetailsForm() {
  const {
    company,
    setCompany,
    updateData,
    showTransferDetails,
    setShowTransferDetails,
  } = useContext(PopupContext);

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validateWebsite = (website) => {
    const websitePattern =
      /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i;
    return websitePattern.test(website);
  };
  const handleInputChange = (field, value) => {
    if (field === "companyEmail") {
      value = value.replace(/\s+/g, ","); 
    }
    setCompany((prevCompany) => ({
      ...prevCompany,
      [field]: value,
    }));

    if (field === "companyEmail") {
      const emails = value.split(",").map((email) => email.trim());
      const invalidEmails = emails.filter(
        (email) => email !== "" && !validateEmail(email) 
      );

      if (invalidEmails.length > 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          companyEmail: `Invalid email(s): ${invalidEmails.join(", ")}`,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          companyEmail: undefined,
        }));
      }
    } else if (field === "companyWebsite" && !validateWebsite(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        companyWebsite: "Invalid website format",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: undefined,
      }));
    }
  };

  const [isProtocolPopupOpen, setIsProtocolPopupOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openProtocolPopup = () => {
    setIsProtocolPopupOpen(true);
  };

  const [tempCompanyData, setTempCompanyData] = useState({
    toWhom: company.toWhom,
    date: company.date,
    reason: company.reason,
    remark: company.remark,
  });
  const [isEditing, setIsEditing] = useState(false);

  // Set initial editing mode based on company data
  useEffect(() => {
    if (isOpen) {
      // Check if all fields are empty
      const isAllFieldsEmpty =
        !company.toWhom && !company.date && !company.reason && !company.remark;
      setIsEditing(isAllFieldsEmpty); // Set to edit mode if all fields are empty, otherwise view mode
      setTempCompanyData({
        toWhom: company.toWhom,
        date: company.date,
        reason: company.reason,
        remark: company.remark,
      });
    }
  }, [isOpen, company]);

  // Reset temporary state when closing the modal
  const onCloseWithReset = () => {
    setTempCompanyData({
      toWhom: company.toWhom,
      date: company.date,
      reason: company.reason,
      remark: company.remark,
    });
    setIsEditing(false);
    onClose();
  };

  const handleEditSaveToggle = () => {
    if (isEditing) {
      // Save the data to the main state
      setCompany((prevCompany) => ({
        ...prevCompany,
        toWhom: tempCompanyData.toWhom,
        date: tempCompanyData.date,
        reason: tempCompanyData.reason,
        remark: tempCompanyData.remark,
      }));
    } else {
      // Switch to edit mode
      setIsEditing(true);
    }

    if (Object.values(tempCompanyData).some((value) => value)) {
      setIsEditing(!isEditing); // Toggle the editing mode
    }
  };

  return (
    <>
      <Box mt="6">
        <Grid templateColumns="repeat(5, 1fr)" gap={1}>
          {/* Name of Company */}
          <FormControl isRequired>
            <FormLabel fontWeight="bold">Name of Client </FormLabel>
            <Input
              value={company.nameOfCompany}
              onChange={(e) =>
                updateData(e, (value) =>
                  setCompany((prevCompany) => ({
                    ...prevCompany,
                    nameOfCompany: value,
                  }))
                )
              }
              placeholder="Enter the company's name"
            />
          </FormControl>

          {/* Company Website */}
          <FormControl isInvalid={!!errors.companyWebsite}>
            <FormLabel fontWeight="bold">Company Website</FormLabel>
            <Input
              value={company.companyWebsite}
              onChange={(e) =>
                handleInputChange("companyWebsite", e.target.value)
              }
              placeholder="Enter the company's website"
            />
            <FormErrorMessage mt={1}>{errors.companyWebsite}</FormErrorMessage>
          </FormControl>

          {/* Company Email */}
          <FormControl isRequired isInvalid={!!errors.companyEmail}>
            <FormLabel fontWeight="bold">Company Email</FormLabel>
            <Input
              value={company.companyEmail}
              onChange={(e) =>
                handleInputChange("companyEmail", e.target.value)
              }
              placeholder="Enter the company's email"
            />
            <FormErrorMessage mt={1}>{errors.companyEmail}</FormErrorMessage>
          </FormControl>

          {/* Company Telephone */}
          <FormControl isRequired>
            <FormLabel fontWeight="bold">Company Telephone </FormLabel>
            <Input
              value={company.companyTelephone}
              onChange={(e) =>
                updateData(e, (value) =>
                  setCompany((prevCompany) => ({
                    ...prevCompany,
                    companyTelephone: value,
                  }))
                )
              }
              placeholder="Enter the company's phone number"
            />
          </FormControl>

          {/* LinkedIn Profile */}
          <FormControl>
            <FormLabel fontWeight="bold">LinkedIn Profile</FormLabel>
            <Input
              value={company.linkdinProfile}
              onChange={(e) =>
                updateData(e, (value) =>
                  setCompany((prevCompany) => ({
                    ...prevCompany,
                    linkdinProfile: value,
                  }))
                )
              }
              placeholder="Enter LinkedIn profile URL"
            />
          </FormControl>

          {/* Category */}
          <FormControl isRequired>
            <FormLabel fontWeight="bold">Category </FormLabel>
            <Select
              value={company.category}
              onChange={(e) =>
                setCompany((prevCompany) => ({
                  ...prevCompany,
                  category: e.target.value,
                }))
              }
              placeholder="Select category"
              h="40px"
              borderRadius={4}
            >
              <option value="Indian client">Indian client</option>
              <option value="Foreign client">Foreign client</option>
              <option value="Foreign law firm">Foreign law firm</option>
              <option value="Indian law firm">Indian law firm</option>
              <option value="CA firm">CA firm</option>
              <option value="Adv. Agency">Adv. Agency</option>
              <option value="Vendor">Vendor</option>
              <option value="Service provider">Service provider</option>
            </Select>
          </FormControl>

          {/* Sector */}
          <FormControl isRequired>
            <FormLabel fontWeight="bold">Sector</FormLabel>
            <Select
              value={company.sector}
              onChange={(e) => {
                const value = e.target.value;
                setCompany((prevCompany) => ({
                  ...prevCompany,
                  sector: value,
                  otherSector: value === "Other" ? prevCompany.otherSector : "",
                  subsector: "", // Reset subsector when sector changes
                }));
              }}
              placeholder="Select a sector"
            >
              {sectors.map((sector) => (
                <option key={sector.name} value={sector.name}>
                  {sector.name}
                </option>
              ))}
            </Select>
            {company.sector === "Other" && (
              <Input
                mt={2}
                value={company.otherSector}
                onChange={(e) => {
                  setCompany((prevCompany) => ({
                    ...prevCompany,
                    otherSector: e.target.value,
                  }));
                }}
                placeholder="Please specify other sector"
              />
            )}
          </FormControl>

          {/* Subsector */}
          <FormControl >
            <FormLabel fontWeight="bold">Subsector</FormLabel>
            {company.sector === "Other" ? (
              // Direct text input for subsector if sector is "Other"
              <Input
                value={company.subsector}
                onChange={(e) => {
                  const value = e.target.value;
                  setCompany((prevCompany) => ({
                    ...prevCompany,
                    subsector: value,
                  }));
                }}
                placeholder="Enter subsector"
              />
            ) : (
              // Dropdown selection for subsector if sector is not "Other"
              <Select
                value={company.subsector}
                onChange={(e) => {
                  const value = e.target.value;
                  setCompany((prevCompany) => ({
                    ...prevCompany,
                    subsector: value,
                    otherSubsector:
                      value === "Other" ? prevCompany.otherSubsector : "",
                  }));
                }}
                placeholder="Select a subsector"
              >
                {(
                  sectors.find((s) => s.name === company.sector)?.subsectors ||
                  []
                ).map((subsector) => (
                  <option key={subsector} value={subsector}>
                    {subsector}
                  </option>
                ))}
              </Select>
            )}
            {company.subsector === "Other" && company.sector !== "Other" && (
              <Input
                mt={2}
                value={company.otherSubsector}
                onChange={(e) => {
                  setCompany((prevCompany) => ({
                    ...prevCompany,
                    otherSubsector: e.target.value,
                  }));
                }}
                placeholder="Please specify other sub sector"
              />
            )}
          </FormControl>
        </Grid>
      </Box>
      <Box display="flex" flexDirection="row">
        <Box flex="1">
          <FormLabel fontSize="sm" fontWeight="bold" marginTop={2}>
            Is Client Active{" "}
            <Box as="span" color="red.500">
              *
            </Box>
          </FormLabel>
          <Select
            value={company.isClientActive}
            onChange={(e) =>
              updateData(e, (value) =>
                setCompany((prevCompany) => ({
                  ...prevCompany,
                  isClientActive: value,
                }))
              )
            }
            placeholder="Select"
            size="sm"
            variant="outline"
            focusBorderColor="blue.600"
            w="250px"
            h="40px"
            borderRadius={4}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
        </Box>

        <Box mt="6" display="flex" justifyContent="flex-end">
          {company.isClientActive === "Inactive" && (
            <Button colorScheme="blue" onClick={onOpen} mr="8" mb="4">
              Transfer Details
            </Button>
          )}
        </Box>

        {/* Transfer Details Modal */}
        <Modal isOpen={isOpen} onClose={onCloseWithReset}>
          <ModalOverlay />
          <ModalContent maxW="400px">
            <ModalHeader>Transfer Details</ModalHeader>
            <ModalBody>
              <Box display="grid" gap="4">
                <Box>
                  <FormLabel color="gray.700">To Whom</FormLabel>
                  <Input
                    value={tempCompanyData.toWhom}
                    onChange={(e) =>
                      setTempCompanyData((prev) => ({
                        ...prev,
                        toWhom: e.target.value,
                      }))
                    }
                    size="sm"
                    isReadOnly={!isEditing}
                  />
                </Box>
                <Box>
                  <FormLabel color="gray.700">Date</FormLabel>
                  <Input
                    type="date"
                    value={tempCompanyData.date}
                    onChange={(e) =>
                      setTempCompanyData((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    size="sm"
                    isReadOnly={!isEditing}
                  />
                </Box>
                <Box>
                  <FormLabel color="gray.700">Reason</FormLabel>
                  <Input
                    value={tempCompanyData.reason}
                    onChange={(e) =>
                      setTempCompanyData((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    size="sm"
                    isReadOnly={!isEditing}
                  />
                </Box>
                <Box>
                  <FormLabel color="gray.700">Remark</FormLabel>
                  <Input
                    value={tempCompanyData.remark}
                    onChange={(e) =>
                      setTempCompanyData((prev) => ({
                        ...prev,
                        remark: e.target.value,
                      }))
                    }
                    size="sm"
                    isReadOnly={!isEditing}
                  />
                </Box>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleEditSaveToggle}>
                {isEditing ? "Save" : "Edit"}
              </Button>
              <Button
                colorScheme="red"
                onClick={onCloseWithReset}
                marginLeft={2}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>

      {/* Manage Communication Protocol Button */}
      {company.isClientActive === "Active" && (
        <>
          <Box mt={6} display="flex" justifyContent="center">
            <Flex alignItems="center" gap="4">
              <Box fontWeight="bold" fontSize="xl" textAlign="center">
                Manage Communication Protocol
              </Box>
              <Button
                onClick={() => setIsProtocolPopupOpen((prev) => !prev)} // Toggle the popup state
                colorScheme={isProtocolPopupOpen ? "red" : "teal"} // Change color based on state
                fontWeight="bold"
                fontSize="30px"
                h="45px"
                bg={isProtocolPopupOpen ? "red.500" : "teal"} // Dynamic background color
                _hover={{
                  bg: isProtocolPopupOpen ? "red.500" : "teal.500", // Dynamic hover color
                  transform: "scale(1.01)",
                }}
              >
                {isProtocolPopupOpen ? "-" : "+"} {/* Toggle button text */}
              </Button>
            </Flex>
          </Box>

          <Box mt={4}></Box>

          {isProtocolPopupOpen && (
            <CommunicationProtocolDetails
              setIsProtocolPopupOpen={setIsProtocolPopupOpen}
            />
          )}
        </>
      )}
    </>
  );
}

export default CompanyDetailsForm;
