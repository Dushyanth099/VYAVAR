import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Divider,
  Grid,
  Flex,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  saveAddressshipping,
  savepaymentmethod,
  fetchCart,
} from "../../actions/cartActions";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Payment from "./PaypalPayment";
import { fetchShippingRates } from "../../actions/deliveryActions";
import { saveShippingCost } from "../../actions/cartActions";
import { saveShippingRates } from "../../actions/cartActions";
import StripePayment from "./Stripepayment";
import { createShipment } from "../../actions/deliveryActions";
import { CreateOrder } from "../../actions/orderActions";
import { getUserDetails } from "../../actions/userActions";
import PaymentModal from "./PaymentModal";
import RazorpayButton from "./RazorpayPayment";

const Checkout = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const itemsPrice = cart.cartItems.reduce((acc, item) => {
    if (item.product && item.product.price) {
      return acc + item.qty * item.product.price;
    }
    return acc;
  }, 0);

  const { shippingAddress } = cart;
  const { rates, loading, error } = useSelector((state) => state.shipping);
  const [doorNo, setDoorNo] = useState(shippingAddress?.doorNo || "");
  const [street, setStreet] = useState(shippingAddress?.street || "");
  const [nearestLandmark, setNearestLandmark] = useState(
    shippingAddress?.nearestLandmark || ""
  );
  const [selectedRate, setSelectedRate] = useState(null);
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [state, setState] = useState(shippingAddress?.state || "");
  const [pin, setPin] = useState(shippingAddress?.pin || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");
  const [phoneNumber, setPhoneNumber] = useState(
    shippingAddress?.phoneNumber || ""
  );
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const dispatch = useDispatch();
  const taxPercentage = 5;
  const shippingRates = cart.shippingRates;
  const subtotal = cart.cartItems.reduce(
    (acc, item) => acc + item.qty * item.product.price,
    0
  );
  const taxAmount = (subtotal * taxPercentage) / 100;
  const [shippingCost, setShippingCost] = useState(0);
  const totalPrice = subtotal + taxAmount + shippingCost;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, ordererror } = orderCreate;
  const userProfile = useSelector((state) => state.userDetails);
  const { user, loading: userLoading } = userProfile;
  const recipientAddress = user?.address;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleShippingRateChange = (rate) => {
    setSelectedRate(rate);

    const netCharge =
      (rate.ratedShipmentDetails &&
        rate.ratedShipmentDetails[0]?.totalNetCharge) ||
      0;
    const currency = rate.ratedShipmentDetails?.[0]?.currency || "USD";
    const estimatedDeliveryDate =
      rate.operationalDetail?.astraDescription || "N/A";

    setShippingCost(netCharge);
    dispatch(saveShippingCost(netCharge));
    dispatch(
      saveShippingRates([
        {
          serviceType: rate.serviceType,
          totalNetCharge: parseFloat(netCharge),
          estimatedDeliveryDate,
          currency,
        },
      ])
    );
    console.log("✅ Shipping Rate Saved in Redux:", {
      serviceType: rate.serviceType,
      totalNetCharge: parseFloat(netCharge),
      estimatedDeliveryDate: rate.estimatedDeliveryDate || "N/A",
      currency: rate.currency || "USD",
    });
  };

  const handleFetchRates = () => {
    if (cart.cartItems.length > 0) {
      const firstProduct = cart.cartItems[0].product;
      dispatch(
        fetchShippingRates(
          { street, city, state, zip: pin, country },
          firstProduct._id
        )
      );
    }
  };

  useEffect(() => {
    if (cart.cartItems.length > 0) {
      handleFetchRates();
    }
  }, [pin, country]);
  useEffect(() => {
    if (rates) {
      console.log("FedEx API Response:", rates);
    }
  }, [rates]);

  const handleOrder = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    dispatch(
      saveAddressshipping({
        doorNo,
        street,
        nearestLandmark,
        city,
        state,
        pin,
        country,
        phoneNumber,
      })
    );

    const selectedPaymentMethod = cart.paymentMethod;

    try {
      const orderData = {
        user: userInfo._id,
        orderItems: cart.cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.brandname,
          price: item.product.price,
          qty: item.qty,
        })),
        shippingAddress: recipientAddress,
        shippingRates,
        paymentMethod,
        itemsPrice,
        shippingPrice: shippingCost,
        taxPrice: taxAmount,
        totalPrice,
      };

      console.log("Final Order Payload:", orderData);
      dispatch(CreateOrder(orderData));
    } catch (error) {
      console.error("❌ Error creating order:", error);
    }
  };
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails("profile"));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (success) {
      console.log(order._id);
      navigate(`/order/${order._id}`);
    }
  }, [navigate, success, order]);

  return (
    <>
      <Box p={6} maxW="container.xl" mx="auto">
        <Grid templateColumns={{ base: "1fr" }} gap={8}>
          {/* Right Side - Order Summary */}
          <VStack
            align="start"
            spacing={4}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            shadow="md"
          >
            {/* <Box
              borderWidth="2px"
              borderRadius="lg"
              p={4}
              shadow="lg"
              w="full"
              bg="white"
              borderColor="gray.200"
            > */}
            <Text fontSize="l" fontWeight="bold" p="2">
              NOTE
            </Text>
            <Divider />
            <Flex align="center" mt={1}>
              <Icon
                as={AiOutlineInfoCircle}
                boxSize={4}
                mr={2}
                color="blue.500"
              />
              <Text fontSize="sm" color="gray.500">
                Cash on Delivery option is not available
              </Text>
            </Flex>

            <Flex align="center">
              <Icon
                as={AiOutlineInfoCircle}
                boxSize={4}
                mr={2}
                color="blue.500"
              />
              <Text fontSize="sm" color="gray.500">
                10 days return policy on all products.
              </Text>
            </Flex>

            <Flex align="center">
              <Icon
                as={AiOutlineInfoCircle}
                boxSize={4}
                mr={2}
                color="blue.500"
              />
              <Text fontSize="sm" color="gray.500">
                Please ensure the product is unused and in original packaging
                for returns.
              </Text>
            </Flex>

            <Flex align="center">
              <Icon
                as={AiOutlineInfoCircle}
                boxSize={4}
                mr={2}
                color="blue.500"
              />
              <Text fontSize="sm" color="gray.500">
                Delivery timelines may vary based on your location.
              </Text>
            </Flex>

            <Flex align="center">
              <Icon
                as={AiOutlineInfoCircle}
                boxSize={4}
                mr={2}
                color="blue.500"
              />
              <Text fontSize="sm" color="gray.500">
                For any queries, contact our support team.
              </Text>
            </Flex>

            <Flex align="center">
              <Icon
                as={AiOutlineInfoCircle}
                boxSize={4}
                mr={2}
                color="blue.500"
              />
              <Text fontSize="sm" color="gray.500">
                All prices are inclusive of taxes.
              </Text>
            </Flex>
            {/* </Box> */}
          </VStack>
          <VStack
            align="start"
            spacing={4}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            shadow="md"
          >
            <Box
              borderWidth="2px"
              borderRadius="lg"
              p={4}
              shadow="lg"
              w="full"
              bg="white"
              borderColor="gray.200"
            >
              <Text fontSize="l" fontWeight="bold" p="2">
                BILL DETAILS
              </Text>

              <Divider />

              <HStack justify="space-between" w="full" p="3">
                <Text>Subtotal:</Text>
                <Text color={"grey"}>Rs. {subtotal.toFixed(2)}</Text>
              </HStack>
              <HStack justify="space-between" w="full" p="3">
                <Text>Shipping:</Text>
                <Text color={"grey"}>FREE</Text>
              </HStack>
              <HStack justify="space-between" w="full" p="3">
                <Text>Taxes (5%):</Text>
                <Text color={"grey"}>Rs. {taxAmount.toFixed(2)}</Text>
              </HStack>
              <HStack justify="space-between" w="full" p="3">
                <Text fontSize="lg" fontWeight="bold">
                  Final Total:
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  Rs. {totalPrice.toFixed(2)}
                </Text>
              </HStack>
            </Box>
            {/* <Button
              bg="#000346"
              color="white"
              size="lg"
              w="full"
              onClick={onOpen}
            >
              Pay ₹{totalPrice}
            </Button> */}
        <RazorpayButton handleOrder={handleOrder} amount={totalPrice} />
          </VStack>
        </Grid>
      </Box>
    </>
  );
};

export default Checkout;
