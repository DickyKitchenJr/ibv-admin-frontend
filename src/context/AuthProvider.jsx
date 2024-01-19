import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [failedLogin, setFailedLogin] = useState(false);
  const [failedCount, setFailedCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const logoutAddress = import.meta.env.VITE_API_LOGOUT_ADDRESS;
  const loginAddress = import.meta.env.VITE_API_LOGIN_ADDRESS;

  const handleLogin = async (e, formData) => {
    e.preventDefault();

    try {
      const response = await fetch(loginAddress, {
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

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(logoutAddress, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Success response received");
        setIsLoggedIn(false);
        window.location.href = "/";
      } else {
        alert(
          "Logout failed. If problem persist close your browser and your login will timeout."
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ handleLogin, handleLogout, isLoggedIn, setIsLoggedIn, failedLogin, setFailedLogin, failedCount, setFailedCount }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
