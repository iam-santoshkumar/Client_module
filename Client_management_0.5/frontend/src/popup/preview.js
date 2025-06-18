// import React, { useContext, useState } from "react";
// import PopupContext from "../context/popupContext";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Input,
//   Textarea,
//   Box,
//   Text,
//   Heading,
//   useToast,
// } from "@chakra-ui/react";
// import { Document, Packer, Paragraph, TextRun } from "docx";
// import "./preview.css";

// function Preview() {
//   const toast = useToast();
//   const { company, closePopup } = useContext(PopupContext);

//   const [isMailModalOpen, setIsMailModalOpen] = useState(false);
//   const [selectedProtocol, setSelectedProtocol] = useState({});
//   const [subject, setSubject] = useState("");
//   const [body, setBody] = useState("");

//   const handleSendMailClick = (protocol) => {
//     setSelectedProtocol(protocol);
//     setIsMailModalOpen(true);
//   };

//   const handleSendMail = () => {
//     const userEmail = sessionStorage.getItem("userEmail"); // Get the logged-in user's email

//     fetch("/api/send-mail", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         from: userEmail, // Use the logged-in user's email as the sender
//         to: selectedProtocol.toEmails,
//         cc: selectedProtocol.ccEmailsRKD,
//         subject,
//         body,
//       }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to send email");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data.message);
//         toast({
//           title: "Mail Sent Successfully!",
//           status: "success",
//           position: "top",
//           isClosable: true,
//         });
//         setIsMailModalOpen(false);
//       })
//       .catch((error) => {
//         console.error(error);
//         toast({
//           title: "An unexpected error occurred",
//           description: error.message,
//           status: "error",
//           position: "top",
//           isClosable: true,
//         });
//       });
//   };

//   const [hover, setHover] = useState(false);

//   const printContactDetails = (contact, address) => {
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Print Contact</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             h1 { font-size: 24px; }
//             p { font-size: 18px; }
//           </style>
//         </head>
//         <body>
//           <h1>${contact.contactPersonName}</h1>
//           <p><strong>Company Name:</strong> ${
//             company.nameOfCompany || "N/A"
//           }</p>
//           <p><strong>Address:</strong> ${address.companyAddress || "N/A"}</p>
//           <p><strong>City:</strong> ${address.city || "N/A"}</p>
//           <p><strong>State:</strong> ${address.state || "N/A"}</p>
//           <p><strong>Country:</strong> ${address.country || "N/A"}</p>
//           <p><strong>Pincode:</strong> ${address.pincode || "N/A"}</p>
//           <p><strong>Mobile:</strong> ${contact.personalMobile || "N/A"}</p>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();
//   };

//   const downloadContactDetails = (contact, address) => {
//     const doc = new Document({
//       sections: [
//         {
//           properties: {},
//           children: [
//             new Paragraph({
//               text: `Contact Name: ${contact.contactPersonName || "N/A"}`,
//               heading: "Heading1",
//             }),
//             new Paragraph({
//               text: `Company Name: ${company?.nameOfCompany || "N/A"}`,
//             }),
//             new Paragraph({
//               text: `Address: ${address.companyAddress || "N/A"}`,
//             }),
//             new Paragraph({
//               text: `City: ${address.city || "N/A"}`,
//             }),
//             new Paragraph({
//               text: `State: ${address.state || "N/A"}`,
//             }),
//             new Paragraph({
//               text: `Country: ${address.country || "N/A"}`,
//             }),
//             new Paragraph({
//               text: `Pincode: ${address.pincode || "N/A"}`,
//             }),
//             new Paragraph({
//               text: `Mobile: ${contact.personalMobile || "N/A"}`,
//             }),
//           ],
//         },
//       ],
//     });

