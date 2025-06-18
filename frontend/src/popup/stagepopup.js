import React, { useState, useContext, useEffect } from "react";
import PopupContext from "../context/popupContext.js";
import Preview from "./preview.js";
import ContactPopup from "../Form/formComponenet/addressComponenetsPopup/addContactPopup";
import styles from "./StagePopup.module.css";
import AddressComponent from "../Form/formComponenet/addressComponenet";
import { useToast } from "@chakra-ui/react";
import Pagination from "../utils/Pagination.js";

function StagePopup() {
  const toast = useToast();
  const {
    setCompany,
    setShowStage,
    setCompanies,
    setShowUpdate,
    showAddressPopup,
    setShowAddressPopup,
    handleTotalSearchForPage,
    mailPopup,
    mailbody,
    setMailBody,
    sendMail,
    closeMailPopup,
    openMailPopup,
    filteredCompanies,
    setFilteredCompanies,
    currentPage,
    setCurrentPage,
    company,
    isPopupOpen,
    setIsPopupOpen,
    searchQuery,
    setSearchQuery,
    LastVisitedPage,
    setLastVisitedPage,
  } = useContext(PopupContext);

  const [search, setsearch] = useState("");
  const [address, setAddress] = useState({});
  const [contactPerson, setContactPerson] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContactLogs, setSelectedContactLogs] = useState([]);
  const [currentTable, setCurrentTable] = useState("company");
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const role = sessionStorage.getItem("role");
  const [hover, setHover] = useState(false);
  const itemsPerPage = 50;
  const [contactPage, setContactPage] = useState(1);
  const [updatesInfo, setUpdatesInfo] = useState({});

  useEffect(() => {
    handleTotalSearchForPage();
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/get-UpdateInfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Update Info API Response:", data); // Debugging response
        if (data && data.length > 0) {
          // Group by companyNumber and find the latest updated_at
          const latestUpdates = data.reduce((acc, update) => {
            const { companyNumber, updatedBy, updated_at } = update;
            // If companyNumber exists and this is the latest entry
            if (
              !acc[companyNumber] ||
              new Date(updated_at) > new Date(acc[companyNumber].updatedAt)
            ) {
              acc[companyNumber] = {
                updatedBy,
                updatedAt: updated_at, // Latest timestamp
              };
            }
            return acc;
          }, {});

          console.log(
            "Mapped Updates Info with Latest Timestamps:",
            latestUpdates
          );
          setUpdatesInfo(latestUpdates); // Store the latest updates
        }
      })
      .catch((error) => console.error("Error fetching update info:", error));
  }, []);

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
  
    // Parse the date-time string as UTC
    const utcDate = new Date(dateTimeString);
    if (isNaN(utcDate.getTime())) return "Invalid Date"; // Ensure the date is valid
  
    // Convert to IST by adding the offset (5 hours 30 minutes)
    const istOffset = 5 * 60 + 30; // Offset in minutes
    const istDate = new Date(utcDate.getTime() + istOffset * 60 * 1000);
  
    // Extract date and time components
    const year = istDate.getUTCFullYear(); // Use UTC methods to avoid local time interference
    const month = String(istDate.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(istDate.getUTCDate()).padStart(2, "0");
    const hours = String(istDate.getUTCHours()).padStart(2, "0");
    const minutes = String(istDate.getUTCMinutes()).padStart(2, "0");
    const seconds = String(istDate.getUTCSeconds()).padStart(2, "0");
  
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`; // Format as dd/mm/yyyy, hh:mm:ss
  };
  
  const handleAddressClick = (addressIndex, companyIndex) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + companyIndex; // Adjust for pagination
    const currentCompany = filteredCompanies[actualIndex]; // Use the actual index
    const selectedAddr = currentCompany.addresses[addressIndex];
    setSelectedAddress(selectedAddr);
    setShowAddressPopup(true);
  };

  const handleDeleteCompany = async (companyNumber) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/deleteClient?companyNumber=${companyNumber}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the company");
      }

      setCompanies((prevCompanies) =>
        prevCompanies.filter(
          (company) => company.companyNumber !== companyNumber
        )
      );
      toast({
        title: "Client deleted successfully!",
        status: "success",
        position: "top",
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting company:", error);
      alert("Failed to delete company. Please try again.");
    }
  };

  const handleSearchCompany = (query, companyNumber) => {
    const endpoint = companyNumber
      ? `${
          process.env.REACT_APP_API_BASE_URL
        }/api/getCompanyById?companyNumber=${encodeURIComponent(companyNumber)}`
      : query
      ? `${
          process.env.REACT_APP_API_BASE_URL
        }/api/search?search=${encodeURIComponent(query)}`
      : `${process.env.REACT_APP_API_BASE_URL}/api/getallforms`;

    fetch(endpoint, {
      method: "GET",
      credentials: "omit",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response for company:", data);

        if (data && data.data) {
          if (companyNumber || query) {
            setCompany({
              nameOfCompany: data.data.nameOfCompany || "",
              companyWebsite: data.data.companyWebsite || "",
              addresses: data.data.addresses || [],
              manageCP: data.data.manageCP || [],
              isClientActive: data.data.isClientActive === "Active",
            });
            setIsPopupOpen(true);
          } else {
            setCompanies(data.data);
            setCurrentTable("company");
          }
        } else {
          setCompany(null);
          setIsPopupOpen(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
        setCompany(null);
        setIsPopupOpen(false);
      });
  };

  const searchByQuery = () => {
    setCurrentPage(1);
    handleSearchCompany(searchQuery);
  };

  const searchBycompanyNumber = (companyNumber) => {
    setCurrentPage(1);
    handleSearchCompany(null, companyNumber);
  };

  const handleSearchContact = () => {
    fetch(
      `${
        process.env.REACT_APP_API_BASE_URL
      }/api/byContact?search=${encodeURIComponent(search)}`,
      {
        method: "GET",
        credentials: "omit",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          console.log("Contacts Data:", data.data);
          setContacts(data.data);
          setContactPage(1); // Reset to page 1 for new contact search results
          setCurrentTable("contacts");
        } else {
          setContacts([]);
          setCurrentTable("contacts");
        }
      })
      .catch((error) => {
        console.error(error);
        setContacts([]);
        setCurrentTable("contacts");
      });
  };

  const handleContactClick = (contact) => {
    setContactPerson(contact);
    setSelectedContactLogs(contact.meetinglog || []);
    setShowContactPopup(true);
  };

  const closeAddressClick = () => {
    setShowAddressPopup(false);
  };

  const handleShowUpdate = (index) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;

    if (role === "Viewer") {
      toast({
        title: "You do not have authority to update client.",
        status: "success",
        position: "top",
        isClosable: true,
      });
    } else {
      setLastVisitedPage(currentPage);
      setShowUpdate(true);
      setShowAddressPopup(false);
      setShowStage(false);
      setCompany(filteredCompanies[actualIndex]);
    }
  };

  const closeContactPopup = () => {
    setShowContactPopup(false);
    setContactPerson(null);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const onContactPageChange = (page) => {
    setContactPage(page);
  };

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const totalContactPages = Math.ceil(contacts.length / itemsPerPage);

  const displayedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const displayedContacts = contacts.slice(
    (contactPage - 1) * itemsPerPage,
    contactPage * itemsPerPage
  );

  return (
    <div style={{ position: "relative" }}>
      <div className={styles.container}>
        <div
          className={styles.searchContainer}
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            type="text"
            placeholder="Search anything"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button onClick={searchByQuery} className={styles.searchButton}>
            Search
          </button>
          <input
            type="text"
            placeholder="Search Contact Person"
            value={search}
            onChange={(e) => setsearch(e.target.value)}
            className={styles.searchInput}
          />
          <button onClick={handleSearchContact} className={styles.searchButton}>
            Search Contact
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
              marginRight: "20px",
            }}
          >
            {/* Display Total Pages */}
            {currentTable === "company" && (
              <>
                <span style={{ paddingRight: "40px", fontWeight: "bold" }}>
                  Total Pages: {totalPages}
                </span>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </>
            )}

            {currentTable === "contacts" && (
              <>
                <span style={{ paddingRight: "40px", fontWeight: "bold" }}>
                  Total Pages: {totalContactPages}
                </span>
                <Pagination
                  currentPage={contactPage}
                  totalPages={totalContactPages}
                  onPageChange={onContactPageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {currentTable === "contacts" && displayedContacts.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table} style={{ marginBottom: "20px" }}>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Contact Person</th>
                <th>Name of Company</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Email</th>
                <th>Official Mobile</th>
                <th>Personal Mobile</th>
                <th>LinkedIn Profile</th>
                <th>Type of Business</th>
                <th>WhatsApp Number</th>
                <th>Remarks</th>
                <th>Preferred Mode of Communication</th>
              </tr>
            </thead>
            <tbody>
              {displayedContacts.map((contact, index) => (
                <tr key={index}>
                  <td>{(contactPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{contact.contactPersonName}</td>
                  <td>
                    <span
                      className="cursor-pointer text-blue-500 hover:text-blue-600 transition-colors duration-200"
                      onClick={() =>
                        searchBycompanyNumber(
                          contact.addresses.company.companyNumber
                        )
                      }
                    >
                      {contact.addresses.company.nameOfCompany}
                    </span>
                  </td>
                  <td>{contact.designation}</td>
                  <td>{contact.department}</td>
                  <td
                    className="py-3 px-6 text-left cursor-pointer text-blue-500 hover:underline border-r border-gray-200 whitespace-normal"
                    onClick={() => openMailPopup(contact.email)}
                  >
                    {contact.email}
                  </td>
                  <td>{contact.officialMobile}</td>
                  <td>{contact.personalMobile}</td>
                  <td>
                    <a
                      href={contact.linkdinProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {contact.linkdinProfile}
                    </a>
                  </td>
                  <td>{contact.typeOfBusiness}</td>
                  <td>{contact.whatsappNumber}</td>
                  <td>{contact.remarks}</td>
                  <td>{contact.preferredModeOfCommunication}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddressPopup && selectedAddress && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            // style={{ backgroundColor: "aliceblue" }}
            // className="p-4 rounded-lg shadow-lg mr-16 ml-16 max-h-full overflow-y-auto"
            style={{
              backgroundColor: "aliceblue",
              height: "80vh",
              overflowY: "auto",
            }}
            className="p-4 rounded-lg shadow-lg mr-16 ml-16"
          >
            <div style={{ position: "relative", paddingBottom: "5px" }}>
              <span className="text-lg font-semibold">Address Details : </span>
              <span
                aria-label="Close"
                role="button"
                className="close cursor-pointer absolute  right-4 text-red-500 font-bold text-5xl "
                style={{
                  transition: "all 0.3s ease",
                  transform: hover ? "scale(1.1)" : "scale(1)",
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={closeAddressClick}
              >
                &times;
              </span>
            </div>
            {/* Horizontal line after Address Details */}
            <hr style={{ border: "1px solid black", margin: "10px 0" }} />

            <div className="space-y-2">
              <div className="address-details space-y-4">
                <div className="detail-item">
                  <strong className="text-blue-600">Address:</strong>{" "}
                  {selectedAddress.companyAddress}
                </div>
                <hr className="border-gray-300 my-2" />
                <div className="detail-item">
                  <strong className="text-blue-600">City:</strong>{" "}
                  {selectedAddress.city}
                </div>
                <hr className="border-gray-300 my-2" />
                <div className="detail-item">
                  <strong className="text-blue-600">State:</strong>{" "}
                  {selectedAddress.state}
                </div>
                <hr className="border-gray-300 my-2" />
                <div className="detail-item">
                  <strong className="text-blue-600">Country:</strong>{" "}
                  {selectedAddress.country}
                </div>
                <hr className="border-gray-300 my-2" />
                <div className="detail-item">
                  <strong className="text-blue-600">Pincode:</strong>{" "}
                  {selectedAddress.pincode}
                </div>
                <hr className="border-gray-300 my-2" />
                <div className="detail-item">
                  <strong className="text-blue-600">Office Telephone:</strong>{" "}
                  {selectedAddress.officeTelephone}
                </div>
                <hr className="border-gray-300 my-2" />
                {/* <div className="detail-item">
                  <strong className="text-blue-600">Field of Activity:</strong>{" "}
                  {selectedAddress.fieldOfActivity}
                </div> */}
                <hr className="border-gray-300 my-2" />
              </div>

              {/* Label with structure for Contacts */}
              <div className="mt-4">
                <strong>Contacts:</strong>
                <hr style={{ border: "1px solid black", margin: "10px 0" }} />
              </div>

              <table className="min-w-full bg-white border border-gray-200 mt-3">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal text-center">
                    <th className="py-2 px-4 text-left border-b border-gray-300">
                      Name
                    </th>
                    <th className="py-2 px-4 text-left border-b border-gray-300">
                      Department
                    </th>
                    <th className="py-2 px-4 text-left border-b border-gray-300">
                      Designation
                    </th>
                    <th className="py-2 px-4 text-left border-b border-gray-300">
                      Email
                    </th>
                    <th className="py-2 px-4 text-left border-b border-gray-300">
                      Whatsapp No.
                    </th>
                    <th className="py-2 px-4 text-left border-b border-gray-300">
                      Official Mobile
                    </th>
                    <th className="py-2 px-4 text-left border-b border-gray-300">
                      Personal Mobile
                    </th>
                    <th className="py-2 px-4 text-left border-b border-gray-300">
                      LinkedIn Profile
                    </th>
                    <th className="py-2 px-4 text-left border-b border-gray-300">
                      Preferred Mode of Communication
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {selectedAddress.contacts.map((contact, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                    >
                      <td className="py-3 px-6 text-left whitespace-normal border-r border-gray-200">
                        {contact.contactPersonName}
                      </td>
                      <td className="py-3 px-6 text-left border-r border-gray-200 whitespace-normal">
                        {contact.department}
                      </td>
                      <td className="py-3 px-6 text-left border-r border-gray-200 whitespace-normal">
                        {contact.designation}
                      </td>
                      <td className="py-3 px-6 text-left border-r border-gray-200 whitespace-normal">
                        <span
                          className="cursor-pointer text-blue-500 hover:underline"
                          onClick={() => window.open(`mailto:${contact.email}`)}
                          aria-label={`Email ${contact.contactPersonName}`}
                        >
                          {contact.email}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-left border-r border-gray-200 whitespace-normal">
                        <span
                          className="cursor-pointer text-blue-500 hover:underline"
                          onClick={() =>
                            window.open(
                              `https://wa.me/${contact.whatsappNumber}`
                            )
                          }
                          aria-label={`Whatsapp ${contact.contactPersonName}`}
                        >
                          {contact.whatsappNumber}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-left border-r border-gray-200 whitespace-normal">
                        {contact.officialMobile}
                      </td>
                      <td className="py-3 px-6 text-left border-r border-gray-200 whitespace-normal">
                        {contact.personalMobile}
                      </td>
                      <td className="py-3 px-6 text-left border-r border-gray-200 whitespace-normal">
                        <a
                          href={
                            contact.linkdinProfile?.startsWith("http")
                              ? contact.linkdinProfile
                              : `https://${contact.linkdinProfile}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                          aria-label={`LinkedIn profile of ${contact.contactPersonName}`}
                        >
                          {contact.linkdinProfile}
                        </a>
                      </td>
                      <td className="py-3 px-6 text-left border-r border-gray-200 whitespace-normal">
                        {contact.preferredModeOfCommunication}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {currentTable === "company" && displayedCompanies.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table} style={{ marginBottom: "20px" }}>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Name of Company</th>
                <th>Company Website</th>
                <th>Sector</th>
                <th>Company Email</th>
                <th>Company Telephone</th>
                <th>Contact Person</th>
                <th>Address</th>
                {role !== "Viewer" && <th>Update</th>}
                <th>Updated By</th>
                {role === "Admin" && <th>Delete</th>}
              </tr>
            </thead>
            <tbody>
              {displayedCompanies.map((company, companyIndex) => {
                const { companyNumber } = company;
                const updateInfo = updatesInfo[companyNumber] || {}; // Fetch updates by company number
                const { updatedBy, updatedAt } = updateInfo; // Destructure mapped info

                const updatedInfo = updatedBy
                  ? `${updatedBy} on ${
                      updatedAt ? formatDate(updatedAt) : "N/A"
                    }`
                  : "N/A";
                return (
                  <tr key={companyIndex}>
                    <td>
                      {(currentPage - 1) * itemsPerPage + companyIndex + 1}
                    </td>
                    <td>
                      <span
                        className="cursor-pointer text-blue-500 hover:text-blue-600 transition-colors duration-200"
                        onClick={() =>
                          searchBycompanyNumber(company.companyNumber)
                        }
                      >
                        {company.nameOfCompany}
                      </span>
                    </td>
                    <td>
                      <a
                        href={`http://${company.companyWebsite}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {company.companyWebsite}
                      </a>
                    </td>
                    <td>{company.sector}</td>
                    <td>{company.companyEmail}</td>
                    <td>{company.companyTelephone}</td>
                    <td>
                      {company.addresses.map((address) =>
                        address.contacts.map((contact) => (
                          <div
                            key={contact.contactPersonName}
                            onClick={() => handleContactClick(contact)}
                          >
                            {contact.contactPersonName}
                          </div>
                        ))
                      )}
                    </td>

                    <td>
                      {company.addresses.map((addr, index) => (
                        <div
                          key={index}
                          className={`${
                            index !== company.addresses.length - 1
                              ? "border-b-4 border-gray-400 mb-2 pb-2"
                              : ""
                          } ${styles.addressLink}`}
                          onClick={() =>
                            handleAddressClick(index, companyIndex)
                          }
                        >
                          {addr.companyAddress}, {addr.city}, {addr.state}
                        </div>
                      ))}
                    </td>
                    {role !== "Viewer" && (
                      <td>
                        <button
                          onClick={() => handleShowUpdate(companyIndex)}
                          className={styles.updateButton}
                        >
                          Update
                        </button>
                      </td>
                    )}
                    <td>{updatedInfo}</td>
                    {role === "Admin" && (
                      <td>
                        <button
                          onClick={() =>
                            handleDeleteCompany(company.companyNumber)
                          }
                          className={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {mailPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="subject"
              >
                Subject
              </label>
              <input
                id="subject"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={mailbody.subject}
                onChange={(e) =>
                  setMailBody((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="message-body"
              >
                Message Body
              </label>
              <textarea
                id="message-body"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={mailbody.body}
                onChange={(e) =>
                  setMailBody((prev) => ({ ...prev, body: e.target.value }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow"
                onClick={sendMail}
              >
                Send
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow"
                onClick={closeMailPopup}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isPopupOpen && <Preview />}
    </div>
  );
}

export default React.memo(StagePopup);

// import React, { useState, useContext, useEffect, useRef } from "react";
// import PopupContext from "../context/popupContext.js";
// import Preview from "./preview.js";
// import ContactPopup from "../Form/formComponenet/addressComponenetsPopup/addContactPopup"; // Adjust the import as needed
// import styles from "./StagePopup.module.css";
// import AddressComponent from "../Form/formComponenet/addressComponenet";
// import { useToast } from "@chakra-ui/react";
// import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";

// function StagePopup() {
//   const toast = useToast();
//   const {
//     setCompany,
//     setShowStage,
//     setCompanies,
//     setShowUpdate,
//     showAddressPopup,
//     setShowAddressPopup,
//     handleTotalSearchForPage,
//     mailPopup,
//     mailbody,
//     setMailBody,
//     sendMail,
//     closeMailPopup,
//     openMailPopup,
//     filteredCompanies,
//     company,
//     isPopupOpen,
//     setIsPopupOpen,
//     closePopup,
//     searchQuery,
//     setSearchQuery,
//     currentPage,
//     setCurrentPage,
//     LastVisitedPage,
//     setLastVisitedPage,
//   } = useContext(PopupContext);

//   const [search, setsearch] = useState("");
//   const [address, setAddress] = useState({});
//   const [contactPerson, setContactPerson] = useState(null);
//   const [contacts, setContacts] = useState([]);
//   const [selectedContactLogs, setSelectedContactLogs] = useState([]);
//   const [currentTable, setCurrentTable] = useState("company");
//   const [showContactPopup, setShowContactPopup] = useState(false); // State to manage ContactPopup visibility
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const previousTable = useRef(currentTable);
//   const role = sessionStorage.getItem("role");
//   const [hover, setHover] = useState(false);

//   // Pagination states

//   const itemsPerPage = 30;
//   const totalCompanies = filteredCompanies.length; // Total number of companies
//   const totalContacts = contacts.length;
//   const totalPages =
//     currentTable === "contacts"
//       ? Math.ceil(totalContacts / itemsPerPage)
//       : Math.ceil(totalCompanies / itemsPerPage);

//   useEffect(() => {
//     handleTotalSearchForPage();
//   }, []);

//   useEffect(() => {
//     if (previousTable.current !== currentTable) {
//       setCurrentPage(1); // Reset currentPage to 1 only if the table has changed
//     }
//     // Update the previousTable to the currentTable after each change
//     previousTable.current = currentTable;
//   }, [currentTable]);

//   const handleAddressClick = (addressIndex, companyIndex) => {
//     const currentCompany = getCurrentItems()[companyIndex];
//     const selectedAddr = currentCompany.addresses[addressIndex];
//     setSelectedAddress(selectedAddr);
//     setShowAddressPopup(true);
//   };

//   const handleDeleteCompany = async (companyNumber) => {
//     // Replace this with the actual ID retrieval method for the company
//     //  const companyId = company[companyNumber]; // Assuming 'companies' is your data array

//     // Confirm with the user before deletion
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this company?"
//     );
//     if (!confirmDelete) return;

//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_BASE_URL}/api/deleteClient?companyNumber=${companyNumber}`,
//         {
//           method: "DELETE",
//           headers: {
//             // Authorization: `Bearer ${token}`, // Add auth token if required
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to delete the company");
//       }

//       // Update local state to reflect deletion, assuming `setCompanies` is used to manage state
//       setCompanies((prevCompanies) =>
//         prevCompanies.filter((_, i) => i !== companyNumber)
//       );
//       toast({
//         title: "Client deleted successfully!",
//         status: "success",
//         position: "top",
//         isClosable: true,
//       });
//       // alert("Company deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting company:", error);
//       alert("Failed to delete company. Please try again.");
//     }
//   };

//   // const handleSearchCompany = (query) => {
//   //   const endpoint = query
//   //     ? `/api/search?search=${encodeURIComponent(query)}`
//   //     : `/api/getallforms`; // Ensure this is correct

//   //   fetch(endpoint, {
//   //     method: "GET", // Specify the method
//   //     credentials: "omit", // No credentials will be sent
//   //   })
//   //     .then((response) => response.json())
//   //     .then((data) => {
//   //       console.log("API Response:", data);

//   //       if (data.data && data.data.length > 0) {
//   //         if (query && data.data.length === 1) {
//   //           const companyData = data.data[0]; // Assuming you still want the first match
//   //           setCompany({
//   //             nameOfCompany: companyData.nameOfCompany || "",
//   //             companyWebsite: companyData.companyWebsite || "",
//   //             addresses: companyData.addresses || [],
//   //             manageCP: companyData.manageCP || [],
//   //             isClientActive: companyData.isClientActive === "Active",
//   //           });
//   //           setIsPopupOpen(true); // Open the popup to display company details
//   //         } else {
//   //           setCompanies(data.data); // Set the full list of companies
//   //           setCurrentTable("company"); // Update the table to show companies
//   //           setIsPopupOpen(false);
//   //         }
//   //       } else {
//   //         setCompany({}); // Reset the company details
//   //         setIsPopupOpen(false); // Close the popup if there's no data
//   //         if (!query) {
//   //           setCompanies([]); // Reset if no companies found
//   //           setCurrentTable("company"); // Ensure we show the empty company list
//   //         }
//   //       }
//   //     })
//   //     .catch((error) => {
//   //       console.error(error);
//   //       setCompany({}); // Reset on error
//   //       setIsPopupOpen(false); // Close the popup
//   //       setCompanies([]); // Reset the company list on error
//   //       setCurrentTable("company"); // Ensure we show the empty company list
//   //     });
//   // };

//   // const handleSearchCompany = (query, companyNumber) => {
//   //   const endpoint = companyNumber
//   //     ? `/api/getCompanyById?companyNumber=${encodeURIComponent(
//   //         companyNumber
//   //       )}`
//   //     : query
//   //     ? `/api/search?search=${encodeURIComponent(
//   //         query
//   //       )}`
//   //     : `/api/getallforms`;

//   //   fetch(endpoint, {
//   //     method: "GET",
//   //     credentials: "omit",
//   //   })
//   //     .then((response) => response.json())
//   //     .then((data) => {
//   //       console.log("API Response for company:", data);

//   //       // Access company details from data.data
//   //       if (data && data.data && data.data.companyNumber) {
//   //         const companyData = data.data; // company details

//   //         setCompany({
//   //           nameOfCompany: companyData.nameOfCompany || "",
//   //           companyWebsite: companyData.companyWebsite || "",
//   //           addresses: companyData.addresses || [],
//   //           manageCP: companyData.manageCP || [],
//   //           isClientActive: companyData.isClientActive === "Active",
//   //         });
//   //         setIsPopupOpen(true); // Open the popup if company data is valid
//   //       } else {
//   //         console.warn("No company data found for:", companyNumber || query);
//   //         // setCompany(null); // Reset company data if empty
//   //         setIsPopupOpen(false); // Close popup if no data is found
//   //       }
//   //     })
//   //     .catch((error) => {
//   //       console.error("Error fetching company data:", error);
//   //       setCompany(null); // Reset company data if there’s an error
//   //       setIsPopupOpen(false); // Close popup if there's an error
//   //     });
//   // };
//   const [isTableReloading, setIsTableReloading] = useState(false); // State to force rerender

//   const handleSearchCompany = (query, companyNumber) => {
//     const endpoint = companyNumber
//       ? `${
//           process.env.REACT_APP_API_BASE_URL
//         }/api/getCompanyById?companyNumber=${encodeURIComponent(companyNumber)}`
//       : query
//       ? `${
//           process.env.REACT_APP_API_BASE_URL
//         }/api/search?search=${encodeURIComponent(query)}`
//       : `${process.env.REACT_APP_API_BASE_URL}/api/getallforms`;

//     fetch(endpoint, {
//       method: "GET",
//       credentials: "omit",
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("API Response for company:", data);

//         if (data && data.data) {
//           if (companyNumber || query) {
//             // Set specific company details
//             setCompany({
//               nameOfCompany: data.data.nameOfCompany || "",
//               companyWebsite: data.data.companyWebsite || "",
//               addresses: data.data.addresses || [],
//               manageCP: data.data.manageCP || [],
//               isClientActive: data.data.isClientActive === "Active",
//             });
//             setIsPopupOpen(true);
//           } else {
//             // For empty search, set the full table
//             setCompanies(data.data);
//             setCurrentTable("company");
//             setIsTableReloading((prev) => !prev); // Trigger re-render
//           }
//         } else {
//           setCompany(null);
//           setIsPopupOpen(false);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching company data:", error);
//         setCompany(null);
//         setIsPopupOpen(false);
//       });
//   };

//   const searchByQuery = () => {
//     handleSearchCompany(searchQuery);
//   };

//   // const searchByCompanyName = (companyName) => {
//   //   handleSearchCompany(companyName);
//   // };

//   const searchBycompanyNumber = (companyNumber) => {
//     handleSearchCompany(null, companyNumber);
//     // Popup state is managed inside handleSearchCompany, which only opens the popup if data is valid
//   };
//   const handleSearchContact = () => {
//     fetch(
//       `${
//         process.env.REACT_APP_API_BASE_URL
//       }/api/byContact?search=${encodeURIComponent(search)}`,
//       {
//         method: "GET", // Specify the method
//         credentials: "omit", // No credentials will be sent
//       }
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.data && data.data.length > 0) {
//           console.log("Contacts Data:", data.data);
//           setContacts(data.data);
//           setCurrentTable("contacts");
//         } else {
//           setContacts([]);
//           setCurrentTable("contacts");
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//         setContacts([]);
//         setCurrentTable("contacts");
//       });
//   };

//   const handleContactClick = (contact) => {
//     setContactPerson(contact);
//     setSelectedContactLogs(contact.meetinglog || []);
//     setShowContactPopup(true); // Open the ContactPopup
//   };

//   const closeAddressClick = () => {
//     setShowAddressPopup(false);
//   };

//   const handleShowUpdate = (actualIndex) => {
//     const role = sessionStorage.getItem("role"); // Retrieve the role from local storage

//     if (role === "Viewer") {
//       toast({
//         title: "You do not have authority to update client.",
//         status: "success",
//         position: "top",
//         isClosable: true,
//       });
//     } else {
//       // Call the function to show the AddPopup if the user has the right role
//       setLastVisitedPage(currentPage);
//       setShowUpdate(true);
//       setShowAddressPopup(false);
//       setShowStage(false);
//       setCompany(filteredCompanies[actualIndex - 1]);
//     }
//   };

//   const closeContactPopup = () => {
//     setShowContactPopup(false); // Close the ContactPopup
//     setContactPerson(null);
//   };

//   const getCurrentItems = () => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;

//     // Check which table is currently displayed and return the appropriate items
//     if (currentTable === "contacts") {
//       return contacts.slice(startIndex, endIndex);
//     } else if (currentTable === "company") {
//       return filteredCompanies.slice(startIndex, endIndex);
//     }

//     return []; // Return an empty array if no valid table is selected
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handleFirstPage = () => {
//     setCurrentPage(1);
//   };

//   const handleLastPage = () => {
//     setCurrentPage(totalPages);
//   };

//   const handlePageChange = (e) => {
//     const page = e.target.value;

//     if (isValidPageInput(page)) {
//       setCurrentPage(parseInt(page, 10));
//     } else {
//       setCurrentPage(""); // Consider how you want to handle empty input
//     }
//   };
//   const isValidPageInput = (page) => {
//     return /^\d*$/.test(page) && page !== "" && page >= 1 && page <= totalPages;
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       <div className={styles.container}>
//         <div
//           className={styles.searchContainer}
//           style={{ display: "flex", alignItems: "center" }}
//         >
//           <input
//             type="text"
//             placeholder="Search anything"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className={styles.searchInput}
//           />

//           <button onClick={searchByQuery} className={styles.searchButton}>
//             Search
//           </button>

//           <input
//             type="text"
//             placeholder="Search Contact Person"
//             value={search}
//             onChange={(e) => setsearch(e.target.value)}
//             className={styles.searchInput}
//           />

//           <button onClick={handleSearchContact} className={styles.searchButton}>
//             Search Contact
//           </button>
//           <div className={styles.totalPages} style={{ marginLeft: "10px" }}>
//             {" "}
//             Total Pages : {totalPages}{" "}
//           </div>

//           <div
//             className={styles.pagination}
//             style={{ display: "flex", alignItems: "center", marginLeft: "2px" }}
//           >
//             <div className={styles.buttonGroup}>
//               <button onClick={handleFirstPage} disabled={currentPage === 1}>
//                 First
//               </button>
//               <button onClick={handlePrevPage} disabled={currentPage === 1}>
//                 Prev
//               </button>

//               <input
//                 type="text"
//                 value={currentPage}
//                 onChange={handlePageChange}
//                 min="1"
//                 max={totalPages}
//                 style={{ width: "50px", margin: "0 10px", textAlign: "center" }}
//               />

//               <button
//                 onClick={handleNextPage}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//               <button
//                 onClick={handleLastPage}
//                 disabled={currentPage === totalPages}
//               >
//                 Last
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {currentTable === "contacts" && contacts.length > 0 && (
//         <div className={styles.tableContainer}>
//           {/* <div className={styles.tableResponsive}> */}
//           <table className={styles.table} style={{ marginBottom: "20px" }}>
//             <thead>
//               <tr>
//                 <th>Sr. No.</th>
//                 <th>Contact Person</th>
//                 <th>Name of Company</th>
//                 <th>Designation</th>
//                 <th>Department</th>
//                 <th>Email</th>
//                 <th>Official Mobile</th>
//                 <th>Personal Mobile</th>
//                 <th>LinkedIn Profile</th>
//                 <th>Type of Business</th>
//                 <th>WhatsApp Number</th>
//                 <th>Remarks</th>
//                 <th>Preferred Mode of Communication</th>
//               </tr>
//             </thead>
//             <tbody>
//               {getCurrentItems().map((contact, contactIndex) => {
//                 const actualIndex =
//                   (currentPage - 1) * itemsPerPage + contactIndex + 1;
//                 return (
//                   <tr key={contactIndex}>
//                     <td>{actualIndex}</td>
//                     <td>{contact.contactPersonName}</td>

//                     {/*
//                     <td>
//                       <span
//                         className="cursor-pointer text-blue-500 hover:text-blue-600 transition-colors duration-200"
//                         onClick={() =>
//                           searchByCompanyName(
//                             contact.addresses.company.nameOfCompany
//                           )
//                         }
//                       >
//                         {contact.addresses.company.nameOfCompany}
//                       </span>
//                     </td> */}
//                     <td>
//                       <span
//                         className="cursor-pointer text-blue-500 hover:text-blue-600 transition-colors duration-200"
//                         onClick={() =>
//                           searchBycompanyNumber(
//                             contact.addresses.company.companyNumber
//                           )
//                         }
//                       >
//                         {contact.addresses.company.nameOfCompany}
//                       </span>
//                     </td>

//                     <td>{contact.designation}</td>
//                     <td>{contact.department}</td>
//                     <td
//                       className="py-3 px-6 text-left cursor-pointer text-blue-500 hover:underline border-r border-gray-200 whitespace-normal"
//                       onClick={() => openMailPopup(contact.email)}
//                     >
//                       {contact.email}
//                     </td>
//                     <td>{contact.officialMobile}</td>
//                     <td>{contact.personalMobile}</td>
//                     <td>
//                       <a
//                         href={contact.linkdinProfile}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-500 hover:underline"
//                       >
//                         {contact.linkdinProfile}
//                       </a>
//                     </td>
//                     <td>{contact.typeOfBusiness}</td>
//                     <td>{contact.whatsappNumber}</td>
//                     <td>{contact.remarks}</td>
//                     <td>{contact.preferredModeOfCommunication}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//           {/* </div> */}
//         </div>
//       )}

//       {showAddressPopup && selectedAddress && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div
//             style={{ backgroundColor: "aliceblue" }}
//             className="p-4 rounded-lg shadow-lg mr-16 ml-16 max-h-full overflow-y-auto"
//           >
//             <div style={{ position: "relative", paddingBottom: "5px" }}>
//               <span className="text-lg font-semibold">Address Details : </span>
//               <span
//                 aria-label="Close"
//                 role="button"
//                 className="close cursor-pointer absolute  right-4 text-red-500 font-bold text-5xl "
//                 style={{
//                   transition: "all 0.3s ease",
//                   transform: hover ? "scale(1.1)" : "scale(1)",
//                 }}
//                 onMouseEnter={() => setHover(true)}
//                 onMouseLeave={() => setHover(false)}
//                 onClick={closeAddressClick}
//               >
//                 &times;
//               </span>
//             </div>
//             {/* Horizontal line after Address Details */}
//             <hr style={{ border: "1px solid black", margin: "10px 0" }} />

//             <div className="space-y-2">
//               <div className="address-details space-y-4">
//                 <div className="detail-item">
//                   <strong className="text-blue-600">Address:</strong>{" "}
//                   {selectedAddress.companyAddress}
//                 </div>
//                 <hr className="border-gray-300 my-2" />
//                 <div className="detail-item">
//                   <strong className="text-blue-600">City:</strong>{" "}
//                   {selectedAddress.city}
//                 </div>
//                 <hr className="border-gray-300 my-2" />
//                 <div className="detail-item">
//                   <strong className="text-blue-600">State:</strong>{" "}
//                   {selectedAddress.state}
//                 </div>
//                 <hr className="border-gray-300 my-2" />
//                 <div className="detail-item">
//                   <strong className="text-blue-600">Country:</strong>{" "}
//                   {selectedAddress.country}
//                 </div>
//                 <hr className="border-gray-300 my-2" />
//                 <div className="detail-item">
//                   <strong className="text-blue-600">Pincode:</strong>{" "}
//                   {selectedAddress.pincode}
//                 </div>
//                 <hr className="border-gray-300 my-2" />
//                 <div className="detail-item">
//                   <strong className="text-blue-600">Office Telephone:</strong>{" "}
//                   {selectedAddress.officeTelephone}
//                 </div>
//                 <hr className="border-gray-300 my-2" />
//                 {/* <div className="detail-item">
//                   <strong className="text-blue-600">Field of Activity:</strong>{" "}
//                   {selectedAddress.fieldOfActivity}
//                 </div> */}
//                 <hr className="border-gray-300 my-2" />
//               </div>

//               {/* Label with structure for Contacts */}
//               <div className="mt-4">
//                 <strong>Contacts:</strong>
//                 <hr style={{ border: "1px solid black", margin: "10px 0" }} />
//               </div>

//               <table className="min-w-full bg-white border border-gray-200 mt-3">
//                 <thead>
//                   <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal text-center">
//                     <th className="py-2 px-4 text-left border-b border-gray-300">
//                       Name
//                     </th>
//                     <th className="py-2 px-4 text-left border-b border-gray-300">
//                       Department
//                     </th>
//                     <th className="py-2 px-4 text-left border-b border-gray-300">
//                       Designation
//                     </th>
//                     <th className="py-2 px-4 text-left border-b border-gray-300">
//                       Email
//                     </th>
//                     <th className="py-2 px-4 text-left border-b border-gray-300">
//                       Whatsapp No.
//                     </th>
//                     <th className="py-2 px-4 text-left border-b border-gray-300">
//                       Official Mobile
//                     </th>
//                     <th className="py-2 px-4 text-left border-b border-gray-300">
//                       Personal Mobile
//                     </th>
//                     <th className="py-2 px-4 text-left border-b border-gray-300">
//                       LinkedIn Profile
//                     </th>
//                     <th className="py-2 px-4 text-left border-b border-gray-300">
//                       Preferred Mode of Communication
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-gray-600 text-sm font-light">
//                   {selectedAddress.contacts.map((contact, index) => (
//                     <tr
//                       key={index}
//                       className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
//                     >
//                       <td className="py-3 px-6 text-left whitespace-normal border-r border-gray-200">
//                         {contact.contactPersonName}
//                       </td>
//                       <td className="py-3 px-6 text-left border-r border-gray-200 whitespace-normal">
//                         {contact.department}
//                       </td>
//                       <td className="py-3 px-6 text-left border-r border-gray-200 whitespace-normal">
//                         {contact.designation}
//                       </td>
//                       <td className="py-3 px-6 text-left border-r border-gray-200 whitespace-normal">
//                         <span
//                           className="cursor-pointer text-blue-500 hover:underline"
//                           onClick={() => window.open(`mailto:${contact.email}`)}
//                           aria-label={`Email ${contact.contactPersonName}`}
//                         >
//                           {contact.email}
//                         </span>
//                       </td>
//                       <td className="py-3 px-6 text-left border-r border-gray-200 whitespace-normal">
//                         <span
//                           className="cursor-pointer text-blue-500 hover:underline"
//                           onClick={() =>
//                             window.open(
//                               `https://wa.me/${contact.whatsappNumber}`
//                             )
//                           }
//                           aria-label={`Whatsapp ${contact.contactPersonName}`}
//                         >
//                           {contact.whatsappNumber}
//                         </span>
//                       </td>
//                       <td className="py-3 px-6 text-left border-r border-gray-200 whitespace-normal">
//                         {contact.officialMobile}
//                       </td>
//                       <td className="py-3 px-6 text-left border-r border-gray-200 whitespace-normal">
//                         {contact.personalMobile}
//                       </td>
//                       <td className="py-3 px-6 text-left border-r border-gray-200 whitespace-normal">
//                         <a
//                           href={contact.linkdinProfile}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-500 hover:underline"
//                           aria-label={`LinkedIn profile of ${contact.contactPersonName}`}
//                         >
//                           {contact.linkdinProfile}
//                         </a>
//                       </td>
//                       <td className="py-3 px-6 text-left border-r border-gray-200 whitespace-normal">
//                         {contact.preferredModeOfCommunication}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {currentTable === "company" && (
//         <div className={styles.tableContainer}>
//           <table className={styles.table} style={{ marginBottom: "20px" }}>
//             <thead>
//               <tr>
//                 <th>Sr. No.</th>
//                 <th>Name of Company</th>
//                 <th>Company Website</th>
//                 <th>Sector</th>
//                 <th>Company Email</th>
//                 <th>Company Telephone</th>
//                 <th>Contact Person</th>
//                 <th>Address</th>
//                 {role !== "Viewer" && <th>Update</th>}{" "}
//                 {role === "Admin" && <th>Delete</th>}{" "}
//               </tr>
//             </thead>
//             <tbody>
//               {getCurrentItems().map((company, companyIndex) => {
//                 const actualIndex =
//                   (currentPage - 1) * itemsPerPage + companyIndex + 1;
//                 return (
//                   <tr key={companyIndex}>
//                     <td>{actualIndex}</td>
//                     {/* <td>
//                       <span
//                         className="cursor-pointer text-blue-500 hover:text-blue-600 transition-colors duration-200"
//                         onClick={() =>
//                           searchByCompanyName(company.nameOfCompany)
//                         }
//                       >
//                         {company.nameOfCompany}
//                       </span>
//                     </td> */}
//                     <td>
//                       <span
//                         className="cursor-pointer text-blue-500 hover:text-blue-600 transition-colors duration-200"
//                         onClick={() => {
//                           searchBycompanyNumber(company.companyNumber);
//                           setIsPopupOpen(true); // Open the popup after fetching company details
//                         }}
//                       >
//                         {company.nameOfCompany}
//                       </span>
//                     </td>
//                     <td>
//                       <a
//                         href={`http://${company.companyWebsite}`}
//                         target="_blank"
//                         className="text-blue-500 hover:underline"
//                         rel="noopener noreferrer"
//                       >
//                         {company.companyWebsite}
//                       </a>
//                     </td>
//                     <td>{company.sector}</td>
//                     <td>{company.companyEmail}</td>
//                     <td>{company.companyTelephone}</td>
// <td>
//   {company.addresses.map((address, addressIndex) =>
//     address.contacts.map((contact, contactIndex) => (
//       <div
//         key={contactIndex}
//         className={`{
//     contactIndex !== address.contacts.length - 1 ||
//     addressIndex !== company.addresses.length - 1
//       ? "border-b-4 border-gray-400 mb-2 pb-2"
//       : ""
//   } `}
//         onClick={() => handleContactClick(contact)}
//       >
//         {contact.contactPersonName}
//       </div>
//     ))
//   )}
// </td>
// <td>
//   {company.addresses.map((addr, index) => (
//     <div
//       key={index}
//       className={`${
//         index !== company.addresses.length - 1
//           ? "border-b-4 border-gray-400 mb-2 pb-2"
//           : ""
//       } ${styles.addressLink}`}
//       onClick={() =>
//         handleAddressClick(index, companyIndex)
//       }
//     >
//       {addr.companyAddress}, {addr.city}, {addr.state}
//     </div>
//   ))}
// </td>
//                     {role !== "Viewer" && ( // Conditionally render Update cell
//                       <td>
//                         <button
//                           onClick={() => handleShowUpdate(actualIndex)}
//                           className={styles.updateButton}
//                         >
//                           Update
//                         </button>
//                       </td>
//                     )}
//                     {role === "Admin" && ( // Conditionally render Delete button only for Admin
//                       <td>
//                         <button
//                           onClick={() =>
//                             handleDeleteCompany(company.companyNumber)
//                           }
//                           className={styles.deleteButton}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     )}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {mailPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <div className="mb-4">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="subject"
//               >
//                 Subject
//               </label>
//               <input
//                 id="subject"
//                 type="text"
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 value={mailbody.subject}
//                 onChange={(e) =>
//                   setMailBody((prev) => ({
//                     ...prev,
//                     subject: e.target.value,
//                   }))
//                 }
//               />
//             </div>
//             <div className="mb-6">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="message-body"
//               >
//                 Message Body
//               </label>
//               <textarea
//                 id="message-body"
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 value={mailbody.body}
//                 onChange={(e) =>
//                   setMailBody((prev) => ({ ...prev, body: e.target.value }))
//                 }
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <button
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow"
//                 onClick={sendMail}
//               >
//                 Send
//               </button>
//               <button
//                 className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow"
//                 onClick={closeMailPopup}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isPopupOpen && <Preview />}
//     </div>
//   );
// }

// export default React.memo(StagePopup);
