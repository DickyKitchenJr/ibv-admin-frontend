import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
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
        navigate("/addauthors");
      } else {
        const responseBody = await response.json();
        // TODO: change alert to a message within the login form that shows when login fails
        if (response.status === 400) {
          // Handle specific error for 400 status (Bad Request)
          alert(responseBody.error);
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
      <div className="login-div">
        <form action="POST" className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-inner-div">
            <p className="login-p">Log In</p>
            <label htmlFor="username" className="login-label">
              User Name:
            </label>
            <input
              type="text"
              id="username"
              name="username"
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
            <button type="submit" className="login-submit">Login</button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Login;
