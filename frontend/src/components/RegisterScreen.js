import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import login from "../actions/userActions";
import { Helmet } from "react-helmet";
import { register } from "../actions/userActions";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@chakra-ui/react";
import Trust from "../components/Trustdetails/Trust"
import "./Registerscreen.css";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.userRegister);

  const { error, userInfo } = userRegister;

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Password do not match");
    } else {
      dispatch(register(name, email, password));
    }
  };

  const inputs = document.querySelectorAll(".inputa");

  function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
  }

  function remcl() {
    let parent = this.parentNode.parentNode;
    if (this.value == "") {
      parent.classList.remove("focus");
    }
  }

  inputs.forEach((inputa) => {
    inputa.addEventListener("focus", addcl);
    inputa.addEventListener("blur", remcl);
  });

  return (
    <>
      <div className="registerSc">
        <Helmet>
          <title>Register</title>
        </Helmet>

        <div className="containera">
          <div className="login-content">
            <form onSubmit={submitHandler}>
              <h1>Create Account</h1>
              {error && <h4>{error}</h4>}
              <div className="input-div zz">
                <div className="i">
                  <i className="fas fa-user"></i>
                </div>
                <div className="div">
                  <input
                    type="text"
                    value={name}
                    className="inputa"
                    placeholder="Enter name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-div one">
                <div className="i">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="div">
                  <input
                    type="text"
                    value={email}
                    className="inputa"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-div pass">
                <div className="i">
                  <i className="fas fa-lock"></i>
                </div>
                <div className="div">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    className="inputa"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-div passconf">
                <div className="i">
                  <i className="fas fa-lock"></i>
                </div>
                <div className="div">
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
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>
              {message && <h4>{message}</h4>}
              <input type="submit" className="btna2" value="Sign up" />
              <br />
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
