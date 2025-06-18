// import React, { useContext, useEffect, useState } from "react";
// import PopupContext from "../../../context/popupContext.js";
// import ContactContext from "../../../context/contactContext.js";
// import { countries } from "../../../utils/countries.js";
// import Select from "react-select";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionButton,
//   AccordionPanel,
//   AccordionIcon,
//   Box,
//   Input,
//   Button,
//   FormControl,
//   FormLabel,
//   Grid,useToast
// } from "@chakra-ui/react";
// function AddressDetails() {
//   const toast = useToast();
//   const {
//     company,
//     setCompany,
//     updateData,
//     contactPersonDetail,
//     setContactPersonDetails,
//     setCompanyEmpty,
//     addressDetails,
//     setAddressDetails,
//     mode,
//     setMode,
//     showAddressesArray,
//     setShowAddressesArray,
//     handleToolkit,
//     toolKitInfo,
//     setToolKitInfo,
//   } = useContext(PopupContext);

//   const addAddress = () => {
//     const missingFields = [];
//     if (!addressDetails.companyAddress) missingFields.push("Company Address");
//     if (!addressDetails.officeTelephone) missingFields.push("Office Telephone");
//     if (!addressDetails.typeOfBusiness) missingFields.push("Type of Business");
//     if (missingFields.length > 0) {
//       toast({
//         title: `${missingFields.join(",")} can not be empty`,
//         status: "error",
//         position: "top",
//         isClosable: true,
//       });
//     } else {
//       setCompany((prevCompany) => ({
//         ...prevCompany,
//         addresses: [...prevCompany.addresses, addressDetails],
//       }));
//       setAddressDetails({
//         companyAddress: "",
//         city: "",
//         state: "",
//         country: "",
//         pincode: "",
//         officeTelephone: "",
//         fieldOfActivity: "",
//         typeOfBusiness: "",
//         remarks: "",
//         contacts: [],
//       });
//       setShowAddressesArray(true);
//     }
//   };

//   const [selectedBusiness, setSelectedBusiness] = useState("");
  
//   const typeOfBusinessOptions = [
//     { value: "TM", label: "TM" },
//     { value: "Patent", label: "Patent" },
//     { value: "Copyright", label: "Copyright" },
//     { value: "Design", label: "Design" },
//     { value: "Litigation", label: "Litigation" },
//   ];

//   const handleTypeOfBusinessChange = (selectedOptions) => {
//     // Convert selected options to a comma-separated string
//     const typeOfBusinessString = selectedOptions
//       ? selectedOptions.map((opt) => opt.value).join(",")
//       : "";

//     setAddressDetails((prevDetails) => ({
//       ...prevDetails,
//       typeOfBusiness: typeOfBusinessString,
//     }));
//   };

//   return (
//     <>
//       {company.isClientActive === "Active" && (
//         <Accordion allowToggle>
//           <AccordionItem>
//             <h2>
//               <AccordionButton _expanded={{ bg: "tomato", color: "white" }}>
//                 <Box flex="1" textAlign="left" fontWeight="bold" fontSize="18px">
//                   Click here to add address
//                 </Box>
//                 <AccordionIcon />
//               </AccordionButton>
//             </h2>
//             <AccordionPanel pb={2} border={1}>
//               <Grid templateColumns="repeat(4, 1fr)" gap={2}>
//                 {/* Company Address */}
//                 <FormControl isRequired>
//                   <FormLabel fontWeight="bold">Company Address</FormLabel>
//                   <Input
//                     type="text"
//                     value={addressDetails.companyAddress}
//                     onChange={(e) =>
//                       updateData(e, (value) =>
//                         setAddressDetails((prevCompany) => ({
//                           ...prevCompany,
//                           companyAddress: value,
//                         }))
//                       )
//                     }
//                     placeholder="Company Address"
//                   />
//                 </FormControl>

//                 {/* Country */}
//                 <FormControl>
//                   <FormLabel fontWeight="bold">Country</FormLabel>
//                   <Input
//                     type="search"
//                     value={addressDetails.country}
//                     onChange={(e) =>
//                       updateData(e, (value) =>
//                         setAddressDetails((prevCompany) => ({
//                           ...prevCompany,
//                           country: value,
//                         }))
//                       )
//                     }
//                     list="countries"
//                     placeholder="Country"
//                   />
//                   <datalist id="countries">
//                     {countries.map((country) => (
//                       <option key={country.name} value={country.name} />
//                     ))}
//                   </datalist>
//                 </FormControl>

//                 {/* State */}
//                 <FormControl>
//                   <FormLabel fontWeight="bold">State</FormLabel>
//                   <Input
//                     type="search"
//                     value={addressDetails.state}
//                     onChange={(e) =>
//                       updateData(e, (value) =>
//                         setAddressDetails((prevCompany) => ({
//                           ...prevCompany,
//                           state: value,
//                         }))
//                       )
//                     }
//                     list="states"
//                     placeholder="State"
//                   />
//                   <datalist id="states">
//                     {addressDetails.country &&
//                       countries
//                         .find(
//                           (country) => country.name === addressDetails.country
//                         )
//                         ?.states.map((state) => (
//                           <option key={state} value={state} />
//                         ))}
//                   </datalist>
//                 </FormControl>

