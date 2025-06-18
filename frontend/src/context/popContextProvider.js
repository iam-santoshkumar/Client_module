import { useState, useEffect, useMemo } from "react";
import PopupContext from "./popupContext";
import { useToast } from "@chakra-ui/react";

function PopupContextProvider({ children }) {
  const toast = useToast();
  const [isPreview, setIsPreview] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [lastVisitedPage, setLastVisitedPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const user = sessionStorage.getItem("user");

  const closePopup = () => {
    setIsPopupOpen(false);
    setCompany(null); // Optional: clear company data
  };

  const [company, setCompany] = useState({
    nameOfCompany: "",
    addresses: [],
    companyWebsite: "",
    linkdinProfile: "",
    // category: "",
    isClientActive: "",
    toWhom: "",
    date: "",
    reason: "",
    remark: "",
    //frontdeskAddress: "",
    // tallyAddress: "",
    sector: "",
    subsector: "",
    companyEmail: "",
    companyTelephone: "",
    addedBy: user || "",
    updatedBy: user || "",
    manageCP: [],
    departments: [], // Array of selected departments
    // sub_departments: [],
  });

  const setCompanyEmpty = () => {
    setCompany({
      nameOfCompany: "",
      addresses: [],
      companyWebsite: "",
      linkdinProfile: "",

      isClientActive: "",
      toWhom: "",
      date: "",
      reason: "",
      remark: "",
      //frontdeskAddress: "",
      //tallyAddress: "",
      sector: "",
      subsector: "",
      companyEmail: "",
      companyTelephone: "",
      addedBy: user || "",
      updatedBy: user || "",
      manageCP: [],
    });
  };

  const [communicationProtocols, setCommunicationProtocols] = useState({
    departments: "",
    subdepart: "",
    toEmails: "",
    ccEmailsRKD: "",
    ccEmailsClients: "",
    note: "",
  });

  const [addressDetails, setAddressDetails] = useState({
    companyAddress: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    officeTelephone: "",
    fieldOfActivity: "",
    remarks: "",
    typeOfBusiness: "",
    contacts: [],
  });

  const [contactPersonDetail, setContactPersonDetails] = useState({
    salutation: "",
    contactPersonName: "",
    designation: "",
    email: "",
    whatsappNumber_code: "",
    whatsappNumber: "",
    officialMobile_code: "",
    officialMobile: "",
    personalMobile_code: "",
    personalMobile: "",
    linkdinProfile: "",
    remarks: "",
    preferredModeOfCommunication: "",
    meetinglog: [],
    departments: [],
  });
  const [newSubDepartment, setNewSubDepartment] = useState("");

  const [departments, setDepartments] = useState({
    department_name: "",
    sub_department_name: "",
  });

  const [meetingLog, setMeetingLog] = useState({
    date: "",
    place: "",
    conference: "",
    remarks: "",
  });
  //console.log("Current Contact Person Detail:", contactPersonDetail);
  // const handleUpdateCompany = () => {
  //   setCompany((prev) => ({
  //     ...prev,
  //     updatedBy: user || "", // Set updatedBy with user from sessionStorage
  //   }));
  //   // Perform further update logic here if needed
  // };


  const handleUpdateCompany = () => {
    if (!company.nameOfCompany.trim()) {
      toast({
        title: "Error",
        description: "Name of Client cannot be empty.",
        status: "error",
        position: "top",
        isClosable: true,
      });
      return; // Exit the function if the field is empty
    }

    setCompany((prev) => ({
      ...prev,
      updatedBy: user || "", // Set updatedBy with user from sessionStorage
    }));

  };
  
  // Add `handleAddCompany` to use addedBy from sessionStorage when creating a new entry
  const handleAddCompany = () => {
    setCompany((prev) => ({
      ...prev,
      addedBy: user || "",
    }));
    // Additional logic to add company can go here
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [showTransferDetails, setShowTransferDetails] = useState(false);
  const [mailbody, setMailBody] = useState({ to: "", subject: "", body: "" });
  const [currentAddressIndex, setCurrentAddressIndex] = useState(null);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showStage, setShowStage] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const [updatePopup, setUpdatePopup] = useState(false);
  const [allCompanies, setAllCompanies] = useState([]);
  const [showAddressesArray, setShowAddressesArray] = useState(false);
  const [toolKitInfo, setToolKitInfo] = useState({});
  const [mailPopup, setMailPopup] = useState(false);
  const [sector, setSector] = useState("");
  const [subsector, setSubsector] = useState("");

  const handleToolkit = (e, show) => {
    const rect = e.target.getBoundingClientRect();
    setToolKitInfo(
      show
        ? {
            name: e.target.getAttribute("data-name"),
            style: {
              position: "absolute",
              top: rect.top - 45 + window.scrollY,
              left: rect.left + window.scrollX,
            },
          }
        : { name: "", style: {} }
    );
  };

  const showAdd = () => {
    setCompanyEmpty();
    setShowStage(false);
    setUpdatePopup(false);
    setAddPopup(true);
  };

  const handleStage = () => {
    setAddPopup(false);
    setShowStage(true);
    setUpdatePopup(false);
  };

  const handleSearchButton = () => {
    setCompanyEmpty();
    setUpdatePopup(false);
    setShowStage(false);
    setAddPopup(false);
  };

  const updateData = (e, setter) => {
    const value = e.target.value;
    setter(value);
  };

  const handleTotalSearchForPage = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/getallforms`)
      .then((response) => {
        if (!response.ok) throw new Error("Network Error");
        return response.json();
      })
      .then((data) => {
        setCompanies(data.data);
        setShowStage(true);
        setAddPopup(false);
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  const sendMail = async () => {
    const missingFields = [];
    if (!mailbody.to) missingFields.push("To");
    if (!mailbody.body) missingFields.push("Body");
    if (!mailbody.subject) missingFields.push("Mail Body");

    if (missingFields.length > 0) {
      toast({
        title: `${missingFields.join(", ")} cannot be empty`,
        status: "error",
        position: "top",
        isClosable: true,
      });
    } else {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/send-mail`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mailbody),
          }
        );

        const responseData = await response.json();
        if (response.status === 200) {
          toast({
            title: responseData.message,
            status: "success",
            position: "top",
            isClosable: true,
          });
          setCompanyEmpty();
        } else {
          throw new Error(
            responseData.error || "An error occurred while sending mail"
          );
        }
      } catch (error) {
        console.error("Error sending mail:", error.message);
      }
    }
  };

  const openMailPopup = (To) => {
    setMailPopup(!mailPopup);
    setMailBody((prev) => ({ ...prev, to: To }));
  };

  const closeMailPopup = () => {
    setMailPopup(!mailPopup);
    setMailBody({ to: "", subject: "", body: "" });
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/onlycompany`)
      .then((response) => response.json())
      .then((data) => setAllCompanies(data.data))
      .catch((error) => console.log(error));
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const companyData = [
        company.nameOfCompany,
        company.companyWebsite,
        company.companyTelephone,
        //company.category,
        company.companyEmail,
        company.sector,

        company.addresses.map((address) => address.companyAddress).join(" "),
        company.addresses
          .map((address) =>
            address.contacts
              .map((contact) => contact.contactPersonName)
              .join(" ")
          )
          .join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return companyData.includes(searchQuery.toLowerCase());
    });
  }, [companies, searchQuery]);

  return (
    <PopupContext.Provider
      value={{
        company,
        setCompany,
        showStage,
        setShowStage,
        addPopup,
        setAddPopup,
        updatePopup,
        setUpdatePopup,
        showAdd,
        handleSearchButton,
        updateData,
        contactPersonDetail,
        setContactPersonDetails,
        setCompanyEmpty,
        addressDetails,
        setAddressDetails,
        handleTotalSearchForPage,
        companies,
        setCompanies,
        showUpdate,
        setShowUpdate,
        currentAddressIndex,
        setCurrentAddressIndex,
        showAddressPopup,
        setShowAddressPopup,
        showAddressesArray,
        setShowAddressesArray,
        handleStage,
        handleToolkit,
        toolKitInfo,
        setToolKitInfo,
        mailPopup,
        setMailPopup,
        openMailPopup,
        mailbody,
        setMailBody,
        sendMail,
        closeMailPopup,
        showTransferDetails,
        setShowTransferDetails,
        meetingLog,
        setMeetingLog,
        allCompanies,
        setAllCompanies,
        searchQuery,
        setSearchQuery,
        filteredCompanies,
        communicationProtocols,
        setCommunicationProtocols,
        isPreview,
        setIsPreview,
        isPopupOpen,
        setIsPopupOpen,
        closePopup,
        lastVisitedPage,
        setLastVisitedPage,
        currentPage,
        setCurrentPage,
        newSubDepartment,
        setNewSubDepartment,
        departments,
        setDepartments,
        handleAddCompany, // Add this to use in components where you add a company
        handleUpdateCompany,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
}

export default PopupContextProvider;
