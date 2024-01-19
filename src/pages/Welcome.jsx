import { NavLink } from "react-router-dom";
import "../styles/Welcome.css";
import Logout from "../components/Logout";

function Welcome() {
  return (
    <>
      <Logout />
      <h1 className="title">Welcome To The Inner Vault</h1>
      <h2 className="title">How Would You Like To Help?</h2>
      <main className="welcome">
        <NavLink to="/addauthors" className="welcome-tab">
          Process Applications
        </NavLink>
        <NavLink to="/modify" className="welcome-tab">
          Modify Listing
        </NavLink>
        <NavLink to="/verify" className="welcome-tab">
          Verify Listings
        </NavLink>
      </main>
    </>
  );
}

export default Welcome;