//                 {/* City */}
//                 <FormControl>
//                   <FormLabel fontWeight="bold">City</FormLabel>
//                   <Input
//                     type="text"
//                     value={addressDetails.city}
//                     onChange={(e) =>
//                       updateData(e, (value) =>
//                         setAddressDetails((prevCompany) => ({
//                           ...prevCompany,
//                           city: value,
//                         }))
//                       )
//                     }
//                     placeholder="City"
//                   />
//                 </FormControl>

//                 {/* Pincode */}
//                 <FormControl>
//                   <FormLabel fontWeight="bold">Pincode</FormLabel>
//                   <Input
//                     type="text"
//                     value={addressDetails.pincode}
//                     onChange={(e) =>
//                       updateData(e, (value) =>
//                         setAddressDetails((prevCompany) => ({
//                           ...prevCompany,
//                           pincode: value,
//                         }))
//                       )
//                     }
//                     placeholder="Pincode"
//                   />
//                 </FormControl>

//                 {/* Office Telephone */}
//                 <FormControl isRequired>
//                   <FormLabel fontWeight="bold">Office Telephone</FormLabel>
//                   <Input
//                     type="text"
//                     value={addressDetails.officeTelephone}
//                     onChange={(e) =>
//                       updateData(e, (value) =>
//                         setAddressDetails((prevCompany) => ({
//                           ...prevCompany,
//                           officeTelephone: value,
//                         }))
//                       )
//                     }
//                     placeholder="Office Telephone"
//                   />
//                 </FormControl>

//                 {/* Type of Business */}
//                 <FormControl isRequired>
//                   <FormLabel fontWeight="bold">Type of Business</FormLabel>
//                   <Select
//                     options={typeOfBusinessOptions}
//                     isMulti
//                     value={typeOfBusinessOptions.filter((opt) =>
//                       (addressDetails.typeOfBusiness || "")
//                         .split(",")
//                         .includes(opt.value)
//                     )}
//                     onChange={handleTypeOfBusinessChange}
//                     placeholder="Select Type of Business"
//                     closeMenuOnSelect={false}
//                     isClearable
//                   />
//                 </FormControl>

//                 {/* Remarks */}
//                 <FormControl>
//                   <FormLabel fontWeight="bold">Remarks</FormLabel>
//                   <Input
//                     type="text"
//                     value={addressDetails.remarks}
//                     onChange={(e) =>
//                       updateData(e, (value) =>
//                         setAddressDetails((prevCompany) => ({
//                           ...prevCompany,
//                           remarks: value,
//                         }))
//                       )
//                     }
//                     placeholder="Remarks"
//                   />
//                 </FormControl>
//               </Grid>

//               {/* {toolKitInfo.name === "Add Address" && (
//             <Box
//               style={toolKitInfo.style}
//               // className="bg-gray-800 text-white p-2 border border-gray-600 rounded-md shadow-lg absolute z-10"
//             >
//               {toolKitInfo.name}
//             </Box>
//           )} */}

//               <Box  display="flex" justifyContent="flex-end">
//                 <Button
//                   aria-label="Add Address"
//                   data-name="Add Address"
//                   // onMouseOver={(e) => handleToolkit(e, true)}
//                   // onMouseOut={(e) => handleToolkit(e, false)}
//                   size="md"
//                   variant="solid"
//                   bg="tomato"
//                   color="white"
//                   onClick={addAddress}
//                   _hover={{ transform: "scale(1.01)" }}
//                 >
//                   Add Address
//                 </Button>
//               </Box>
//             </AccordionPanel>
//           </AccordionItem>
//         </Accordion>
//       )}
//     </>
//   );
// }
// export default AddressDetails;


import React, { useContext, useEffect, useState } from "react";
import PopupContext from "../../../context/popupContext.js";
import ContactContext from "../../../context/contactContext.js";
import { countries } from "../../../utils/countries.js";
import Select from "react-select";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Grid,useToast
} from "@chakra-ui/react";

