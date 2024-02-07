import Logout from "../components/Logout";
import "../styles/Pages.css";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { useContext, useState } from "react";

function AddUsers() {
  const { userAccessLevel } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    userName: null,
    password: null,
    accessLevel: "helper",
  });
  const [isChecked, setIsChecked] = useState(false);

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
        <form className="user-info">
          <label htmlFor="userName">User Name:</label>
          <input
            className="user-input"
            type="text"
            name="userName"
            id="userName"
            value={formData.userName}
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
            value="accessLevel"
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
