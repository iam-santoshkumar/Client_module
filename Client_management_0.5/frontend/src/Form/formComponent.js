
import React, { useContext} from "react";
import PopupContext from "../context/popupContext.js";
import AddressComponenet from "./formComponenet/addressComponenet.js";
import CompanyDetailsForm from "./formComponenet/companyDetailsForm.js";
import {
  Box,
  Button,
  Heading,
  Flex,
  IconButton,
  useToast,
  ScaleFade,
  CloseButton,
} from "@chakra-ui/react";

function FormComponent() {
  const toast = useToast();
  const { company, setAddPopup, setShowUpdate, setShowStage, lastVisitedPage, setCurrentPage } = useContext(PopupContext);

  const closeAddPopup = () => {
    setAddPopup(false);
    setShowUpdate(false);
    setShowStage(true);
    if (lastVisitedPage !== null) {
      setCurrentPage(lastVisitedPage);
    }
  };

  return (
    <Flex justify="center" align="start" minH="50vh"  p="2">
      <Box
        bg="whitesmoke"
        shadow="lg"
        rounded="lg"
        p="4"
        w="full"
        maxW="full"
        mx="6"
        position="relative"
      >
        <Flex
          justify="space-between"
          align="center"
          mb="2"
          bgGradient="linear(to-r, teal.500, teal.400)"
          rounded="md"
          p="1"
          shadow="lg"
          color="white"
        >
          <Heading fontSize="2xl" ml="3" >CLIENT DETAILS :</Heading>
          <Button
            onClick={closeAddPopup}
            size="lg"
            color="red.500"
            w="60px"
            h="60px"
            fontSize="5xl"
            fontWeight="bold" // Makes the "×" bold
            bg="transparent"
            _hover={{ bg: "transparent", transform: "scale(1.1)" }}
            _focus={{ boxShadow: "none" }}
          >
            &times;
          </Button>
        </Flex>

        <CompanyDetailsForm />

        {company.nameOfCompany && (
          <ScaleFade initialScale={0.9} in={company.nameOfCompany}>
            <AddressComponenet />
          </ScaleFade>
        )}
      </Box>
    </Flex>
  );
}

export default React.memo(FormComponent);

