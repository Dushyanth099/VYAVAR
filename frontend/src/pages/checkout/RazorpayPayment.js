import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRazorpayOrder } from "../../actions/paymentActions";
import { savepaymentmethod } from "../../actions/cartActions";
import { useNavigate } from "react-router-dom";

const RazorpayButton = ({ amount, handleOrder }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order } = useSelector((state) => state.razorpayOrder);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpay = async () => {
    const res = await loadRazorpayScript();
    if (!res) return alert("Razorpay SDK failed to load.");
    await dispatch(createRazorpayOrder(amount));
    if (!order) return;

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID, // or hardcoded test key
      amount: order.amount,
      currency: "INR",
      name: "Viyavar",
      description: "Order Payment",
      order_id: order.id,
      handler: async function (response) {
        alert("Payment successful!");
        dispatch(savepaymentmethod("Card"));
        console.log("Payment ID:", response.razorpay_payment_id);
        // Pass payment result to order handler
        const paymentResult = {
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        await handleOrder({ paymentMethod: "Card", paymentResult });
        navigate("/placeorder");
      },

      prefill: {
        name: "Customer",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#000346",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "120px",
        width: "100%", // Make container full width
      }}
    >
      <button
        onClick={openRazorpay}
        style={{
          padding: "12px 32px",
          background: "#000346",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "1.1rem",
          width: "100%",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          transition: "background 0.3s, transform 0.2s",
          outline: "none",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "black")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#000346")}
      >
        Pay ₹{amount}
      </button>
    </div>
  );
};

export default RazorpayButton;
