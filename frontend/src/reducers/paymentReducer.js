// reducers/paymentReducer.js
import {
  RAZORPAY_ORDER_REQUEST,
  RAZORPAY_ORDER_SUCCESS,
  RAZORPAY_ORDER_FAIL,
} from "../constants/paymentConstants";

export const razorpayOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case RAZORPAY_ORDER_REQUEST:
      return { loading: true };
    case RAZORPAY_ORDER_SUCCESS:
      return { loading: false, order: action.payload };
    case RAZORPAY_ORDER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
