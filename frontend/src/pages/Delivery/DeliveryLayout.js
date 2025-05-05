import React, { useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Button,
  VStack,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import DeliveryNavbar from "./DeliveryNavbar";

const DeliveryLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <>
      <DeliveryNavbar />
      <Box display="flex">
        {/* Sidebar */}
        <Box
          bg="#000000"
          p={4}
          color="white"
          width={isSidebarOpen ? "280px" : "60px"}
          height="100vh"
          position="fixed"
          top="56px"
          transition="width 0.3s ease-in-out"
          overflow="hidden"
        >
          <VStack spacing={4} align="stretch" fontSize="md">
            {/* Toggle Sidebar Button */}
            <IconButton
              icon={
                isSidebarOpen ? (
                  <ArrowLeftIcon boxSize={6} color="white" />
                ) : (
                  <ArrowRightIcon boxSize={6} color="white" />
                )
              }
              bg="transparent"
              _hover={{ bg: "gray.700" }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle Sidebar"
            />

            {isSidebarOpen && (
              <>
                <Button
                  bg="transparent"
                  color="white"
                  onClick={() => setActiveTab("orders")}
                  as={RouterLink}
                  to="/deliveryhomepage"
                >
                  Home
                </Button>
                <Button
                  bg="transparent"
                  color="white"
                  onClick={() => setActiveTab("orders")}
                  as={RouterLink}
                  to="/deliveryorders"
                >
                  Orders
                </Button>
                <Button
                  bg="transparent"
                  color="white"
                  onClick={() => setActiveTab("profile")}
                  as={RouterLink}
                  to="/profile"
                >
                  Settings
                </Button>
              </>
            )}
          </VStack>
        </Box>

        {/* Right Side Content */}
        <Box
          ml={isSidebarOpen ? "250px" : "60px"}
          p={8}
          height="100vh"
          width="full"
          bg="white"
          overflowY="auto"
          transition="margin-left 0.3s ease-in-out"
        >
          <Grid templateColumns="repeat(1, 1fr)" gap={6}>
            <GridItem>{children}</GridItem>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default DeliveryLayout;
