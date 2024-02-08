import Logout from "../components/Logout";
import "../styles/Pages.css";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { useContext, useState } from "react";

function AddUsers() {
  const { userAccessLevel } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    accessLevel: "helper",
  });
  const [isChecked, setIsChecked] = useState(false);
  const apiAddUserAddress = import.meta.env.VITE_API_ADD_USER_ADDRESS;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckbox = () => {
    if (isChecked === false) {
      setIsChecked(true);
      setFormData({ ...formData, accessLevel: "admin" });
    } else {
      setIsChecked(false);
      setFormData({ ...formData, accessLevel: "helper" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiAddUserAddress, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        //clear form
        setFormData({
          username: "",
          password: "",
          accessLevel: "helper",
        });
        //inform user that request was successful
        alert(`${result.username} successfully added as ${result.accessLevel}`);
      } else {
        alert("Error. User not added.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const unauthorizedUser = () => {
    if (userAccessLevel !== "admin") {
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* check if user is authorized, and if not deny access and send them to the login */}
      {unauthorizedUser()}

      <nav className="top-bar">
        <NavLink to="/welcome" className="back">
          &#129092; Back
        </NavLink>
        <Logout />
      </nav>

      <h1 className="title">Add Users</h1>
      <h2 className="title">Only add those who have been carefully vetted.</h2>

      <main className="main">
        <form className="user-info" onSubmit={handleSubmit}>
          <label htmlFor="username">User Name:</label>
          <input
            className="user-input"
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleInputChange}
          />
          <br />
          <br />
          <label htmlFor="password">Password:</label>
          <input
            className="user-input"
            type="text"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <br />
          <br />
          <label htmlFor="accessLevel">Give Admin Privileges:</label>{" "}
          <input
            className="user-checkbox"
            type="checkbox"
            id="accessLevel"
            name="accessLevel"
            checked={isChecked}
            onChange={handleCheckbox}
          />
          <br />
          <br />
          <p>
            (Admin Privileges Allow For Deleting Listings And Adding Users
            **Exercise Caution**)
          </p>
          <br />
          <div className="submit">
            <button className="button">Submit</button>
          </div>
        </form>
      </main>
    </>
  );
}

export default AddUsers;