//     Packer.toBlob(doc).then((blob) => {
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `${contact.contactPersonName}_details.docx`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       toast({
//         title: "Document downloaded!",
//         description: `${contact.contactPersonName}'s details have been downloaded.`,
//         status: "success",
//         position: "top",
//         isClosable: true,
//       });
//     });
//   };
//   if (!company) {
//     return <Text>Loading company data...</Text>;
//   }

//   return (
//     <Box className="preview-overlay" p={4}>
//       <Box
//         className="preview-container"
//         borderWidth={1}
//         borderRadius="md"
//         boxShadow="md"
//       >
//         <Box position="relative" padding="10px 40px" textAlign="center">
//           <Heading size="lg" color="#2e7b92" marginBottom={4}>
//             {company.nameOfCompany || "Company Preview"}
//           </Heading>
//           <span
//             aria-label="Close"
//             role="button"
//             className="close cursor-pointer absolute top-2 right-2 text-red-500 font-bold text-5xl mr-4 mb-4"
//             style={{
//               transition: "all 0.3s ease",
//               transform: hover ? "scale(1.1)" : "scale(1)",
//             }}
//             onMouseEnter={() => setHover(true)}
//             onMouseLeave={() => setHover(false)}
//             onClick={closePopup}
//           >
//             &times;
//           </span>
//         </Box>

//         <Box className="preview-content" padding={4}>
//           <Text>
//             <strong>Name of Company:</strong> {company.nameOfCompany || "N/A"}
//           </Text>
//           <Text>
//             <strong>Company Website:</strong> {company.companyWebsite || "N/A"}
//           </Text>
//           <Text>
//             <strong>Company Category:</strong> {company.category || "N/A"}
//           </Text>
//           <Box borderBottom="1px" my={4} />

//           <Text fontSize="xl" fontWeight="bold">
//             Addresses:
//           </Text>
//           {Array.isArray(company.addresses) && company.addresses.length > 0 ? (
//             company.addresses.map((address, index) => (
//               <Box key={index} my={4}>
//                 <Box borderBottom="1px" my={2} />
//                 <Text>
//                   <strong style={{ color: "blue" }}>
//                     Address {index + 1}:
//                   </strong>{" "}
//                   <span style={{ color: "green" }}>
//                     {address.companyAddress || "N/A"}
//                   </span>
//                 </Text>
//                 <Text fontWeight="bold" textDecoration="underline">
//                   Contacts:
//                 </Text>
//                 {Array.isArray(address.contacts) &&
//                 address.contacts.length > 0 ? (
//                   address.contacts.map((contact, contactIndex) => (
//                     <Box key={contactIndex}>
//                       <Text>
//                         <strong style={{ color: "green" }}>
//                           Contact {contactIndex + 1}:
//                         </strong>
//                       </Text>
//                       <Text>
//                         <strong>Contact Name:</strong>{" "}
//                         {contact.contactPersonName || "N/A"}
//                       </Text>
//                       <Text>
//                         <strong>Email:</strong> {contact.email || "N/A"}
//                       </Text>
//                       <Text>
//                         <strong>Official Mobile:</strong>{" "}
//                         {contact.officialMobile || "N/A"}
//                       </Text>
//                       <Text>
//                         <strong>Personal Mobile:</strong>{" "}
//                         {contact.personalMobile || "N/A"}
//                       </Text>
//                       <Button
//                         onClick={() => printContactDetails(contact, address)}
//                         colorScheme="teal"
//                         mt={2}
//                       >
//                         Print Address
//                       </Button>
//                       <Button
//                         onClick={() => downloadContactDetails(contact, address)}
//                         colorScheme="blue"
//                         mt={2}
//                         ml={2}
//                       >
//                         Download Address
//                       </Button>
//                     </Box>
//                   ))
//                 ) : (
//                   <Text>No contacts available.</Text>
//                 )}
//               </Box>
//             ))
//           ) : (
//             <Text>No addresses available.</Text>
//           )}
//           <Box borderBottom="1px" my={4} />
//           <Text fontSize="xl" fontWeight="bold">
//             Communication Protocols:
//           </Text>

//           {Array.isArray(company.manageCP) && company.manageCP.length > 0 ? (
//             company.manageCP.map((protocol, index) => (
//               <Box key={index} my={4}>
//                 <Box borderBottom="1px" my={2} />
//                 <Text>
//                   <strong style={{ color: "blue" }}>
//                     Protocol {index + 1}:
//                   </strong>
//                 </Text>
//                 <Text>
//                   <strong>Department:</strong> {protocol.departments || "N/A"}
//                 </Text>
//                 <Text>
//                   <strong>Sub-Department:</strong> {protocol.subdepart || "N/A"}
//                 </Text>
//                 <Text>
//                   <strong>To:</strong> {protocol.toEmails || "N/A"}
//                 </Text>
//                 <Text>
//                   <strong>CC(RKD):</strong> {protocol.ccEmailsRKD || "N/A"}
//                 </Text>
//                 <Text>
//                   <strong>CC(Client):</strong>{" "}
//                   {protocol.ccEmailsClients || "N/A"}
//                 </Text>
//                 <Text>
//                   <strong>Note:</strong> {protocol.note || "N/A"}
//                 </Text>
//                 <Button
//                   onClick={() => handleSendMailClick(protocol)}
//                   colorScheme="blue"
//                   mt={2}
//                 >
//                   Send Mail
//                 </Button>
//               </Box>
//             ))
//           ) : (
//             <Text>No communication protocols available.</Text>
//           )}
//           <Box borderBottom="1px" my={4} />
//           <Text fontSize="xl" fontWeight="bold">
//             Client Active Status
//           </Text>
//           <Box borderBottom="1px" my={4} />
//           <Text>
//             <strong>Status:</strong>{" "}
//             {company.isClientActive ? "Active" : "Inactive"}
//           </Text>
//         </Box>

//         {/* Send Mail Modal */}
//         <Modal
//           isOpen={isMailModalOpen}
//           onClose={() => setIsMailModalOpen(false)}
//         >
//           <ModalOverlay />
//           <ModalContent>
//             <ModalHeader>
//               <Text
//                 color="blue.600"
//                 fontSize="xl"
//                 fontWeight="bold"
//                 textAlign="center"
//               >
//                 Compose Mail
//               </Text>
//               <Box height="2px" width="100%" backgroundColor="blue.600" />
//             </ModalHeader>
//             <ModalBody>
//               <Text fontWeight="bold">To: {selectedProtocol.toEmails}</Text>
//               <Text fontWeight="bold">
//                 CC(RKD): {selectedProtocol.ccEmailsRKD}
//               </Text>
//               <Text fontWeight="bold">
//                 CC(Client): {selectedProtocol.ccEmailsClients}
//               </Text>
//               <Input
//                 placeholder="Subject"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 mt={4}
//               />
//               <Textarea
//                 placeholder="Body"
//                 value={body}
//                 onChange={(e) => setBody(e.target.value)}
//                 mt={2}
//                 rows={6}
//               />
//             </ModalBody>
//             <ModalFooter>
//               <Button onClick={handleSendMail} colorScheme="teal" mr={3}>
//                 Send Mail
//               </Button>
//               <Button onClick={() => setIsMailModalOpen(false)}>Close</Button>
//             </ModalFooter>
//           </ModalContent>
//         </Modal>
//       </Box>
//     </Box>
//   );
// }

// export default Preview;

import { useContext, useState } from "react";
import PopupContext from "../context/popupContext";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Box,
  Text,
  Heading,
  useToast,
} from "@chakra-ui/react";
import "./preview.css";

function Preview() {
  const toast = useToast();
  const { company, closePopup } = useContext(PopupContext);

  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState({});
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSendMailClick = (protocol) => {
    setSelectedProtocol(protocol);
    setIsMailModalOpen(true);
  };

  const handleSendMail = () => {
    const userEmail = sessionStorage.getItem("userEmail"); // Get the logged-in user's email

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/send-mail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: userEmail, // Use the logged-in user's email as the sender
        to: selectedProtocol.toEmails,
        cc: selectedProtocol.ccEmailsRKD,
        subject,
        body,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send email");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
        toast({
          title: "Mail Sent Successfully!",
          status: "success",
          position: "top",
          isClosable: true,
        });
        setIsMailModalOpen(false);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "An unexpected error occurred",
          description: error.message,
          status: "error",
          position: "top",
          isClosable: true,
        });
      });
  };

  const handleCopyAddress = async (company, address) => {
    let addressText = "";
    if (Array.isArray(address.contacts) && address.contacts.length > 0) {
      address.contacts.forEach((contact) => {
        addressText += `${contact.contactPersonName || "N/A"},<br>`;
        addressText += `Address: ${company.nameOfCompany || "N/A"},
               ${address.companyAddress || "N/A"}, 
               ${address.city}, ${address.state}, ${address.country},
               ${address.pincode},<br>`;
        addressText += `               Office Number: ${
          address.officeTelephone || "N/A"
        },<br>`;
        addressText += `               Contact Mobile: ${
          contact.officialMobile || "N/A"
        }<br>`;
        addressText += `___________________________________________________________________________<br>`;
      });
    } else {
      addressText = `Address: ${
        address.companyAddress || "N/A"
      }<br>No contacts available.<br>`;
    }

    const htmlContent = `
      <div style="font-family: 'Times New Roman', serif; font-size: 30px;">
        ${addressText}
      </div>
    `;

    try {
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([htmlContent], { type: "text/html" }),
            "text/plain": new Blob([addressText], { type: "text/plain" }),
          }),
        ]);

        toast({
          title: "Address copied to clipboard in Times New Roman!",
          status: "success",
          position: "top",
          isClosable: true,
        });
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = addressText.replace(/<br>/g, "\n");
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        toast({
          title: "Address copied to clipboard!",
          status: "success",
          position: "top",
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Unable to copy", err);
      toast({
        title: "Failed to copy address",
        description: err.message,
        status: "error",
        position: "top",
        isClosable: true,
      });
    }
  };

  const [hover, setHover] = useState(false);

  if (!company) {
    return <Text>Loading company data...</Text>;
  }

  return (
    <Box className="preview-overlay" p={4}>
      <Box
        className="preview-container"
        borderWidth={1}
        borderRadius="md"
        boxShadow="md"
      >
        <Box position="relative" padding="10px 40px" textAlign="center">
          <Heading size="lg" color="#2e7b92" marginBottom={4}>
            {company.nameOfCompany || "Company Preview"}
          </Heading>
          <span
            aria-label="Close"
            role="button"
            className="close cursor-pointer absolute top-2 right-2 text-red-500 font-bold text-5xl mr-4 mb-4"
            style={{
              transition: "all 0.3s ease",
              transform: hover ? "scale(1.1)" : "scale(1)",
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={closePopup}
          >
            &times;
          </span>
        </Box>

        <Box className="preview-content" padding={4}>
          <Text>
            <strong>Name of Company:</strong> {company.nameOfCompany || "N/A"}
          </Text>
          <Text>
            <strong>Company Website:</strong>{" "}
            <a
              href={`http://${company.companyWebsite}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {company.companyWebsite || "N/A"}
            </a>
          </Text>
          <Text>
            <strong>Company Category:</strong> {company.category || "N/A"}
          </Text>
          <Box borderBottom="1px" my={4} />

          <Text fontSize="xl" fontWeight="bold">
            Addresses:
          </Text>
          {Array.isArray(company.addresses) && company.addresses.length > 0 ? (
            company.addresses.map((address, index) => (
              <Box key={index} my={4}>
                <Box borderBottom="1px" my={2} />
                <Text>
                  <strong style={{ color: "blue" }}>
                    Address {index + 1}:
                  </strong>{" "}
                  <span style={{ color: "green" }}>
                    {address.companyAddress || "N/A"}, {address.city},{" "}
                    {address.state}, {address.country}, {address.pincode}
                  </span>
                </Text>
                <Button
                  onClick={() => handleCopyAddress(company, address)}
                  colorScheme="teal"
                  size="sm"
                  mt={2}
                >
                  Copy Address to Clipboard
                </Button>
                <Text fontWeight="bold" textDecoration="underline" mt={4}>
                  Contacts:
                </Text>
                {Array.isArray(address.contacts) &&
                address.contacts.length > 0 ? (
                  address.contacts.map((contact, contactIndex) => (
                    <Box key={contactIndex}>
                      <Text>
                        <strong style={{ color: "green" }}>
                          Contact {contactIndex + 1}:
                        </strong>
                      </Text>
                      <Text>
                        <strong>Contact Name:</strong>{" "}
                        {contact.contactPersonName || "N/A"}
                      </Text>
                      <Text>
                        <strong>Email:</strong> {contact.email || "N/A"}
                      </Text>
                      <Text>
                        <strong>Official Mobile:</strong>{" "}
                        {contact.officialMobile || "N/A"}
                      </Text>
                      <Box borderBottom="1px" my={2} />
                    </Box>
                  ))
                ) : (
                  <Text>No contacts available.</Text>
                )}
              </Box>
            ))
          ) : (
            <Text>No addresses available.</Text>
          )}
          <Box borderBottom="1px" my={4} />
          <Text fontSize="xl" fontWeight="bold">
            Communication Protocols:
          </Text>

          {Array.isArray(company.manageCP) && company.manageCP.length > 0 ? (
            company.manageCP.map((protocol, index) => (
              <Box key={index} my={4}>
                <Box borderBottom="1px" my={2} />
                <Text>
                  <strong style={{ color: "blue" }}>
                    Protocol {index + 1}:
                  </strong>
                </Text>
                <Text>
                  <strong>Department:</strong> {protocol.departments || "N/A"}
                </Text>
                <Text>
                  <strong>Sub-Department:</strong> {protocol.subdepart || "N/A"}
                </Text>
                <Text>
                  <strong>To:</strong> {protocol.toEmails || "N/A"}
                </Text>
                <Text>
                  <strong>CC(RKD):</strong> {protocol.ccEmailsRKD || "N/A"}
                </Text>
                <Text>
                  <strong>CC(Client):</strong>{" "}
                  {protocol.ccEmailsClients || "N/A"}
                </Text>
                <Text>
                  <strong>Note:</strong> {protocol.note || "N/A"}
                </Text>
                <Button
                  onClick={() => handleSendMailClick(protocol)}
                  colorScheme="blue"
                  mt={2}
                >
                  Send Mail
                </Button>
              </Box>
            ))
          ) : (
            <Text>No communication protocols available.</Text>
          )}
          <Box borderBottom="1px" my={4} />
          <Text fontSize="xl" fontWeight="bold">
            Client Active Status
          </Text>
          <Box borderBottom="1px" my={4} />
          <Text>
            <strong>Status:</strong>{" "}
            {company.isClientActive ? "Active" : "Inactive"}
          </Text>
        </Box>

        {/* Send Mail Modal */}
        <Modal
          isOpen={isMailModalOpen}
          onClose={() => setIsMailModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Text
                color="blue.600"
                fontSize="xl"
                fontWeight="bold"
                textAlign="center"
              >
                Compose Mail
              </Text>
              <Box height="2px" backgroundColor="blue.500" />
            </ModalHeader>
            <ModalBody>
              <Box>
                <Text fontWeight="bold">To:</Text>
                <Input value={selectedProtocol.toEmails || ""} isReadOnly />
                <Text mt={4} fontWeight="bold">
                  CC for RKD:
                </Text>
                <Input value={selectedProtocol.ccEmailsRKD || ""} isReadOnly />
                <Text mt={4} fontWeight="bold">
                  CC for Clients:
                </Text>
                <Input
                  value={selectedProtocol.ccEmailsClients || ""}
                  isReadOnly
                />
                <Text mt={4} fontWeight="bold">
                  Subject:
                </Text>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <Text mt={4} fontWeight="bold">
                  Body:
                </Text>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleSendMail}>
                Send
              </Button>
              <Button
                colorScheme="red"
                marginLeft={2}
                onClick={() => setIsMailModalOpen(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}

export default Preview;
