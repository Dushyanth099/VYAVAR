import React from "react";
import { useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  HStack,
  Link,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { logout } from "../../actions/userActions";
import Logo from "../../assets/ecommerce-logo.png";
import { NavLink } from "react-router-dom";

const DeliveryNavbar = () => {
  const dispatch = useDispatch();
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logoutHandler = () => {
    dispatch(logout());
    onClose();
  };
  return (
    <Box
      as="nav"
      bg="#ffc627"
      px={4}
      py={3}
      color="white"
      position="fixed"
      top={0}
      width="100%"
      zIndex={1000}
    >
      <Flex align="center" justifyContent="space-between">
        {/* Navbar Logo */}
        <Box fontWeight="bold" fontSize="lg">
          <NavLink to="/deliveryhomepage" className="logo">
            <img src={Logo} alt="logo" />
            <span className="logo-text">E-Commerce</span>
          </NavLink>
        </Box>

        {/* Navbar Links */}
        <HStack spacing={6} ms={9}>
          <Link
            as={RouterLink}
            to="/profile"
            _hover={{ textDecoration: "none" }}
            color="white"
          >
            Profile
          </Link>
          <Button onClick={onOpen}>Logout</Button>
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent
                borderRadius="12px"
                boxShadow="lg"
                bg="white"
                maxW="320px"
                height={80}
                p={6} /* ⬅️ Added padding */
                animation="fadeIn 0.3s ease-in-out"
              >
                <AlertDialogHeader
                  fontSize="md"
                  fontWeight="bold"
                  textAlign="center"
                  p={4}
                >
                  Logout Confirmation
                </AlertDialogHeader>

                <AlertDialogBody textAlign="center" fontSize="md" p={5}>
                  Are you sure you want to log out? <br />
                </AlertDialogBody>

                <AlertDialogFooter display="flex" justifyContent="center" p={4}>
                  <Button
                    ref={cancelRef}
                    onClick={onClose}
                    borderRadius="8px"
                    bg="gray.300"
                    color="black"
                    px={6}
                    _hover={{ bg: "gray.400" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={logoutHandler}
                    ml={3}
                    px={6}
                    borderRadius="8px"
                    _hover={{ bg: "red.600" }}
                  >
                    Logout
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </HStack>
      </Flex>
    </Box>
  );
};

export default DeliveryNavbar;
