import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import loginPhoto from "../login.svg";
import "font-awesome/css/font-awesome.min.css";

export default function Login({ setToken, logout }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  if (logout) {
    axios
      .post("/logout")
      .then(() => {
        setToken(null);
        history.push("/login");
      })
      .catch((error) =>
        toast.error(
          error.response
            ? error.response.data
            : "Some error has been occured. Please try again."
        )
      );
  }

  const onLoginPress = (event) => {
    event.preventDefault();

    axios
      .post("/login", { email, password })
      .then((response) => {
        setToken(response.data);
        toast.success("Logged in successfully!");
        history.push("/");
      })
      .catch((error) =>
        toast.error(
          error.response
            ? error.response.data
            : "Some error has been occured. Please try again."
        )
      );
  };

  const openRegisterPage = () => {
    history.push("/register")
  }

  return (
    <div className="container">
      <div className="form-box">
        <div className="header">Login</div>
        <div className="content text-center">
          <div className="image py-4">
            <img src={loginPhoto} style={{ width: "16em", padding: "2px" }} />
          </div>
        </div>
        <div className="body-form">
          <form onSubmit={onLoginPress}>
            <div className="input-group my-4">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i class="fa fa-user"></i>
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="input-group mb-4">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i class="fa fa-lock"></i>
                </span>
              </div>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <button className="btn btn-success btn-block my-4">Login</button>
          </form>
          <div className="message mb-4">
            <div>
              <input type="checkbox" /> Remember me
            </div>
            <div>
              <a href="/reset-password">Forgot your password</a>
            </div>
          </div>
          <div className="notRegistered text-center">
            <span>Don't have an account? </span>
            <button className="btn btn-danger btn-xs my-4" onclick={openRegisterPage}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
}