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

  const handleCheckbox = (e) => {
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
    </>
  );
}

export default AddUsers;
