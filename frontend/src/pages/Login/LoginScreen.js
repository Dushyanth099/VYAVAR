import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Form, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { BsArrowRight } from "react-icons/bs";
import login from "../../actions/userActions";
import "./logincss.css";
import { useLocation } from "react-router-dom";
import Trust from "../../components/Trustdetails/Trust";
import { useToast } from "@chakra-ui/react";

const LoginScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const userLogin = useSelector((state) => state.userLogin);

  const { error, userInfo } = userLogin;

  // Extract the "redirect" query parameter safely
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate("/admin");
      } else if (userInfo.isDelivery) {
        navigate("/deliveryhomepage");
      } else {
        navigate(redirect);
      }
    }
  }, [navigate, userInfo, redirect]);

  // useEffect(() => {
  //   if (userInfo) {
  //     navigate(redirect);
  //   }
  // }, [navigate, userInfo, redirect]);
  useEffect(() => {
    if (error) {
      toast({
        title: "Login Failed",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [error, toast]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
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
        <div className="containera">
          <div className="login-content">
            <form onSubmit={submitHandler}>
              <h1>Login</h1>

              <div className="">
                <div className="i">
                  <i class="fas fa-envelope"></i>
                </div>
                <div className="form-flex">
                  <div className="form-row">
                    <label>Email</label>
                  </div>
                  <div className="form-column">
                    <input
                      type="text"
                      value={email}
                      className="inputa"
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
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
                    <label>Password</label>
                  </div>
                  <div className="form-column">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      className="inputa"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "75px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </span>
                  </div>
                </div>
              </div>

              <input type="submit" className="btna" value="Login" />

              <div className="div-forgot">
                <span>Forgot </span>
                <Link className="text-forgot" to="/forgetpassword">
                  Password?{" "}
                </Link>
              </div>
              <Link
                className="createAcc"
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
              >
                Create your Account <BsArrowRight size="25" />
              </Link>
            </form>
          </div>
        </div>
      </div>
      <Trust />
    </>
  );
};

export default LoginScreen;
