import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Text, SimpleGrid, Flex, Icon, Avatar } from "@chakra-ui/react";
import { FaWallet, FaClock, FaCheckCircle, FaTruck } from "react-icons/fa";
import { getUserDetails } from "../../actions/userActions";
import DeliveryOrdersPage from "./DeliveryOrdersPage";

const DeliveryDashboard = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const userProfile = useSelector((state) => state.userDetails);
  const { user } = userProfile;

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails("profile"));
    }
  }, [dispatch, userInfo]);

  return (
    <>
      <Box
        p={5}
        m="10"
        bg="#1E73BE"
        borderRadius="lg"
        color="white"
        textAlign="center"
      >
        {/* User Profile */}
        <Flex align="center" justify="center" mb={4}>
          <Avatar
            size="xl"
            name={user?.name}
            src={user?.profilePicture || "https://via.placeholder.com/150"}
          />
          <Box ml={3}>
            <Text fontSize="xl">Hi, {user?.name || "User"}</Text>
            <Text fontSize="2xl" fontWeight="bold">
              $2,280.00
            </Text>
            <Text fontSize="sm">Balance</Text>
          </Box>
        </Flex>

        {/* Balance Stats */}
        <SimpleGrid columns={3} spacing={3}>
          {[
            { label: "Cash in hand", value: "$0K" },
            { label: "Pending withdraw", value: "$0K" },
            { label: "Withdrawn", value: "$0K" },
          ].map((item, index) => (
            <Box
              key={index}
              p={3}
              bg="rgba(255, 255, 255, 0.2)"
              borderRadius="lg"
            >
              <Text fontSize="lg" fontWeight="bold">
                {item.value}
              </Text>
              <Text fontSize="sm">{item.label}</Text>
            </Box>
          ))}
        </SimpleGrid>

        <Text mt={4} fontSize="lg" fontWeight="bold">
          $0K
        </Text>
        <Text fontSize="sm">Withdrawable balance</Text>
      </Box>

      {/* Order Status */}
      <Box mt={6} bg="white" p={4} borderRadius="lg" color="black">
        <Text fontSize="lg" fontWeight="bold" textAlign={"center"} m="5">
          Order Status
        </Text>
        <Flex gap="5" justifyContent="center">
          {[
            { label: "Assigned", value: 13, color: "blue.100", icon: FaTruck },
            { label: "Paused", value: 1, color: "yellow.100", icon: FaClock },
            {
              label: "Delivered",
              value: 10,
              color: "green.100",
              icon: FaCheckCircle,
            },
          ].map((status, index) => (
            <Flex
              key={index}
              justify="space-between"
              align="center"
              bg={status.color}
              p={5}
              borderRadius="lg"
              w="100%"
              maxWidth={300}
              mt={2}
            >
              <Flex align="center">
                <Icon as={status.icon} boxSize={6} mr={2} />
                <Text fontSize="md">{status.label}</Text>
              </Flex>
              <Text fontSize="lg" fontWeight="bold">
                {status.value}
              </Text>
            </Flex>
          ))}
        </Flex>
        <Text fontSize="lg" fontWeight="bold" m="10">
          Assigned Orders
        </Text>
        <DeliveryOrders />
      </Box>
    </>
  );
};

export default DeliveryDashboard;
