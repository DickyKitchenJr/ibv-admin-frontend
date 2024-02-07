import { useEffect, useState } from "react";
import Logout from "../components/Logout";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";
import "../styles/Pages.css";

function ProcessNewAuthors() {
  const { userAccessLevel } = useContext(AuthContext);
  const [pendingAuthors, setPendingAuthors] = useState([]);
  const apiAddress = import.meta.env.VITE_API_PENDING_AUTHORS_ADDRESS;

  const unauthorizedUser = () => {
    if (userAccessLevel !== "admin" && userAccessLevel !== "helper") {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const fetchPendingAuthors = async () => {
      try {
        const response = await fetch(apiAddress, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Bad Response");
        }

        const result = await response.json();
        setPendingAuthors(result.awaitingAuthors);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPendingAuthors();
  }, []);

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

      <h1 className="title">Process Author Applications</h1>
      <h2 className="title">
        Currently there are {pendingAuthors.length} authors in the queue
      </h2>
      {pendingAuthors.length === 0 ? (
        <p>Thank you for helping keep our list empty.</p>
      ) : (
        <p>Authors waiting for processing</p>
      )}
    </>
  );
}

export default ProcessNewAuthors;
