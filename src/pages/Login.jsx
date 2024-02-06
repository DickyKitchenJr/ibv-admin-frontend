import { useContext, useState } from "react";
import Welcome from "./Welcome";
import "../styles/Login.css";
import { AuthContext } from "../context/AuthProvider";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { handleLogin, failedCount, failedLogin, isLoggedIn } =
    useContext(AuthContext);

  // Username and Password handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  // Submission handler
  const handleSubmit = async (e) => {
    handleLogin(e, formData);
  };

  return (
    <main>
      {/* if user is not logged in */}
      {isLoggedIn === false ? (
        <>
        {/* if user has not failed to log in >= 10 times */}
          {" "}
          {failedCount < 10 ? (
            <>
              {" "}
              <div className="login-div">
                <form
                  action="POST"
                  className="login-form"
                  onSubmit={handleSubmit}
                >
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
                      Log In
                    </button>
                  </div>
                </form>
              </div>{" "}
            </>
          ) : (
            <>
              <div className="rejected">
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
          )}{" "}
        </>
      ) : (
        <Welcome />
      )}
    </main>
  );
}

export default Login;
