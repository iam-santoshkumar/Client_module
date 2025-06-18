import React, { useContext } from "react";
import PopupContext from "../context/popupContext.js";
import FormComponenet from "../Form/formComponent.js";
import { useToast } from "@chakra-ui/react";

function UpdatePopup() {
  const toast = useToast();
  const { company, setCompanyEmpty, setShowUpdate, setShowStage } =
    useContext(PopupContext);

  const updateCompany = async () => {
    console.log("Preparing to send company data:", company); // Log the current state of company
   // Log the current state of company
    if (!company.nameOfCompany?.trim()) {
      toast({
        title: "Validation Error",
        description: "Name of Client cannot be empty.",
        status: "error",
        position: "top",
        isClosable: true,
      });
      return; // Stop the update process if validation fails
    }

    // Filter out deleted contacts
    const filteredContacts = company.addresses.map((address) => ({
      ...address,
      contacts: address.contacts.filter((contact) => !contact.deleted), // Exclude deleted contacts
    }));

    const user = sessionStorage.getItem("user");
    const updatedCompany = {
      ...company,
      addresses: filteredContacts,
      updatedBy: user || "", // Ensure updatedBy is set to the current user
    };

    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/updateform`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedCompany), // Use the updated company object
        }
      );

      const responseData = await response.json();
      console.log("API Response:", responseData); // Log the API response

      if (response.ok) {
        // Show success toast
        toast({
          title: "Client details updated successfully...",
          status: "success",
          position: "top",
          isClosable: true,
        });

        // Optionally reset company state or close the popup
        setCompanyEmpty(); // Call this if you want to clear the company state
        setShowUpdate(false); // Close the update popup
        setShowStage(true);
      } else {
        // Handle error response
        toast({
          title: "Failed to update client details.",
          description: responseData.message || "Please try again later.",
          status: "error",
          position: "top",
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error submitting company data:", error.message);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        position: "top",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <FormComponenet />
      <div className="flex justify-center mt-5 mb-12">
        <div className="updateButton">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={updateCompany}
          >
            Update Details
          </button>
        </div>
      </div>
    </>
  );
}

export default React.memo(UpdatePopup);
