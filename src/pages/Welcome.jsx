import { NavLink } from "react-router-dom";
import "../styles/Welcome.css";

function Welcome({loggedIn}) {
  return (
    <>
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
