import React, { useContext, useEffect, useState } from "react";
import PopupContext from "../../../context/popupContext.js";
import ContactContext from "../../../context/contactContext.js";
import { useToast, useDisclosure } from "@chakra-ui/react";
import {
  ChakraProvider,
  Tooltip,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Input,
  Textarea,
  Box,
  Text,
  FormControl,
  FormLabel,
  Checkbox,
  Select,
} from "@chakra-ui/react";

function ContactPopup() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [preview, setPreview] = useState("");
  const {
    company,
    setCompany,
    updateData,
    contactPersonDetail,
    setContactPersonDetails,
    setCompanyEmpty,
    addressDetails,
    setAddressDetails,
    mode,
    setMode,
    departments,
    setDepartments,
  } = useContext(PopupContext);
  const {
    contactPopup,
    setContactPopup,
    addPersonDetails,
    currentAddressIndex,

    communication,
    setCommunication,
    addPreferredModeOfCommunications,
    removePreferredModeOfCommunication,
  } = useContext(ContactContext);

  const [errors, setErrors] = useState({});

  const [newSubDepartments, setNewSubDepartments] = useState("");

  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    if (contactPopup) {
      onOpen();
    } else {
      onClose();
    }
  }, [contactPopup, onOpen, onClose]);

  // Initialize contactPersonDetail state if not already initialized
  useEffect(() => {
    // Initialize departments only if not already set in contactPersonDetails
    if (!contactPersonDetail?.departments) {
      setContactPersonDetails((prevDetails) => ({
        ...prevDetails,
        departments: [], // Initialize departments as an empty array
      }));
    }
  }, [contactPersonDetail, setContactPersonDetails]);

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setContactPersonDetails((prevDetails) => ({
      ...prevDetails,
      email: value,
    }));

    // Validate the email as the user types
    if (!validateEmail(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        companyEmail: "Invalid email format",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        companyEmail: undefined,
      }));
    }
  };

  // Function to add a new department
  const handleAddDepartment = (departmentName) => {
    setContactPersonDetails((prevDetails) => {
      if (
        prevDetails.departments.some(
          (dept) => dept.department_name === departmentName
        )
      ) {
        return prevDetails; // Prevent duplicate departments
      }

      return {
        ...prevDetails,
        departments: [
          ...prevDetails.departments,
          { department_name: departmentName, sub_department_name: "" },
        ],
      };
    });
  };

  const handleAddSubDepartment = (departmentName) => {
    const subDepartmentsToAdd = (newSubDepartments[departmentName] || "")
      .split(/,\s*|\s+/)
      .map((subDept) => subDept.trim())
      .filter((subDept) => subDept);

    if (subDepartmentsToAdd.length === 0) {
      alert("Sub-department cannot be empty.");
      return;
    }

    setContactPersonDetails((prevDetails) => ({
      ...prevDetails,
      departments: prevDetails.departments.map((dept) =>
        dept.department_name === departmentName
          ? {
              ...dept,
              sub_department_name: dept.sub_department_name
                ? `${dept.sub_department_name}, ${subDepartmentsToAdd.join(
                    ", "
                  )}`
                : subDepartmentsToAdd.join(", "),
            }
          : dept
      ),
    }));

    // Clear the input after adding sub-departments
    setNewSubDepartments((prev) => ({ ...prev, [departmentName]: "" }));
  };

  // Handle input change for a specific department's sub-department input
  const handleSubDepartmentInputChange = (departmentName, value) => {
    setNewSubDepartments((prev) => ({
      ...prev,
      [departmentName]: value,
    }));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setContactPopup(false)} size="7xl">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent margin="20px">
          <ModalHeader
            borderBottomWidth="2px"
            color="blue.600"
            textAlign="center"
          >
            Add Contact Person Details
          </ModalHeader>
          <ModalBody>
            <Box className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <Box className="p-2 border rounded-md sm:col-span-2">
                <FormControl id="contact-person-name">
                  <FormLabel fontWeight="bold">
                    Contact Person Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <Box className="flex flex-row gap-1">
                    <Select
                      width="25%"
                      marginTop={1}
                      value={contactPersonDetail.salutation || ""}
                      onChange={(e) =>
                        updateData(e, (value) =>
                          setContactPersonDetails((prevDetails) => ({
                            ...prevDetails,
                            salutation: value,
                          }))
                        )
                      }
                      required
                      className=" rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    >
                      <option value="" disabled>
                        Select Salutation
                      </option>
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Miss">Miss</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                    </Select>
                    <Input
                      type="text"
                      value={contactPersonDetail.contactPersonName || ""}
                      onChange={(e) =>
                        updateData(e, (value) =>
                          setContactPersonDetails((prevDetails) => ({
                            ...prevDetails,
                            contactPersonName: value,
                          }))
                        )
                      }
                      placeholder="Firstname Middlename Surname"
                      required
                      className="flex-grow rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    />
                  </Box>
                </FormControl>
              </Box>

              <Box className="p-2 border rounded-md">
                <FormControl id="designation">
                  <FormLabel fontWeight="bold">Designation</FormLabel>
                  <Input
                    type="text"
                    value={contactPersonDetail.designation || ""}
                    onChange={(e) =>
                      updateData(e, (value) =>
                        setContactPersonDetails((prevDetails) => ({
                          ...prevDetails,
                          designation: value,
                        }))
                      )
                    }
                    className="rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    placeholder="Enter designation"
                  />
                </FormControl>
              </Box>

              <Box className="p-2 border rounded-md">
                <FormControl id="department">
                  <FormLabel fontWeight="bold">
                    Departments <span className="text-red-500">*</span>
                  </FormLabel>

                  {/* Department Selection */}
                  <Select
                    onChange={(e) => handleAddDepartment(e.target.value)}
                    placeholder="Select Department"
                    className="rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  >
                    <option value="TM">TM</option>
                    <option value="Patent">Patent</option>
                    <option value="Copyright">Copyright</option>
                    <option value="Design">Design</option>
                    <option value="Litigation">Litigation</option>
                    <option value="Accounts">Accounts</option>
                  </Select>

                  {/* Display Departments and Manage Sub-Departments */}
                  {contactPersonDetail.departments.map((dept, index) => (
                    <Box key={index} mt={2}>
                      <Text fontWeight="bold">{dept.department_name}</Text>

                      {/* Input for New Sub-Departments, shown only if no sub-department has been added */}
                      {!dept.sub_department_name ||
                      !dept.sub_department_name.trim() ? (
                        <>
                          <Input
                            value={
                              newSubDepartments[dept.department_name] || ""
                            }
                            onChange={(e) =>
                              handleSubDepartmentInputChange(
                                dept.department_name,
                                e.target.value
                              )
                            }
                            placeholder="Add Sub-Departments"
                          />
                          <Button
                            onClick={() =>
                              handleAddSubDepartment(dept.department_name)
                            }
                          >
                            Add Sub-Department
                          </Button>
                        </>
                      ) : (
                        // Display Existing Sub-Departments as a comma-separated list
                        <Text pl={4} color="gray.600">
                          {dept.sub_department_name}
                        </Text>
                      )}
                    </Box>
                  ))}
                </FormControl>
              </Box>

              <Box className="p-2 border rounded-md">
                <FormControl id="official-mobile-number">
                  <FormLabel fontWeight="bold">
                    Official Number <span className="text-red-500">*</span>
                  </FormLabel>
                  <Box className="flex flex-row gap-1 ">
                    <Select
                      width="55%"
                      marginTop={1}
                      value={contactPersonDetail.officialMobile_code || ""}
                      onChange={(e) => {
                        const code = e.target.value;
                        setContactPersonDetails((prevDetails) => ({
                          ...prevDetails,
                          officialMobile_code: code,
                        }));
                      }}
                      className="rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    >
                      <option value="">Select</option>
                      <option value="+1">(+1) USA</option>
                      <option value="+44">(+44) GBR</option>
                      <option value="+91">(+91) IND</option>
                      <option value="+49">(+49) DEU</option>
                      <option value="+33">(+33) FRA</option>
                      <option value="+39">(+39) ITA</option>
                      <option value="+61">(+61) AUS</option>
                      <option value="+81">(+81) JPN</option>
                      <option value="+34">(+34) ESP</option>
                      <option value="+46">(+46) SWE</option>
                      <option value="+41">(+41) CHE</option>
                      <option value="+31">(+31) NLD</option>
                      <option value="+7">(+7) RUS</option>
                      <option value="+55">(+55) BRA</option>
                      <option value="+27">(+27) ZAF</option>
                      <option value="+65">(+65) SGP</option>
                      <option value="+62">(+62) IDN</option>
                      <option value="+52">(+52) MEX</option>
                      <option value="+353">(+353) IRL</option>
                      <option value="+41">(+41) CHE</option>
                      <option value="+64">(+64) NZL</option>
                      <option value="+63">(+63) PHL</option>
                      <option value="+972">(+972) ISR</option>
                      <option value="+1">(+1) CAN</option>
                      <option value="+43">(+43) AUT</option>
                      <option value="+420">(+420) CZE</option>
                      <option value="+45">(+45) DNK</option>
                      <option value="+351">(+351) PRT</option>
                      <option value="+359">(+359) BGR</option>
                      <option value="+30">(+30) GRC</option>
                      <option value="+41">(+41) CHE</option>
                      <option value="+46">(+46) SWE</option>
                      <option value="+353">(+353) IRL</option>
                      <option value="+54">(+54) ARG</option>
                      <option value="+56">(+56) CHL</option>
                    </Select>
                    <Input
                      type="text"
                      value={contactPersonDetail.officialMobile || ""}
                      onChange={(e) =>
                        updateData(e, (value) =>
                          setContactPersonDetails((prevDetails) => ({
                            ...prevDetails,
                            officialMobile: value,
                          }))
                        )
                      }
                      required
                      placeholder="Enter official mobile no."
                      className="flex-grow rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    />
                  </Box>
                </FormControl>
              </Box>

              <Box className="p-2 border rounded-md">
                <FormControl id="whatsapp-number">
                  <FormLabel fontWeight="bold">WhatsApp Number</FormLabel>
                  <Box className="flex flex-row gap-1">
                    <Select
                      width="55%"
                      marginTop={1}
                      value={contactPersonDetail.whatsappNumber_code || ""} // Default value
                      onChange={(e) => {
                        const code = e.target.value;
                        setContactPersonDetails((prevDetails) => ({
                          ...prevDetails,
                          whatsappNumber_code: code,
                        }));
                      }}
                      className="rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    >
                      <option value="">Select</option>
                      <option value="+1">(+1) USA</option>
                      <option value="+44">(+44) GBR</option>
                      <option value="+91">(+91) IND</option>
                      <option value="+49">(+49) DEU</option>
                      <option value="+33">(+33) FRA</option>
                      <option value="+39">(+39) ITA</option>
                      <option value="+61">(+61) AUS</option>
                      <option value="+81">(+81) JPN</option>
                      <option value="+34">(+34) ESP</option>
                      <option value="+46">(+46) SWE</option>
                      <option value="+41">(+41) CHE</option>
                      <option value="+31">(+31) NLD</option>
                      <option value="+7">(+7) RUS</option>
                      <option value="+55">(+55) BRA</option>
                      <option value="+27">(+27) ZAF</option>
                      <option value="+65">(+65) SGP</option>
                      <option value="+62">(+62) IDN</option>
                      <option value="+52">(+52) MEX</option>
                      <option value="+353">(+353) IRL</option>
                      <option value="+64">(+64) NZL</option>
                      <option value="+63">(+63) PHL</option>
                      <option value="+972">(+972) ISR</option>
                      <option value="+43">(+43) AUT</option>
                      <option value="+420">(+420) CZE</option>
                      <option value="+45">(+45) DNK</option>
                      <option value="+351">(+351) PRT</option>
                      <option value="+359">(+359) BGR</option>
                      <option value="+30">(+30) GRC</option>
                      <option value="+54">(+54) ARG</option>
                      <option value="+56">(+56) CHL</option>
                      {/* Add more country codes as needed */}
                    </Select>
                    <Input
                      type="text"
                      value={contactPersonDetail.whatsappNumber || ""}
                      onChange={(e) =>
                        updateData(e, (value) =>
                          setContactPersonDetails((prevDetails) => ({
                            ...prevDetails,
                            whatsappNumber: value,
                          }))
                        )
                      }
                      required
                      placeholder="Enter WhatsApp no."
                      className="flex-grow rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    />
                  </Box>
                </FormControl>
              </Box>

              <Box className="p-2 border rounded-md">
                <FormControl id="personal-mobile-number">
                  <FormLabel fontWeight="bold">
                    Personal Mobile Number
                  </FormLabel>
                  <Box className="flex flex-row gap-1">
                    <Select
                      width="55%"
                      marginTop={1}
                      value={contactPersonDetail.personalMobile_code || ""}
                      onChange={(e) => {
                        const code = e.target.value;
                        setContactPersonDetails((prevDetails) => ({
                          ...prevDetails,
                          personalMobile_code: code,
                        }));
                      }}
                      className="rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    >
                      <option value="">Select</option>
                      <option value="+1">(+1) USA</option>
                      <option value="+44">(+44) GBR</option>
                      <option value="+91">(+91) IND</option>
                      <option value="+49">(+49) DEU</option>
                      <option value="+33">(+33) FRA</option>
                      <option value="+39">(+39) ITA</option>
                      <option value="+61">(+61) AUS</option>
                      <option value="+81">(+81) JPN</option>
                      <option value="+34">(+34) ESP</option>
                      <option value="+46">(+46) SWE</option>
                      <option value="+41">(+41) CHE</option>
                      <option value="+31">(+31) NLD</option>
                      <option value="+7">(+7) RUS</option>
                      <option value="+55">(+55) BRA</option>
                      <option value="+27">(+27) ZAF</option>
                      <option value="+65">(+65) SGP</option>
                      <option value="+62">(+62) IDN</option>
                      <option value="+52">(+52) MEX</option>
                      <option value="+353">(+353) IRL</option>
                      <option value="+64">(+64) NZL</option>
                      <option value="+63">(+63) PHL</option>
                      <option value="+972">(+972) ISR</option>
                      <option value="+43">(+43) AUT</option>
                      <option value="+420">(+420) CZE</option>
                      <option value="+45">(+45) DNK</option>
                      <option value="+351">(+351) PRT</option>
                      <option value="+359">(+359) BGR</option>
                      <option value="+30">(+30) GRC</option>
                      <option value="+54">(+54) ARG</option>
                      <option value="+56">(+56) CHL</option>
                      {/* Add more country codes as needed */}
                    </Select>
                    <Input
                      type="text"
                      value={contactPersonDetail.personalMobile || ""}
                      onChange={(e) =>
                        updateData(e, (value) =>
                          setContactPersonDetails((prevDetails) => ({
                            ...prevDetails,
                            personalMobile: value,
                          }))
                        )
                      }
                      placeholder="Enter personal mobile no."
                      className="flex-grow rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    />
                  </Box>
                </FormControl>
              </Box>

              <Box className="p-2 border rounded-md">
                <FormControl
                  id="contact-person-email"
                  isInvalid={errors.companyEmail}
                >
                  <FormLabel fontWeight="bold">
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <Input
                    type="text"
                    value={contactPersonDetail.email || ""}
                    onChange={handleEmailChange}
                    required
                    className="rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    placeholder="Enter email"
                  />
                  {errors.companyEmail && (
                    <Text color="red.500" fontSize="sm">
                      {errors.companyEmail}
                    </Text>
                  )}
                </FormControl>
              </Box>

              <Box className="p-2 border rounded-md">
                <FormControl id="linkedin-profile">
                  <FormLabel fontWeight="bold">LinkedIn Profile</FormLabel>
                  <Input
                    type="text"
                    value={contactPersonDetail.linkdinProfile}
                    onChange={(e) =>
                      updateData(e, (value) =>
                        setContactPersonDetails((prevDetails) => ({
                          ...prevDetails,
                          linkdinProfile: value,
                        }))
                      )
                    }
                    className="rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    placeholder="Enter LinkedIn profile URL"
                  />
                </FormControl>
              </Box>

              <Box className="p-3 border rounded-md">
                <FormControl id="preferred-mode-of-communication">
                  <FormLabel fontWeight="bold">
                    Preferred Mode of Communication
                  </FormLabel>

                  <Input
                    type="text"
                    value={communication}
                    list="communication"
                    onChange={(e) => setCommunication(e.target.value)}
                    className="rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                  <datalist id="communication">
                    <option value="Call" />
                    <option value="Message" />
                    <option value="Virtual Meet" />
                    <option value="Email" />
                    <option value="Whatsapp Call" />
                  </datalist>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={addPreferredModeOfCommunications}
                      colorScheme="blue"
                    >
                      Add
                    </Button>
                    <div className="grid grid-cols-2 gap-1 w-1/2">
                      {contactPersonDetail.preferredModeOfCommunication &&
                        contactPersonDetail.preferredModeOfCommunication
                          .split(",")
                          .map((comm, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-1 text-gray-600 p-2 rounded-md m-1"
                              style={{ maxWidth: "50%" }}
                            >
                              <span className="text-black">{comm}</span>
                              <i
                                onClick={() =>
                                  removePreferredModeOfCommunication(index)
                                }
                                className="fa fa-times-circle cursor-pointer"
                                aria-hidden="true"
                              ></i>
                            </div>
                          ))}
                    </div>
                  </div>
                </FormControl>
              </Box>

              <Box className="p-2 border rounded-md">
                <FormControl id="remarks">
                  <FormLabel fontWeight="bold">Remarks</FormLabel>
                  <Textarea
                    rows={3}
                    value={contactPersonDetail.remarks || ""}
                    onChange={(e) =>
                      updateData(e, (value) =>
                        setContactPersonDetails((prevDetails) => ({
                          ...prevDetails,
                          remarks: value,
                        }))
                      )
                    }
                    className="rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    placeholder="Enter any remarks"
                  />
                </FormControl>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => addPersonDetails(currentAddressIndex)}
            >
              Save
            </Button>
            <Button
              ml={2}
              colorScheme="red"
              onClick={() => setContactPopup(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ContactPopup;