function AddressDetails() {
  const toast = useToast();
  const {
    company,
    setCompany,
    updateData,
    contactPersonDetail,
    setContactPersonDetails,
    setCompanyEmpty,
    mode,
    setMode,
    showAddressesArray,
    setShowAddressesArray,
    handleToolkit,
    toolKitInfo,
    setToolKitInfo,
  } = useContext(PopupContext);

  // Use local state for new address form
  const [newAddressDetails, setNewAddressDetails] = useState({
    companyAddress: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    officeTelephone: "",
    fieldOfActivity: "",
    typeOfBusiness: "",
    remarks: "",
    contacts: [],
  });

  const addAddress = () => {
    const missingFields = [];
    if (!newAddressDetails.companyAddress) missingFields.push("Company Address");
    if (!newAddressDetails.officeTelephone) missingFields.push("Office Telephone");
    if (!newAddressDetails.typeOfBusiness) missingFields.push("Type of Business");
    if (missingFields.length > 0) {
      toast({
        title: `${missingFields.join(",")} can not be empty`,
        status: "error",
        position: "top",
        isClosable: true,
      });
    } else {
      setCompany((prevCompany) => ({
        ...prevCompany,
        addresses: [...prevCompany.addresses, newAddressDetails],
      }));
      setNewAddressDetails({
        companyAddress: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        officeTelephone: "",
        fieldOfActivity: "",
        typeOfBusiness: "",
        remarks: "",
        contacts: [],
      });
      setShowAddressesArray(true);
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

    setNewAddressDetails((prevDetails) => ({
      ...prevDetails,
      typeOfBusiness: typeOfBusinessString,
    }));
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setNewAddressDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      {company.isClientActive === "Active" && (
        <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton _expanded={{ bg: "tomato", color: "white" }}>
                <Box flex="1" textAlign="left" fontWeight="bold" fontSize="18px">
                  Click here to add address
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={2} border={1}>
              <Grid templateColumns="repeat(4, 1fr)" gap={2}>
                {/* Company Address */}
                <FormControl isRequired>
                  <FormLabel fontWeight="bold">Company Address</FormLabel>
                  <Input
                    type="text"
                    value={newAddressDetails.companyAddress}
                    onChange={(e) => handleInputChange(e, 'companyAddress')}
                    placeholder="Company Address"
                  />
                </FormControl>

                {/* Country */}
                <FormControl>
                  <FormLabel fontWeight="bold">Country</FormLabel>
                  <Input
                    type="search"
                    value={newAddressDetails.country}
                    onChange={(e) => handleInputChange(e, 'country')}
                    list="countries"
                    placeholder="Country"
                  />
                  <datalist id="countries">
                    {countries.map((country) => (
                      <option key={country.name} value={country.name} />
                    ))}
                  </datalist>
                </FormControl>

                {/* State */}
                <FormControl>
                  <FormLabel fontWeight="bold">State</FormLabel>
                  <Input
                    type="search"
                    value={newAddressDetails.state}
                    onChange={(e) => handleInputChange(e, 'state')}
                    list="states"
                    placeholder="State"
                  />
                  <datalist id="states">
                    {newAddressDetails.country &&
                      countries
                        .find(
                          (country) => country.name === newAddressDetails.country
                        )
                        ?.states.map((state) => (
                          <option key={state} value={state} />
                        ))}
                  </datalist>
                </FormControl>

                {/* City */}
                <FormControl>
                  <FormLabel fontWeight="bold">City</FormLabel>
                  <Input
                    type="text"
                    value={newAddressDetails.city}
                    onChange={(e) => handleInputChange(e, 'city')}
                    placeholder="City"
                  />
                </FormControl>

                {/* Pincode */}
                <FormControl>
                  <FormLabel fontWeight="bold">Pincode</FormLabel>
                  <Input
                    type="text"
                    value={newAddressDetails.pincode}
                    onChange={(e) => handleInputChange(e, 'pincode')}
                    placeholder="Pincode"
                  />
                </FormControl>

                {/* Office Telephone */}
                <FormControl isRequired>
                  <FormLabel fontWeight="bold">Office Telephone</FormLabel>
                  <Input
                    type="text"
                    value={newAddressDetails.officeTelephone}
                    onChange={(e) => handleInputChange(e, 'officeTelephone')}
                    placeholder="Office Telephone"
                  />
                </FormControl>

                {/* Type of Business */}
                <FormControl isRequired>
                  <FormLabel fontWeight="bold">Type of Business</FormLabel>
                  <Select
                    options={typeOfBusinessOptions}
                    isMulti
                    value={typeOfBusinessOptions.filter((opt) =>
                      (newAddressDetails.typeOfBusiness || "")
                        .split(",")
                        .includes(opt.value)
                    )}
                    onChange={handleTypeOfBusinessChange}
                    placeholder="Select Type of Business"
                    closeMenuOnSelect={false}
                  />
                </FormControl>

                {/* Remarks */}
                <FormControl>
                  <FormLabel fontWeight="bold">Remarks</FormLabel>
                  <Input
                    type="text"
                    value={newAddressDetails.remarks}
                    onChange={(e) => handleInputChange(e, 'remarks')}
                    placeholder="Remarks"
                  />
                </FormControl>
              </Grid>

              <Box mt={4} display="flex" justifyContent="flex-end">
                <Button bg="tomato"  color="white" onClick={addAddress}>
                  Add Address
                </Button>
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}
    </>
  );
}
export default AddressDetails;
