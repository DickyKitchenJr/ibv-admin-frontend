import Logout from "../components/Logout";
import "../styles/Pages.css";
import { NavLink } from "react-router-dom";

function AddUsers() {
  return (
    <>
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
