// actions/paymentActions.js
import axios from "axios";
import {
  RAZORPAY_ORDER_REQUEST,
  RAZORPAY_ORDER_SUCCESS,
  RAZORPAY_ORDER_FAIL,
} from "../constants/paymentConstants";

export const createRazorpayOrder = (amount) => async (dispatch, getState) => {
  try {
    dispatch({ type: RAZORPAY_ORDER_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.post(
      "/api/payment/create-order",
      { amount },
      config
    );

    dispatch({ type: RAZORPAY_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: RAZORPAY_ORDER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
