import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Welcome from "./Welcome";
import "../styles/Login.css";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [failedLogin, setFailedLogin] = useState(false);
  const [failedCount, setFailedCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const apiAddress = import.meta.env.VITE_API_ADDRESS;
  const navigate = useNavigate();

  // Username and Password handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  // Submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiAddress, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        if (response.status === 401) {
          // Handle specific error for 401 status (Unauthorized)
          setFailedLogin(true);
          setFailedCount(failedCount + 1);
        } else {
          // Handle other errors, e.g., show a generic error message to the user
          alert(
            "Form submission failed. Please recheck your information and try again"
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main>
      {isLoggedIn === false ? <> {failedCount < 10 ? (
        <>
          {" "}
          <div className="login-div">
            <form action="POST" className="login-form" onSubmit={handleSubmit}>
              <div className="login-form-inner-div">
                {failedLogin ? (
                  <p className="failed-login">Incorrect Name Or Password</p>
                ) : null}
                <p className="login-p">Log In</p>
                <label htmlFor="username" className="login-label">
                  User Name:
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="on"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                <br />
                <label htmlFor="password" className="login-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <br />
                <button type="submit" className="login-submit">
                  Login
                </button>
              </div>
            </form>
          </div>{" "}
        </>
      ) : (
        <><div className="rejected">
          <iframe
            src="https://giphy.com/embed/ftqLysT45BJMagKFuk"
            width="480"
            height="405"
            allowFullScreen
          ></iframe>
          <p>
            <a href="https://giphy.com/gifs/chicken-bro-ftqLysT45BJMagKFuk">
              via GIPHY
            </a>
          </p>
        </div>
        </>
      )} </> : <Welcome loggedIn = {isLoggedIn} /> }
      
    </main>
  );
}

export default Login;
