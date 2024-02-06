import Logout from "../components/Logout";
import "../styles/Pages.css";
import { NavLink } from "react-router-dom";

function DeleteAuthors() {
  return (
    <>
      <nav className="top-bar">
        <NavLink to="/welcome" className="back">
          &#129092; Back
        </NavLink>
        <Logout />
      </nav>

      <h1 className="title">Delete Authors</h1>
    </>
  );
}

export default DeleteAuthors;
