import React, { useContext, useState,useEffect} from "react";
import PopupContext from "../../context/popupContext.js";
import ContactPopup from "./addressComponenetsPopup/addContactPopup.js";
import ContactContext from "../../context/contactContext.js";
import ShowContactPopup from "./addressComponenetsPopup/showContactPopup.js";
import AddressDetails from "./addressComponenetsPopup/addressDetails.js";

import { useToast, useDisclosure, Box, Button } from "@chakra-ui/react";
import Select from "react-select";
function AddressComponent() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    company,
    setCompany,
    updateData,
    contactPersonDetail,
    setContactPersonDetails,
    addressDetails,
    setAddressDetails,
    showAddressesArray,
    setShowAddressesArray,
    handleToolkit,
    toolKitInfo,
    setToolKitInfo,
  } = useContext(PopupContext);

  const showAddressPopup = () => {
    setAddressPopup(!addressPopup);
  };
  const [contactList, setContactList] = useState([]);

  const [activeIndex, setActiveIndex] = useState(null);
  const [indexToUpdate, setIndexToUpdate] = useState(null);
  const [indexToUpdateContact, setIndexToUpdateContact] = useState(null);
  const [contactPopup, setContactPopup] = useState(false);
  const [addressPopup, setAddressPopup] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactIndex, setContactIndex] = useState(null);
  const [currentContactIndex, setCurrentContactIndex] = useState(null);
  const [editContact, setEditContact] = useState(false);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(null);
  const [communication, setCommunication] = useState("");
  const handleShowContact = (index, contactIndex) => {
    console.log("index", index);
    console.log("contact index", contactIndex);
    setCurrentAddressIndex(index);
    setCurrentContactIndex(contactIndex);
    setContactPersonDetails(company.addresses[index].contacts[contactIndex]);
    console.log(company.addresses[index].contacts[contactIndex]);
    setIsContactModalOpen(true);
  };

  const handleCloseContact = () => {
    setIsContactModalOpen(false);
    setSelectedContact(null);
    setEditContact(false);
  };
  const showContactPopup = (index) => {
    console.log("Hello");
    setContactPersonDetails({
      salutation: "",
      contactPersonName: "",
      designation: "",
      department: "",
      email: "",
      officialMobile: "",
      personalMobile: "",
      linkdinProfile: "",
      typeOfBusiness: "",
      remarks: "",
      preferredModeOfCommunication: "",
      meetinglog: [],
      departments: [], // Ensure this is initialized as an array
    });
    setContactPopup(!contactPopup);
    setCurrentAddressIndex(index);
  };

  const addPersonDetails = (index) => {
    const missingFields = [];

    // Basic validations
    if (
      !contactPersonDetail.salutation ||
      !contactPersonDetail.contactPersonName
    )
      missingFields.push("Contact Person Name");
    if (!contactPersonDetail.departments.length)
      missingFields.push("Department");
    if (!contactPersonDetail.email) missingFields.push("Email");
    if (!contactPersonDetail.officialMobile)
      missingFields.push("Official Mobile Number");

    if (missingFields.length > 0) {
      toast({
        title: `${missingFields.join(",")} cannot be empty`,
        status: "error",
        position: "top",
        isClosable: true,
      });
    } else {
      company.addresses[index].contacts.push(contactPersonDetail);
      setCompany((prev) => ({
        ...prev,
        addresses: [
          ...prev.addresses.slice(0, index),
          company.addresses[index],
          ...prev.addresses.slice(index + 1),
        ],
      }));

      // Reset contactPersonDetail
      setContactPersonDetails({
        salutation: "",
        contactPersonName: "",
        designation: "",
        email: "",
        officialMobile: "",
        personalMobile: "",
        linkdinProfile: "",
        remarks: "",

        preferredModeOfCommunication: "",
        meetinglog: [],
        departments: [], // Ensure this is initialized as an array
      });

      setActiveIndex(null);
      setContactPopup(false);
    }
  };

  // const editAddress = (index) => {
  //   if (index === indexToUpdate) setIndexToUpdate(null);
  //   else {
  //     setIndexToUpdate(index);
  //     setAddressDetails(company.addresses[index]);
  //   }
  // };

  const editAddress = (index) => {
    if (index === indexToUpdate) {
      setIndexToUpdate(null);
      setAddressDetails({}); // Clear address details when canceling edit
    } else {
      setIndexToUpdate(index);
    }
  };

  useEffect(() => {
    if (indexToUpdate !== null) {
      setAddressDetails(company.addresses[indexToUpdate]);
    }
  }, [indexToUpdate, company.addresses]);


  const updateAddress = (index) => {
    let missingFields = [];

    if (!addressDetails.companyAddress) {
      missingFields.push("Company Address");
    }
    if (!addressDetails.officeTelephone) {
      missingFields.push("Office Telephone");
    }

    if (missingFields.length > 0) {
      toast({
        title: `${missingFields.join(", ")} cannot be empty`,
        status: "error",
        position: "top",
        isClosable: true,
      });
    } else {
      if (window.confirm("Are you sure you want to update the address?")) {
        setCompany((prev) => ({
          ...prev,
          addresses: [
            ...prev.addresses.slice(0, index),
            addressDetails,
            ...prev.addresses.slice(index + 1),
          ],
        }));
        setIndexToUpdate(null);
        onClose();

        toast({
          title: "Updated Successfully.",
          description: "The address has been updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  const editAddressContact = () => {
    setEditContact(!editContact);
  };

  const updateAddressContact = () => {
    const missingFields = [];

    // Basic validations
    if (
      !contactPersonDetail.salutation ||
      !contactPersonDetail.contactPersonName
    ) {
      missingFields.push("Contact Person Name");
    }
    // if (!contactPersonDetail.designation) {
    //   missingFields.push("Designation");
    // }
    if (
      !contactPersonDetail.departments ||
      contactPersonDetail.departments.length === 0
    ) {
      missingFields.push("Department");
    }
    if (!contactPersonDetail.email) {
      missingFields.push("Email");
    }
    if (!contactPersonDetail.officialMobile) {
      missingFields.push("Official Mobile Number");
    }

    // Validate sub-departments for each department
    // if (Array.isArray(contactPersonDetail.departments)) {
    //   contactPersonDetail.departments.forEach((dept) => {
    //     const deptName = dept; // Use dept name directly if it's a string
    //     const relevantSubDepts = contactPersonDetail.subDepartments && contactPersonDetail.subDepartments[deptName] || [];

    //     if (!Array.isArray(relevantSubDepts) || relevantSubDepts.length === 0) {
    //       missingFields.push(`Sub-department for ${deptName}`);
    //     }
    //   });
    // }

    if (missingFields.length > 0) {
      toast({
        title: `${missingFields.join(", ")} cannot be empty.`,
        status: "error",
        position: "top",
        isClosable: true,
      });
    } else {
      // Proceed with the update logic here
      const updatedContact = {
        ...contactPersonDetail,
      };

      // Update the contact list in state
      setContactList((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === updatedContact.id ? updatedContact : contact
        )
      );

      // Update the company state directly
      if (window.confirm("Are you sure you want to update the contact?")) {
        // Update the company data only if confirmed
        setCompany((prevCompany) => ({
          ...prevCompany,
          addresses: prevCompany.addresses.map((address) => {
            if (address.id === updatedContact.AddressNumber) {
              return {
                ...address,
                contacts: address.contacts.map((contact) =>
                  contact.id === updatedContact.id ? updatedContact : contact
                ),
              };
            }
            return address;
          }),
        }));

        // Show a success toast only after confirming the update
        toast({
          title: "Contact updated successfully.",
          status: "success",
          position: "top",
          isClosable: true,
        });
      }
      // handleCloseContact();
    }
  };

  const deleteAddress = (index) => {
    if (window.confirm("Are you sure you want to delete the address?")) {
      setCompany((prev) => ({
        ...prev,
        addresses: [
          ...prev.addresses.slice(0, index),
          ...prev.addresses.slice(index + 1),
        ],
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

  const deleteAddressContact = () => {
    if (
      window.confirm("Are you sure you want to delete the address contact?")
    ) {
      console.log("currentAddressIndex", currentAddressIndex);
      console.log("currentContactIndex", currentContactIndex);

      const addressToBeUpdated = company.addresses[currentAddressIndex];
      addressToBeUpdated.contacts = [
        ...addressToBeUpdated.contacts.slice(0, currentContactIndex),
        ...addressToBeUpdated.contacts.slice(currentContactIndex + 1),
      ];

      setCompany((prev) => ({
        ...prev,
        addresses: [
          ...prev.addresses.slice(0, currentAddressIndex),
          addressToBeUpdated,
          ...prev.addresses.slice(currentAddressIndex + 1),
        ],
      }));

      setIndexToUpdateContact(false);
      setIsContactModalOpen(false);

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

  const addPreferredModeOfCommunications = () => {
    // Check if the communication input is empty
    if (!communication) {
      toast({
        title: "Field cannot be empty",
        status: "error",
        position: "top",
        isClosable: true,
      });
      return; // Exit the function early if the field is empty
    }

    // Proceed to check if the selected communication already exists
    if (
      !contactPersonDetail.preferredModeOfCommunication
        .split(",")
        .includes(communication)
    ) {
      const arr = contactPersonDetail.preferredModeOfCommunication
        ? contactPersonDetail.preferredModeOfCommunication.split(",")
        : [];
      setContactPersonDetails((prev) => ({
        ...prev,
        preferredModeOfCommunication: [...arr, communication].join(","),
      }));
    } else {
      toast({
        title: "This mode of communication already exists",
        status: "error",
        position: "top",
        isClosable: true,
      });
    }

    // Clear the communication input field
    setCommunication("");
  };

  const removePreferredModeOfCommunication = (index) => {
    if (
      window.confirm(
        "Are you sure you want to delete preferred mode of communication?"
      )
    ) {
      if (contactPersonDetail.preferredModeOfCommunication.split(",")[index]) {
        setContactPersonDetails((prev) => ({
          ...prev,
          preferredModeOfCommunication: [
            ...prev.preferredModeOfCommunication.split(",").slice(0, index),
            ...prev.preferredModeOfCommunication.split(",").slice(index + 1),
          ].join(","),
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
    }
  };

  const [selectedBusiness, setSelectedBusiness] = useState("");
  const typeOfBusinessOptions = [
    { value: "TM", label: "TM" },
    { value: "Patent", label: "Patent" },
    { value: "Copyright", label: "Copyright" },
    { value: "Design", label: "Design" },
    { value: "Litigation", label: "Litigation" },
  ];

  const handleTypeOfBusinessChange = (selectedOptions) => {
    // Convert selected options to a comma-separated string
    const typeOfBusinessString = selectedOptions
      ? selectedOptions.map((opt) => opt.value).join(",")
      : "";

    setAddressDetails((prevDetails) => ({
      ...prevDetails,
      typeOfBusiness: typeOfBusinessString,
    }));
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-20 rounded-lg overflow-hidden m-2 p-2 shadow-md">
        <AddressDetails />
        <div className="col-span-full">
          <div className="flex flex-row flex-wrap gap-6 justify-center">
            {company.addresses.map((ele, index) => (
              <div
                key={index}
                className="max-w-md bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <div className="bg-gray-200  py-3 px-6 rounded-t-lg flex justify-between items-center gap-2 shadow-sm ">
                  <div
                    className="text-lg truncate font-bold"
                    title={ele.companyAddress || "Company Address"}
                  >
                    {ele.companyAddress || "Company Address"}
                  </div>

                  <div className="flex flex-row justify-end items-center gap-2">
                    {toolKitInfo.name === "Edit" && (
                      <div
                        style={toolKitInfo.style}
                        className="bg-gray-800 text-white p-2 border border-gray-600 rounded-md shadow-lg absolute z-10"
                      >
                        {toolKitInfo.name}
                      </div>
                    )}
                    <div
                      onClick={() => editAddress(index)}
                      className="cursor-pointer"
                    >
                      <i
                        className="fa fa-pencil-square text-xl text-blue-600"
                        aria-hidden="true"
                        data-name="Edit"
                        onMouseOver={(e) => handleToolkit(e, true)}
                        onMouseOut={(e) => handleToolkit(e, false)}
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
                    </div>
                    {toolKitInfo.name == "Update" && (
                      <div
                        style={toolKitInfo.style}
                        className="bg-gray-800 text-white p-2 border border-gray-600 rounded-md shadow-lg absolute z-10"
                      >
                        {toolKitInfo.name}
                      </div>
                    )}
                    {index === indexToUpdate && (
                      <div
                        onClick={() => updateAddress(index)}
                        className="cursor-pointer"
                      >
                        <i
                          data-name="Update"
                          className="fa fa-check text-xl text-green-600"
                          aria-hidden="true"
                          onMouseOver={(e) => handleToolkit(e, true)}
                          onMouseOut={(e) => handleToolkit(e, false)}
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
                      </div>
                    )}
                    {toolKitInfo.name == "Delete" && (
                      <div
                        style={toolKitInfo.style}
                        className="bg-gray-800 text-white p-2 border border-gray-600 rounded-md shadow-lg absolute z-10"
                      >
                        {toolKitInfo.name}
                      </div>
                    )}
                    <div
                      onClick={() => deleteAddress(index)}
                      className="cursor-pointer"
                    >
                      <i
                        data-name="Delete"
                        onMouseOver={(e) => handleToolkit(e, true)}
                        onMouseOut={(e) => handleToolkit(e, false)}
                        className="fa fa-trash text-xl text-red-600"
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
                    </div>
                    {toolKitInfo.name == "Add New Contacts" && (
                      <div
                        style={toolKitInfo.style}
                        className="bg-blue-800 text-white p-2 border border-gray-600 rounded-md shadow-lg absolute z-10"
                      >
                        {toolKitInfo.name}
                      </div>
                    )}
                    <button
                      onClick={() => showContactPopup(index)}
                      className="bg-white text-indigo-600 py-1 px-3 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <i
                        data-name="Add New Contacts"
                        onMouseOver={(e) => handleToolkit(e, true)}
                        onMouseOut={(e) => handleToolkit(e, false)}
                        className="fa fa-user text-lg "
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
                    </button>

                    {contactPopup && (
                      <ContactContext.Provider
                        value={{
                          contactPopup,
                          setContactPopup,
                          addPersonDetails,
                          currentAddressIndex,
                          communication,
                          setCommunication,
                          addPreferredModeOfCommunications,
                          removePreferredModeOfCommunication,
                        }}
                      >
                        {" "}
                        <ContactPopup></ContactPopup>{" "}
                      </ContactContext.Provider>
                    )}
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-1">
                      Company Address
                    </label>
                    {indexToUpdate === index ? (
                      <input
                        type="text"
                        value={addressDetails.companyAddress}
                        onChange={(e) =>
                          updateData(e, (value) =>
                            setAddressDetails((prevCompany) => ({
                              ...prevCompany,
                              companyAddress: value,
                            }))
                          )
                        }
                        required
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                      />
                    ) : (
                      <div className="mt-1 text-gray-700">
                        {ele.companyAddress || "-"}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold  mb-1">
                      City
                    </label>
                    {indexToUpdate === index ? (
                      <div className="text-gray-600">
                        <input
                          type="text"
                          value={addressDetails.city}
                          onChange={(e) =>
                            updateData(e, (value) =>
                              setAddressDetails((prevCompany) => ({
                                ...prevCompany,
                                city: value,
                              }))
                            )
                          }
                          required
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                        ></input>
                      </div>
                    ) : (
                      <div className="text-gray-600">{ele.city || "-"}</div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold  mb-1 font-bold">
                      State
                    </label>
                    {indexToUpdate === index ? (
                      <div className="text-gray-600">
                        <input
                          type="text"
                          value={addressDetails.state}
                          onChange={(e) =>
                            updateData(e, (value) =>
                              setAddressDetails((prevCompany) => ({
                                ...prevCompany,
                                state: value,
                              }))
                            )
                          }
                          required
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                        ></input>
                      </div>
                    ) : (
                      <div className="text-gray-600">{ele.state || "-"}</div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold  mb-1">
                      Country
                    </label>
                    {indexToUpdate === index ? (
                      <div className="text-gray-600">
                        <input
                          type="text"
                          value={addressDetails.country}
                          onChange={(e) =>
                            updateData(e, (value) =>
                              setAddressDetails((prevCompany) => ({
                                ...prevCompany,
                                country: value,
                              }))
                            )
                          }
                          required
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                        ></input>
                      </div>
                    ) : (
                      <div className="text-gray-600">{ele.country || "-"}</div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold  mb-1">
                      Office Telephone
                    </label>
                    {indexToUpdate === index ? (
                      <div className="text-gray-600">
                        <input
                          type="text"
                          value={addressDetails.officeTelephone}
                          onChange={(e) =>
                            updateData(e, (value) =>
                              setAddressDetails((prevCompany) => ({
                                ...prevCompany,
                                officeTelephone: value,
                              }))
                            )
                          }
                          required
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                        ></input>
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        {ele.officeTelephone || "-"}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold  mb-1">
                      Pincode
                    </label>
                    {indexToUpdate === index ? (
                      <div className="text-gray-600">
                        <input
                          type="text"
                          value={addressDetails.pincode}
                          onChange={(e) =>
                            updateData(e, (value) =>
                              setAddressDetails((prevCompany) => ({
                                ...prevCompany,
                                pincode: value,
                              }))
                            )
                          }
                          required
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                        ></input>
                      </div>
                    ) : (
                      <div className="text-gray-600">{ele.pincode || "-"}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-1">
                      Type of Business
                    </label>
                    {indexToUpdate === index ? (
                      <>
                        <Select
                          options={typeOfBusinessOptions}
                          isMulti
                          value={typeOfBusinessOptions.filter((opt) =>
                            (addressDetails.typeOfBusiness || "")
                              .split(",")
                              .includes(opt.value)
                          )}
                          onChange={handleTypeOfBusinessChange}
                          placeholder="Select Type of Business"
                          closeMenuOnSelect={false}
                          isClearable
                        />
                      </>
                    ) : (
                      <div className="mt-1 text-gray-700">
                        {ele.typeOfBusiness || "-"}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold  mb-1">
                      Remarks
                    </label>
                    {indexToUpdate === index ? (
                      <div className="text-gray-600">
                        <input
                          type="text"
                          value={addressDetails.remarks}
                          onChange={(e) =>
                            updateData(e, (value) =>
                              setAddressDetails((prevCompany) => ({
                                ...prevCompany,
                                remarks: value,
                              }))
                            )
                          }
                          required
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                        ></input>
                      </div>
                    ) : (
                      <div className="text-gray-600">{ele.remarks || "-"}</div>
                    )}
                  </div>
                  {/* <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Field Of Activity
                    </label>
                    {indexToUpdate === index ? (
                      <div className="text-gray-600">
                        <input
                          type="text"
                          value={addressDetails.fieldOfActivity}
                          onChange={(e) =>
                            updateData(e, (value) =>
                              setAddressDetails((prevCompany) => ({
                                ...prevCompany,
                                fieldOfActivity: value,
                              }))
                            )
                          }
                          required
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        ></input>
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        {ele.fieldOfActivity || "-"}
                      </div>
                    )}
                  </div> */}
                  {toolKitInfo.name == "Click here to see complete detail" && (
                    <div
                      style={toolKitInfo.style}
                      className="bg-gray-800 text-white border border-gray-600 rounded-md p-1"
                    >
                      {toolKitInfo.name}
                    </div>
                  )}
                  {company.addresses[index].contacts.map(
                    (contact, contactIndex) => (
                      <button
                        key={contactIndex}
                        onClick={() => handleShowContact(index, contactIndex)}
                        className="bg-gray-200 p-2 rounded-md m-1 hover:bg-gray-300 font-bold"
                        data-name="Click here to see complete detail"
                        onMouseOver={(e) => handleToolkit(e, true)}
                        onMouseOut={(e) => handleToolkit(e, false)}
                      >
                        {contact.salutation} {contact.contactPersonName}
                      </button>
                    )
                  )}
                  {isContactModalOpen && (
                    <ContactContext.Provider
                      value={{
                        contactPopup,
                        setContactPopup,
                        addPersonDetails,
                        currentAddressIndex,
                        communication,
                        setCommunication,
                        addPreferredModeOfCommunications,
                        removePreferredModeOfCommunication,
                        editAddressContact,
                        currentContactIndex,
                        editContact,
                        deleteAddressContact,
                        updateAddressContact,
                        deleteAddressContact,
                        handleCloseContact,
                      }}
                    >
                      {" "}
                      <ShowContactPopup></ShowContactPopup>{" "}
                    </ContactContext.Provider>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AddressComponent;
