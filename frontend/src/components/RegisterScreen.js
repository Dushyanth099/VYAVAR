import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp } from "../actions/userActions";
import { Helmet } from "react-helmet";
import { register } from "../actions/userActions";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@chakra-ui/react";
import Trust from "../components/Trustdetails/Trust";
import "./Registerscreen.css";
import { useToast } from "@chakra-ui/react";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const toast = useToast();
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loading: otpLoading, success: otpSentSuccess } = useSelector(
    (state) => state.sendOtp
  );
  const {
    loading: verifyLoading,
    success: otpVerified,
    error: otpVerifyError,
  } = useSelector((state) => state.verifyOtp);

  const navigate = useNavigate();
  const location = useLocation();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.userRegister);

  const { error, userInfo } = userRegister;

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const handleSendOtp = () => {
    if (!email)
      return toast({
        title: "Enter Your Email First",
        description: otpVerifyError,
        position: "top-right",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    dispatch(sendOtp(email));
  };
  useEffect(() => {
    if (otpSentSuccess) {
      setOtpSent(true);
      toast({
        title: "OTP sent successfully",
        position: "top-right",
        description: "Check your email for the OTP.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [otpSentSuccess, toast]);

  const handleVerifyOtp = () => {
    if (!otp)
      return toast({
        title: "Enter OTP First",
        position: "top-right",
        description: otpVerifyError,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    dispatch(verifyOtp(email, otp));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!otpVerified) {
      toast({
        title: "OTP not verified",
        description: "Please verify OTP before registration.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    dispatch(register(name, email, password));
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  // const submitHandler = (e) => {
  //   e.preventDefault();
  //   if (password !== confirmPassword) {
  //     setMessage("Password do not match");
  //   } else {
  //     dispatch(register(name, email, password));
  //   }
  // };
  useEffect(() => {
    const inputs = document.querySelectorAll(".inputa");

    function addcl() {
      let parent = this.parentNode.parentNode;
      parent.classList.add("focus");
    }

    function remcl() {
      let parent = this.parentNode.parentNode;
      if (this.value === "") {
        parent.classList.remove("focus");
      }
    }

    inputs.forEach((inputa) => {
      inputa.addEventListener("focus", addcl);
      inputa.addEventListener("blur", remcl);
    });

    return () => {
      inputs.forEach((inputa) => {
        inputa.removeEventListener("focus", addcl);
        inputa.removeEventListener("blur", remcl);
      });
    };
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div className="registerSc">
        <div className="containera">
          <div className="login-content">
            <form onSubmit={handleRegister}>
              <h1>Register</h1>
              {message && <h4>{message}</h4>}
              {error && <h4>{error}</h4>}
              {otpVerifyError && <h4>{otpVerifyError}</h4>}
              <div className="">
                <div className="i">
                  <i className="fas fa-user"></i>
                </div>
                <div className="form-flex">
                  <div className="form-row">
                    <label>Name</label>
                  </div>
                  <div className="form-column">
                    <input
                      type="text"
                      value={name}
                      className="inputa"
                      placeholder="Enter name"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="">
                <div className="i">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="form-flex">
                  <div className="form-row">
                    <label>Email</label>
                  </div>
                  <div className="form-column">
                    <div>
                      <input
                        type="text"
                        value={email}
                        className="inputa"
                        placeholder="Enter email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="i">
                  <i className="fas fa-lock"></i>
                </div>
                <div className="form-flex">
                  <div className="form-row">
                    <label>Password</label>
                  </div>
                  <div className="form-column">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      className="inputa"
                      placeholder="Enter password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="">
                <div className="i">
                  <i className="fas fa-lock"></i>
                </div>
                <div className="form-flex">
                  <div className="form-row">
                    <label>Confirm Password</label>
                  </div>
                  <div className="form-column">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      className="inputa"
                      placeholder="Confirm password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "80px",
                        top: "51%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </span>
                  </div>
                </div>
              </div>
              {message && <h4>{message}</h4>}
              <button
                className="btna2"
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading}
              >
                {otpLoading ? "Sending..." : "Send OTP"}
              </button>
              {/* OTP Input (Visible only if sent) */}
              {otpSent && (
                <div
                  style={{
                    marginLeft: "50px",
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                    height: "50px",
                  }}
                >
                  <input
                    type="text"
                    value={otp}
                    placeholder="Enter OTP"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    type="button"
                    cursor="pointer"
                    onClick={handleVerifyOtp}
                    disabled={verifyLoading}
                  >
                    {verifyLoading ? "Verifying..." : "Verify"}
                  </button>
                </div>
              )}
              <input type="submit" className="btna2" value="Sign up" />
              <br />
              {/* Registration button only if OTP verified */}
              Have an Account?{" "}
              <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
                Login
              </Link>
            </form>
          </div>
        </div>
      </div>
      <Trust />
    </>
  );
};

export default RegisterScreen;
