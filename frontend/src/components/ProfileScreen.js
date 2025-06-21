import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { listMyOrders } from "../actions/orderActions";
import {
  Box,
  Flex,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Icon,
  List,
  ListItem,
  Th,
  Td,
  Text,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";

import Trust from "../components/Trustdetails/Trust";
import profileimg from "../assets/profile_profile.svg";
import addressimg from "../assets/profile_address.svg";
import ordersimg from "../assets/profile_orders.svg";
import profiletag from "../assets/profiletag.png";

const ProfileScreen = ({ history }) => {
  const [activeSection, setActiveSection] = useState("profile");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({});
  const [profilePicture, setProfilePicture] = useState(null); // ✅ Updated to handle image
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderMylist = useSelector((state) => state.orderMylist);
  const { loading: loadingOrders, error: errorOrders, orders } = orderMylist;
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user.name) {
        dispatch(getUserDetails("profile"));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
        setAddress(user.address || {});
        setProfilePicture(user.profilePicture || null);
        setGender(user.gender || "");
        setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "");
        setLastName(user.lastName || "");
      }
    }
  }, [dispatch, navigate, userInfo, user]);

  // ✅ Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  // ✅ Convert form fields to `FormData`
  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", JSON.stringify(address)); // ✅ Convert object to string
    if (profilePicture) {
      formData.append("profilePicture", profilePicture); // ✅ Append file
    }
    formData.append("lastName", lastName);
    formData.append("gender", gender);
    formData.append("dateOfBirth", dateOfBirth);
    dispatch(updateUserProfile(formData));

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };
  // 🟢 Sidebar Menu Options
  const menuOptions = [
    { id: "profile", label: "Profile", image: profileimg },
    { id: "addresses", label: "Address", image: addressimg },
    { id: "orders", label: "My Orders", image: ordersimg },
    {
      id: "about",
      label: "About",
      path: "/About",
    },
    {
      id: "contactus",
      label: "Contactus",
      path: "/Contactus",
    },

    {
      id: "Terms and conditions",
      label: "Terms and Conditions",
      path: "/_blank ",
    },
    {
      id: "Privacy policy",
      label: "Privacy policy",
      path: "/_blank",
    },
    {
      id: "Return policy",
      label: "Return policy",
      path: "/_blank",
    },
    {
      id: "logout",
      label: "Logout",
      icon: FaSignOutAlt,
      onClick: handleLogout,
    },
  ];

  const renderProfile = () => (
    <Box
      mx="auto"
      p={0}
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDirection="column"
    >
      <VStack as="form" onSubmit={submitHandler} spacing={4}>
        <FormControl>
          <Box
            position="relative"
            boxSize="100px"
            borderRadius="full"
            overflow="hidden"
            mx="auto"
          >
            <img
              src={
                user?.profilePicture ||
                (profilePicture instanceof File
                  ? URL.createObjectURL(profilePicture)
                  : "https://via.placeholder.com/150")
              }
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* ✅ Upload Icon Overlay */}
            <Box
              position="absolute"
              bottom={2}
              right={2}
              bg="blackAlpha.700"
              p={2}
              borderRadius="full"
              cursor="pointer"
              onClick={() => document.getElementById("imageUpload").click()}
            >
              <Icon as={FaCamera} color="white" boxSize={5} />
            </Box>

            {/* ✅ Hidden File Input */}
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            placeholder="Enter your First name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Date of Birth</FormLabel>
          <Input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Gender</FormLabel>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </FormControl>

        <Button bg="black" color="white" type="submit" w="full">
          Update
        </Button>
      </VStack>
    </Box>
  );

  const fieldOrder = [
    "doorNo",
    "street",
    "nearestLandmark",
    "city",
    "state",
    "pin",
    "phoneNumber",
  ];

  const renderAddresses = () => (
    <Box mx="auto" p={6}>
      <VStack spacing={4} align="stretch">
        {fieldOrder.map((field) => (
          <FormControl key={field}>
            <FormLabel>
              {field.replace(/([A-Z])/g, " $1").toUpperCase()}
            </FormLabel>
            <Input
              value={address[field]}
              placeholder={`Enter ${field}`}
              onChange={(e) =>
                setAddress({ ...address, [field]: e.target.value })
              }
            />
          </FormControl>
        ))}
        <Button bg="black" color="white" onClick={submitHandler}>
          Update
        </Button>
      </VStack>
    </Box>
  );
  const renderOrders = () => (
    <Box overflowX="auto">
      {loadingOrders ? (
        <Spinner />
      ) : errorOrders ? (
        <Alert status="error">
          <AlertIcon />
          {errorOrders}
        </Alert>
      ) : (
        <Table>
          <Thead>
            <Tr></Tr>
          </Thead>
          <Tbody>
            {orders.map((order) =>
              order.orderItems.map((item) => (
                <Box
                  key={item._id}
                  p={4}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  mb={4}
                >
                  <HStack
                    justifyContent="space-between"
                    spacing={4}
                    alignItems="center"
                  >
                    {/* Order Details */}
                    <Text fontSize="sm" color="gray.600">
                      {order.orderItems.length} Item
                      {order.orderItems.length > 1 ? "s" : ""} • ₹
                      {order.totalPrice.toFixed(2)} •{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Text>

                    {/* Product Image with Clickable Link */}
                    <Link to={`/order/${order._id}`}>
                      <Box textAlign="center">
                        <Box
                          boxSize="60px"
                          overflow="hidden"
                          border="1px solid gray"
                          cursor="pointer"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.name}
                            width="60"
                            height="60"
                            style={{ objectFit: "cover" }}
                          />
                        </Box>
                        {/* Brand Name Below Image */}
                        <Text fontWeight="bold" fontSize="sm" mt={2}>
                          {item.product.brandname}
                        </Text>
                      </Box>
                    </Link>
                  </HStack>
                </Box>
              ))
            )}
          </Tbody>
        </Table>
      )}
    </Box>
  );

  // 🟢 Content Switcher
  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfile();
      case "addresses":
        return renderAddresses();
      case "orders":
        return renderOrders();
      default:
        return null;
    }
  };
  return (
    <Box mt={20} bg="white">
      <Helmet>
        <title>Profile</title>
      </Helmet>

      {/* 🟢 Sidebar & Content Layout */}
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={8}
        justify="center" // ✅ Centers content horizontally
        align="start" // ✅ Aligns sidebar and content to the top
        mx="auto"
        maxW="1000px" // ✅ Adjusts max width for proper alignment
        w="full"
        p={5}
      >
        {/* LEFT SIDE - MENU */}
        <Box
          bg="white"
          p={4}
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          minW="450px"
          h="562px" // ✅ Fixed height for right-side box
          overflowY="auto"
          css={{
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Box mb="3">
            <img src={profiletag} alt="Profile" width="full" height="full" />
          </Box>
          {/* Desktop Sidebar */}
          <List spacing={3}>
            {menuOptions.map((menu) => (
              <ListItem key={menu.id}>
                <Link to={menu.path} style={{ textDecoration: "none" }}>
                  <HStack
                    p={3}
                    borderRadius="md"
                    cursor="pointer"
                    color={activeSection === menu.id ? "white" : "black"}
                    bg={activeSection === menu.id ? "black" : "gray.100"}
                    onClick={() => setActiveSection(menu.id)}
                  >
                    {menu.image && (
                      <img
                        src={menu.image}
                        alt={menu.label}
                        width="24"
                        height="24"
                        style={{ borderRadius: "5px" }}
                      />
                    )}
                    <Text fontWeight="600">{menu.label}</Text>
                  </HStack>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* RIGHT SIDE - CONTENT */}
        <Box
          p={6}
          bg="white"
          rounded="lg"
          shadow="sm"
          border="1px solid"
          borderColor="gray.300"
          flex="1" // ✅ Allows content to take remaining space
          minW="600px"
          h="562px" // ✅ Fixed height for right-side box
          overflow="hidden"
        >
          <Box
            h="100%"
            overflowY="auto" // ✅ Only inner content will scroll
            pr={2} // ✅ Adds a little space for scrollbar
            css={{
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {renderContent()}
          </Box>
        </Box>
      </Flex>
      <Trust />
    </Box>
  );
};

export default ProfileScreen;
