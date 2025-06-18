import React, { useContext, useEffect, useState } from "react";
import PopupContext from "../../../context/popupContext.js";
import ContactContext from "../../../context/contactContext.js";

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
  HStack,
  Box,
  Textarea,
  Input,
  VStack,
  Text,
  Grid,
  GridItem,
  Select,
} from "@chakra-ui/react";
import { useToast, useDisclosure } from "@chakra-ui/react";
function ShowContactPopup() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const role = sessionStorage.getItem("role");
  const {
    company,
    setCompany,
    updateData,
    contactPersonDetail,
    setContactPersonDetails,
    meetingLog,
    setMeetingLog,
    departments,
    setDepartments,
  } = useContext(PopupContext);
  const {
    currentAddressIndex, // Default value
    communication,
    setCommunication,
    addPreferredModeOfCommunications,
    removePreferredModeOfCommunication,
    editAddressContact,
    currentContactIndex,
    editContact,
    updateAddressContact,
    deleteAddressContact,
    handleCloseContact,
  } = useContext(ContactContext);
  const [searchText, setSearchText] = useState("");
  const [editableMeetingLogs, setEditableMeetingLogs] = useState([]);
  const [editingLogIndex, setEditingLogIndex] = useState(null);

  const handleMeetingLog = () => {
    const missingFields = [];
    if (!meetingLog.date) missingFields.push("Date");
    if (!meetingLog.place) missingFields.push("Place");
    if (!meetingLog.conference) missingFields.push("Conference");
    if (!meetingLog.remarks) missingFields.push("Remarks");
    if (missingFields.length > 0) {
      toast({
        title: `${missingFields.join(",")} can not be empty`,
        status: "error",
        position: "top",
        isClosable: true,
      });
    } else {
      setCompany((prev) => ({
        ...prev,
        addresses: [
          ...prev.addresses.slice(0, currentAddressIndex),
          {
            ...prev.addresses[currentAddressIndex],
            contacts: [
              ...prev.addresses[currentAddressIndex].contacts.slice(
                0,
                currentContactIndex
              ),
              {
                ...prev.addresses[currentAddressIndex].contacts[
                  currentContactIndex
                ],
                meetinglog: [
                  ...prev.addresses[currentAddressIndex].contacts[
                    currentContactIndex
                  ].meetinglog,
                  meetingLog,
                ],
              },
              ...prev.addresses[currentAddressIndex].contacts.slice(
                currentContactIndex + 1
              ),
            ],
          },
          ...prev.addresses.slice(currentAddressIndex + 1),
        ],
      }));
      setMeetingLog({
        date: "",
        place: "",
        conference: "",
        remarks: "",
      });
    }
  };
  const filteredMeetingLogs = company.addresses[currentAddressIndex].contacts[
    currentContactIndex
  ]?.meetinglog.filter((log) =>
    JSON.stringify(log).toLowerCase().includes(searchText.toLowerCase())
  );

  const searchForMeetingLogs = (searchText) => {
    setSearchText(searchText);
  };

  useEffect(() => {
    setEditableMeetingLogs(filteredMeetingLogs);
  }, [filteredMeetingLogs]);

  // Function to edit a log
  const handleEditToggle = (index) => {
    if (editingLogIndex === index) {
      const updatedLogs = [...editableMeetingLogs];
      updatedLogs[index] = { ...editableMeetingLogs[index] };
      setEditableMeetingLogs(updatedLogs);
      setEditingLogIndex(null); // Exit edit mode
    } else {
      setEditableMeetingLogs((prevLogs) =>
        prevLogs.map((log, idx) => (idx === index ? { ...log } : log))
      );
      setEditingLogIndex(index); // Set the editing row index
    }
  };

  // Function to delete a log
  const deleteMeetingLog = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this meeting log?"
    );

    if (confirmDelete) {
      setCompany((prev) => {
        const updatedContacts = [
          ...prev.addresses[currentAddressIndex].contacts,
        ];
        const currentContact = updatedContacts[currentContactIndex];
        currentContact.meetinglog.splice(index, 1);

        return {
          ...prev,
          addresses: [
            ...prev.addresses.slice(0, currentAddressIndex),
            {
              ...prev.addresses[currentAddressIndex],
              contacts: updatedContacts,
            },
            ...prev.addresses.slice(currentAddressIndex + 1),
          ],
        };
      });
      toast({
        title: "Deleted Successfully.",
        description: "The meeting log has been deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const [newSubDepartments, setNewSubDepartments] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const handleAddDepartmentAndSubDepartment = () => {
    // Split and clean up sub-department names
    const subDepartmentsToAdd = newSubDepartments
      .split(/,\s*|\s+/)
      .map((subDept) => subDept.trim())
      .filter((subDept) => subDept);

    // if (subDepartmentsToAdd.length === 0) {
    //   alert("Sub-department cannot be empty.");
    //   return;
    // }

    if (!selectedDepartment) {
      alert("Please select a department.");
      return;
    }

    setContactPersonDetails((prevDetails) => {
      // Check if the department already exists
      const existingDepartment = prevDetails.departments.find(
        (dept) => dept.department_name === selectedDepartment
      );

      if (existingDepartment) {
        // If the department exists, update its sub-department list
        return {
          ...prevDetails,
          departments: prevDetails.departments.map((dept) =>
            dept.department_name === selectedDepartment
              ? {
                  ...dept,
                  // contactId: contactId || dept.contactId,
                  sub_department_name: dept.sub_department_name
                    ? `${dept.sub_department_name}, ${subDepartmentsToAdd.join(
                        ", "
                      )}`
                    : subDepartmentsToAdd.join(", "),
                }
              : dept
          ),
        };
      }

      // If the department doesn't exist, add it with sub-departments, and include contactId
      return {
        ...prevDetails,
        departments: [
          ...prevDetails.departments,
          {
            department_name: selectedDepartment,
            sub_department_name: subDepartmentsToAdd.join(", "),
            id: null,
          },
        ],
      };
    });

    // Reset input fields after adding
    setNewSubDepartments(""); // Clear sub-department input
    setSelectedDepartment(null); // Deselect department
  };

  const handleSubDepartmentInputChange = (value) => {
    setNewSubDepartments(value);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50 h-screen">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all w-150 h-5/6 p-4">
        <div className="flex flex-row justify-between items-center mb-2">
          {/* Centered Title */}
          <div className="text-xl font-bold text-blue-700 text-center w-1/2">
            {contactPersonDetail.salutation +
              " " +
              contactPersonDetail.contactPersonName}
          </div>
          <div className="flex flex-row justify-end gap-3 relative">
            <div className="relative" onClick={() => deleteAddressContact()}>
              <Tooltip label="Delete" fontSize="md">
                <i
                  className="fa fa-trash cursor-pointer text-red-600 text-xl"
                  aria-hidden="true"
                  style={{
                    transition: "transform 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></i>
              </Tooltip>
            </div>
            <div className="relative" onClick={() => editAddressContact()}>
              <Tooltip label="Edit" fontSize="md">
                <i
                  className="fa fa-pencil-square cursor-pointer text-blue-600 text-xl"
                  aria-hidden="true"
                  style={{
                    transition: "transform 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></i>
              </Tooltip>
            </div>
            {editContact && (
              <div onClick={() => updateAddressContact()}>
                <Tooltip label="Save" fontSize="md">
                  <i
                    className="fa fa-check cursor-pointer text-green-600 text-xl"
                    aria-hidden="true"
                    style={{
                      transition: "transform 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 w-500 ">
          <div className="bg-gray-200 p-2 border rounded-md">
            <div className="block text-sm font-bold leading-6 text-gray-900">
              Contact Person Name <span className="text-red-500">*</span>
            </div>
            {editContact ? (
              <div className="flex flex-row gap-1 text-gray-600 item-center">
                <select
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
                  className="w-24 mb-5 mt-1 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Miss">Miss</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Prof.">Prof.</option>
                </select>
                <input
                  type="text"
                  value={contactPersonDetail.contactPersonName}
                  onChange={(e) =>
                    updateData(e, (value) =>
                      setContactPersonDetails((prevDetails) => ({
                        ...prevDetails,
                        contactPersonName: value,
                      }))
                    )
                  }
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            ) : (
              <div className="text-gray-600">
                {contactPersonDetail.salutation +
                  " " +
                  contactPersonDetail.contactPersonName}
              </div>
            )}
          </div>
          <div className="bg-gray-200 p-2 border rounded-md">
            <div className="block text-sm font-bold leading-6 text-gray-900">
              Designation
            </div>
            {editContact ? (
              <div className="text-gray-600">
                <input
                  type="text"
                  value={contactPersonDetail.designation}
                  onChange={(e) =>
                    updateData(e, (value) =>
                      setContactPersonDetails((prevDetails) => ({
                        ...prevDetails,
                        designation: value,
                      }))
                    )
                  }
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            ) : (
              <div className="text-gray-600">
                {contactPersonDetail.designation}
              </div>
            )}
          </div>

          <div className="bg-gray-200 p-2 border rounded-md">
            <div className="block text-sm font-bold leading-6 text-gray-900">
              Department <span className="text-red-500">*</span>
            </div>

            {contactPersonDetail.departments.map((department) => (
              <div key={department.id} className="mb-4">
                <div>
                  {/* Non-editable Department Name */}
                  <div className="text-gray-600">
                    {department.department_name}
                  </div>

                  {/* Editable Sub-department Names */}
                  {editContact ? (
                    <div>
                      <input
                        type="text"
                        value={department.sub_department_name || ""}
                        onChange={(e) => {
                          let value = e.target.value;

                          // Replace space with comma if the user types a space
                          if (value.endsWith(" ")) {
                            value = value.trim() + ", ";
                          }

                          // Update the contact person details state
                          setContactPersonDetails((prevDetails) => ({
                            ...prevDetails,
                            departments: prevDetails.departments.map((dept) =>
                              dept.id === department.id
                                ? { ...dept, sub_department_name: value }
                                : dept
                            ),
                          }));
                        }}
                        placeholder="Add sub-departments (comma-separated)"
                        className="block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                      />
                    </div>
                  ) : (
                    department.sub_department_name && (
                      <div className="text-gray-600 mt-1">
                        Sub-departments: {department.sub_department_name}
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}

            {/* Dropdown to Select Department */}
            {editContact && (
              <div className="mt-4">
                <select
                  className="block w-full rounded-md p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  value={selectedDepartment || ""}
                >
                  <option value="">Select Department</option>
                  <option value="TM">TM</option>
                  <option value="Patent">Patent</option>
                  <option value="Copyright">Copyright</option>
                  <option value="Design">Design</option>
                  <option value="Litigation">Litigation</option>
                  <option value="Accounts">Accounts</option>
                </select>
              </div>
            )}

            {/* Input and Button to Add Department and Sub-Department */}
            {editContact && selectedDepartment && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Add new sub-departments"
                  value={newSubDepartments}
                  onChange={(e) =>
                    handleSubDepartmentInputChange(e.target.value)
                  }
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
                <button
                  onClick={handleAddDepartmentAndSubDepartment} // Add both department and sub-department
                  className="mt-2 px-4 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          <div className="bg-gray-200 p-2 border rounded-md">
            <div className="block text-sm font-bold leading-6 text-gray-900">
              Contact Person Email <span className="text-red-500">*</span>
            </div>
            {editContact ? (
              <div className="text-gray-600">
                <input
                  type="text"
                  value={contactPersonDetail.email}
                  onChange={(e) =>
                    updateData(e, (value) =>
                      setContactPersonDetails((prevDetails) => ({
                        ...prevDetails,
                        email: value,
                      }))
                    )
                  }
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            ) : (
              <div className="text-gray-600">{contactPersonDetail.email}</div>
            )}
          </div>

          <div className="bg-gray-200 p-2 border rounded-md">
            <div className="block text-sm font-bold leading-6 text-gray-900">
              Official Number <span className="text-red-500">*</span>
            </div>
            {editContact ? (
              <div className="text-gray-600">
                <div className="flex items-center">
                  <select
                    className="w-24 mr-2 mb-3 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    onChange={(e) =>
                      setContactPersonDetails((prevDetails) => ({
                        ...prevDetails,
                        officialMobile_code: e.target.value,
                      }))
                    }
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
                  </select>
                  <input
                    type="text"
                    value={contactPersonDetail.officialMobile}
                    onChange={(e) =>
                      updateData(e, (value) =>
                        setContactPersonDetails((prevDetails) => ({
                          ...prevDetails,
                          officialMobile: value,
                        }))
                      )
                    }
                    required
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-600">
                {contactPersonDetail.officialMobile}
              </div>
            )}
          </div>

          <div className="bg-gray-200 p-2 border rounded-md">
            <div className="block text-sm font-bold leading-6 text-gray-900">
              WhatsApp Number
            </div>
            {editContact ? (
              <div className="text-gray-600">
                <div className="flex items-center">
                  <select
                    className="w-24 mr-2 mb-3 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    onChange={(e) =>
                      setContactPersonDetails((prevDetails) => ({
                        ...prevDetails,
                        whatsappNumber_code: e.target.value,
                      }))
                    }
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
                  </select>
                  <input
                    type="text"
                    value={contactPersonDetail.whatsappNumber}
                    onChange={(e) =>
                      updateData(e, (value) =>
                        setContactPersonDetails((prevDetails) => ({
                          ...prevDetails,
                          whatsappNumber: value,
                        }))
                      )
                    }
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-600">
                {contactPersonDetail.whatsappNumber}
              </div>
            )}
          </div>

          <div className="bg-gray-200 p-2 border rounded-md">
            <div className="block text-sm font-bold leading-6 text-gray-900">
              Personal Mobile Number
            </div>
            {editContact ? (
              <div className="text-gray-600">
                <div className="flex items-center">
                  <select
                    className="w-24 mr-2 mb-3 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    onChange={(e) =>
                      setContactPersonDetails((prevDetails) => ({
                        ...prevDetails,
                        personalMobile_code: e.target.value,
                      }))
                    }
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
                  </select>
                  <input
                    type="text"
                    value={contactPersonDetail.personalMobile}
                    onChange={(e) =>
                      updateData(e, (value) =>
                        setContactPersonDetails((prevDetails) => ({
                          ...prevDetails,
                          personalMobile: value,
                        }))
                      )
                    }
                    required
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-600">
                {contactPersonDetail.personalMobile}
              </div>
            )}
          </div>

          <div className="bg-gray-200 p-2 border rounded-md">
            <div className="block text-sm font-bold leading-6 text-gray-900">
              LinkedIn Profile
            </div>
            <div className="text-gray-600">
              {editContact ? (
                <div className="text-gray-600">
                  <input
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
                    required
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              ) : (
                <div className="text-gray-600">
                  {contactPersonDetail.linkdinProfile}
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-200 p-2 border rounded-md">
            <div className="block text-sm font-bold leading-6 text-gray-900">
              Preferred Mode of Communication
            </div>
            <div className="text-gray-600">
              {editContact && (
                <div className="text-gray-600">
                  <input
                    type="text"
                    list="communication"
                    value={communication}
                    onChange={(e) => setCommunication(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                  <datalist id="communication">
                    <option value="Call"></option>
                    <option value="Message"></option>
                    <option value="Virtual Meet"></option>
                    <option value="Email"></option>
                    <option value="Whatsapp Call"></option>
                  </datalist>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={addPreferredModeOfCommunications}
                  colorScheme="blue"
                  disabled={!communication}
                >
                  Add
                </Button>
                <div className="grid grid-cols-2 gap-1 w-1/2">
                  {contactPersonDetail.preferredModeOfCommunication &&
                    contactPersonDetail.preferredModeOfCommunication
                      ?.split(",")
                      .map((comm, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-1 text-gray-600 p-1 rounded-md"
                        >
                          <span className="text-black">{comm}</span>
                          {editContact &&
                            contactPersonDetail.preferredModeOfCommunication && (
                              <i
                                onClick={() =>
                                  removePreferredModeOfCommunication(index)
                                }
                                className="fa fa-times-circle cursor-pointer"
                                aria-hidden="true"
                              ></i>
                            )}
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-200 p-2 border rounded-md">
            <div className="block text-sm font-bold leading-6 text-gray-900">
              Remarks
            </div>
            <div className="text-gray-600">
              {editContact ? (
                <div className="text-gray-600">
                  <input
                    type="text"
                    value={contactPersonDetail.remarks}
                    onChange={(e) =>
                      updateData(e, (value) =>
                        setContactPersonDetails((prevDetails) => ({
                          ...prevDetails,
                          remarks: value,
                        }))
                      )
                    }
                    required
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              ) : (
                <div className="text-gray-600">
                  {contactPersonDetail.remarks}
                </div>
              )}
            </div>
          </div>
          <div>
            <Box position="absolute" bottom={4} right={4}>
              <HStack spacing={4} mt={4}>
                {" "}
                {/* Use HStack for horizontal alignment */}
                <Button
                  onClick={() => onOpen()}
                  colorScheme="blue" // Use Chakra's color scheme for styling
                  fontWeight="semibold"
                  py={2}
                  px={4}
                  boxShadow="sm"
                  _focus={{
                    outline: "none",
                    ring: 2,
                    ringOffset: 2,
                    ringColor: "blue.500",
                  }} // Focus state
                >
                  Meeting logs
                </Button>
                <Button
                  onClick={handleCloseContact}
                  colorScheme="red"
                  py={2}
                  px={4}
                  boxShadow="sm"
                  _focus={{
                    outline: "none",
                    ring: 2,
                    ringOffset: 2,
                    ringColor: "red.500",
                  }}
                >
                  Close
                </Button>
              </HStack>
            </Box>
          </div>
        </div>
      </div>

      <Modal onClose={onClose} isOpen={isOpen} size="7xl" isCentered>
        <ModalOverlay bg="blackAlpha.900" />
        <ModalContent h="80vh" margin="20px">
          <ModalHeader>
            <HStack justifyContent="space-between" w="full">
              <Text fontSize="lg" fontWeight="semibold" color="blue.700">
                Meeting Logs - {contactPersonDetail.salutation}{" "}
                {contactPersonDetail.contactPersonName}
              </Text>
              <Button
                onClick={onClose}
                size="lg"
                color="red.500"
                w="50px"
                h="50px"
                fontSize="4xl"
                fontWeight="bold" // Makes the "×" bold
                bg="transparent"
                _hover={{ bg: "transparent", transform: "scale(1.1)" }}
              >
                &times;
              </Button>
            </HStack>
            <HStack mt={2} spacing={3}>
              <Input
                placeholder="Search logs"
                onChange={(e) => searchForMeetingLogs(e.target.value)}
                variant="outline"
                focusBorderColor="indigo.600"
                w="60%"
                size="sm"
              />
              {/* <Button colorScheme="green" size="sm" p="4" mb="5">
                Search
              </Button> */}
            </HStack>
          </ModalHeader>

          <ModalBody>
            <Box boxShadow="md" p={2} rounded="md" bg="gray.50" mb={2}>
              <VStack spacing={2}>
                <Grid templateColumns="repeat(3, 1fr)" gap={4} width="full">
                  <GridItem>
                    <Box display="flex" alignItems="center" w="40%">
                      <Text fontSize="sm" fontWeight="bold">
                        Date
                      </Text>
                      <Text color="red.500" ml={1}>
                        *
                      </Text>
                    </Box>
                    <Input
                      type="date"
                      value={meetingLog.date}
                      onChange={(e) =>
                        setMeetingLog((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      placeholder="Date"
                      focusBorderColor="indigo.600"
                      size="sm"
                    />
                  </GridItem>

                  <GridItem>
                    <Box display="flex" alignItems="center">
                      <Text fontSize="sm" fontWeight="bold">
                        Place
                      </Text>
                      <Text color="red.500" ml={1}>
                        *
                      </Text>
                    </Box>
                    <Textarea
                      value={meetingLog.place}
                      onChange={(e) =>
                        setMeetingLog((prev) => ({
                          ...prev,
                          place: e.target.value,
                        }))
                      }
                      placeholder="Place"
                      focusBorderColor="indigo.600"
                      size="sm"
                    />
                  </GridItem>

                  <GridItem>
                    <Box display="flex" alignItems="center">
                      <Text fontSize="sm" fontWeight="bold">
                        Conference
                      </Text>
                      <Text color="red.500" ml={1}>
                        *
                      </Text>
                    </Box>
                    <Textarea
                      value={meetingLog.conference}
                      onChange={(e) =>
                        setMeetingLog((prev) => ({
                          ...prev,
                          conference: e.target.value,
                        }))
                      }
                      placeholder="Conference"
                      focusBorderColor="indigo.600"
                      size="sm"
                    />
                  </GridItem>

                  <GridItem>
                    <Box display="flex" alignItems="center">
                      <Text fontSize="sm" fontWeight="bold">
                        Remarks
                      </Text>
                      <Text color="red.500" ml={1}>
                        *
                      </Text>
                    </Box>
                    <Textarea
                      value={meetingLog.remarks}
                      onChange={(e) =>
                        setMeetingLog((prev) => ({
                          ...prev,
                          remarks: e.target.value,
                        }))
                      }
                      placeholder="Remarks"
                      focusBorderColor="indigo.600"
                      size="sm"
                    />
                  </GridItem>
                </Grid>
                <Button
                  onClick={handleMeetingLog}
                  colorScheme="blue"
                  alignSelf="flex-end"
                  size="md"
                  mt={2}
                >
                  Add Log
                </Button>
              </VStack>
            </Box>

            <Box overflowX="auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-600">
                      Sr. No
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-600">
                      Date
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-600">
                      Place
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-600">
                      Conference
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-600">
                      Remarks
                    </th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {editableMeetingLogs?.map((log, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 text-sm text-gray-800">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-800">
                        {editingLogIndex === index ? (
                          <Input
                            type="date"
                            value={editableMeetingLogs[index].date}
                            onChange={(e) => {
                              const updatedLogs = [...editableMeetingLogs];
                              updatedLogs[index].date = e.target.value;
                              setEditableMeetingLogs(updatedLogs);
                            }}
                          />
                        ) : (
                          log.date
                        )}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-800">
                        {editingLogIndex === index ? (
                          <Input
                            value={editableMeetingLogs[index].place}
                            onChange={(e) => {
                              const updatedLogs = [...editableMeetingLogs];
                              updatedLogs[index].place = e.target.value;
                              setEditableMeetingLogs(updatedLogs);
                            }}
                          />
                        ) : (
                          log.place
                        )}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-800">
                        {editingLogIndex === index ? (
                          <Input
                            value={editableMeetingLogs[index].conference}
                            onChange={(e) => {
                              const updatedLogs = [...editableMeetingLogs];
                              updatedLogs[index].conference = e.target.value;
                              setEditableMeetingLogs(updatedLogs);
                            }}
                          />
                        ) : (
                          log.conference
                        )}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-800">
                        {editingLogIndex === index ? (
                          <Input
                            value={editableMeetingLogs[index].remarks}
                            onChange={(e) => {
                              const updatedLogs = [...editableMeetingLogs];
                              updatedLogs[index].remarks = e.target.value;
                              setEditableMeetingLogs(updatedLogs);
                            }}
                          />
                        ) : (
                          log.remarks
                        )}
                      </td>
                      {role === "Admin" && (
                        <td className="px-3 py-2 text-right">
                          <i
                            className={
                              editingLogIndex === index
                                ? "fa fa-check text-xl text-green-600"
                                : "fa fa-pencil-square text-xl text-blue-600"
                            }
                            aria-hidden="true"
                            onClick={() => handleEditToggle(index)}
                            style={{
                              transition: "transform 0.2s ease",
                              cursor: "pointer",
                            }}
                          />
                          <span style={{ margin: "0 8px" }}></span>
                          <i
                            className="fa fa-trash text-xl text-red-600"
                            aria-hidden="true"
                            onClick={() => deleteMeetingLog(index)}
                            style={{
                              transition: "transform 0.2s ease",
                              cursor: "pointer",
                            }}
                          ></i>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="red" onClick={onClose}>
              Close
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </div>
  );
}
export default ShowContactPopup;
