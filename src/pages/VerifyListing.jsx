import { useEffect, useState } from "react";
import Logout from "../components/Logout";
import "../styles/Welcome.css";

function VerifyListing() {
  const [unverifiedAuthors, setUnverifiedAuthors] = useState([]);
  const apiAddress = import.meta.env.VITE_API_VERIFY_AUTHORS_ADDRESS;

  const filterAuthors = (authors) => {
    const authorsWithSites = [];

    for (let i = 0; i < authors.length; i++) {
      if (authors[i].website) {
        authorsWithSites.push(authors[i]);
      }
    }
    console.log(authorsWithSites);
    return authorsWithSites;
  };

  useEffect(() => {
    const fetchUnverifiedAuthors = async () => {
      try {
        const response = await fetch(apiAddress, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Bad Response");
        }

        const result = await response.json();
        
        setUnverifiedAuthors(filterAuthors(result.unverifiedAuthors));
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUnverifiedAuthors();
  }, []);

  return (
    <>
      <Logout />
      <h1 className="title">Verify Authors</h1>
      <h2 className="title">Currently there are {unverifiedAuthors.length} unverified authors.</h2>
      {unverifiedAuthors.length === 0 ? (
        <p>Thank you for helping keep our authors compliant with requirements for listing.</p>
      ) : (
        <p>Unverifed Authors Present</p>
      )}
    </>
  );
}

export default VerifyListing;
