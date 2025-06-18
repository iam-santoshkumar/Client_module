import React, { useContext, useState } from "react";
import FormComponenet from "../Form/formComponent.js";
import PopupContext from "../context/popupContext.js";
import { useToast } from "@chakra-ui/react";
import "./AddPopup.css"; // Adjust the path based on your folder structure

function AddPopup() {
  const toast = useToast();
  const { company, setCompanyEmpty } = useContext(PopupContext);
  const [loading, setLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleAddClick = () => {
    const missingFields = [];
    if (!company.nameOfCompany) missingFields.push("Name of Company");
    // if (!company.companyWebsite) missingFields.push("Company Website");
    if (!company.category) missingFields.push("Category");
    if (!company.isClientActive) missingFields.push("Client Active Status");

    if (missingFields.length > 0) {
      toast({
        title: `${missingFields.join(", ")} cannot be empty`,
        status: "error",
        position: "top",
        isClosable: true,
      });
      return;
    }

    if (isConfirmed) {
      confirmSubmission();
    } else {
      setIsPreview(true);
    }
  };

  const confirmSubmission = async () => {
    setLoading(true);

    try {
      const token = sessionStorage.getItem("token")
      const user = sessionStorage.getItem("user");
      const companyData = { ...company, addedBy: user || "" };
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/addform`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include your token here
        },
        body: JSON.stringify(companyData),
      });

      if (response.ok) {
        toast({
          title: "Data Saved Successfully",
          status: "success",
          position: "top",
          isClosable: true,
        });
        setCompanyEmpty();
      } else if (response.status === 500) {
        toast({
          title: "Company already exists",
          status: "error",
          position: "top",
          isClosable: true,
        });
      } else {
        throw new Error("An error occurred while submitting company data");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        position: "top",
        isClosable: true,
      });
      console.error("Error submitting company data:", error.message);
    } finally {
      setLoading(false);
      setIsPreview(false);
      setIsConfirmed(false);
    }
  };

  return (
    <>
      {isPreview ? (
        <div className="preview-container">
          <h2 className="preview-title">Preview</h2>
          <div className="preview-content">
            <p>
              <strong>Name of Company:</strong> {company.nameOfCompany || "N/A"}
            </p>
            <p>
              <strong>Company Website:</strong>{" "}
              {company.companyWebsite || "N/A"}
            </p>
            <p>
              <strong>Company category:</strong> {company.category || "N/A"}
            </p>
            <h3>Addresses</h3>
            {company.addresses.length > 0 ? (
              company.addresses.map((address, index) => (
                <div key={index}>
                  <p>
                    <strong>Address {index + 1}:</strong>{" "}
                    {`${address.companyAddress}, ${address.city}, ${address.state}, ${address.country}, ${address.pincode}`}
                  </p>
                  <p>
                    <strong>Office Telephone:</strong>{" "}
                    {address.officeTelephone || "N/A"}
                  </p>
                  <h4>Contacts</h4>
                  {address.contacts.length > 0 ? (
                    address.contacts.map((contact, contactIndex) => (
                      <div key={contactIndex}>
                        <p>
                          <strong>Contact Name:</strong>{" "}
                          {contact.contactPersonName || "N/A"}
                        </p>
                        <p>
                          <strong>Email:</strong> {contact.email || "N/A"}
                        </p>
                        <p>
                          <strong>Official Mobile:</strong>{" "}
                          {contact.officialMobile || "N/A"}
                        </p>

                        <h5>Meeting Logs</h5>
                        {contact.meetinglog.length > 0 ? (
                          contact.meetinglog.map((meeting, meetingIndex) => (
                            <div key={meetingIndex}>
                              <p>
                                <strong>Date:</strong> {meeting.date || "N/A"}
                              </p>
                              <p>
                                <strong>Place:</strong> {meeting.place || "N/A"}
                              </p>
                              <p>
                                <strong>Remarks:</strong>{" "}
                                {meeting.remarks || "N/A"}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p>No meeting logs available.</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No contacts available.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No addresses available.</p>
            )}

            <h3>Communication Protocols</h3>
            {company.manageCP.length > 0 ? (
              company.manageCP.map((protocol, index) => (
                <div key={index}>
                  <p>
                    <strong>Protocol {index + 1}:</strong>
                  </p>
                  <p>
                    <strong>Departments:</strong>{" "}
                    {protocol.departments || "N/A"}
                  </p>
                  <p>
                    <strong>To Emails:</strong> {protocol.toEmails || "N/A"}
                  </p>
                  <p>
                    <strong>CC Emails (RKD):</strong>{" "}
                    {protocol.ccEmailsRKD || "N/A"}
                  </p>
                  <p>
                    <strong>CC Emails (Clients):</strong>{" "}
                    {protocol.ccEmailsClients || "N/A"}
                  </p>
                  <p>
                    <strong>Note:</strong> {protocol.note || "N/A"}
                  </p>
                  <p>
                    <strong>Sub-Department:</strong> {protocol.note || "N/A"}
                  </p>
                  <hr />{" "}
                </div>
              ))
            ) : (
              <p>No communication protocols available.</p>
            )}

            <h3>Client Active Status</h3>
            <p>
              <strong>Status:</strong>{" "}
              {company.isClientActive ? "Active" : "Inactive"}
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="confirm-button"
              onClick={() => {
                setIsConfirmed(true);
                setIsPreview(false);
              }}
              disabled={loading}
              aria-label="Confirm company details"
            >
              {loading ? "Confirming..." : "Confirm"}
            </button>
            <button
              className="edit-button"
              onClick={() => setIsPreview(false)}
              aria-label="Edit company details"
            >
              Edit
            </button>
          </div>
        </div>
      ) : (
        <>
          <FormComponenet />
          <div className="flex justify-center mt-3 mb-12">
            <div className="saveButton">
              <button
                className="add-button"
                onClick={handleAddClick}
                disabled={loading}
              >
                {loading ? "Adding..." : isConfirmed ? "Submit Details" : "Add Details"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default React.memo(AddPopup);
