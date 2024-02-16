import { useEffect, useState } from "react";
import Logout from "../components/Logout";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";
import "../styles/Pages.css";

function VerifyListing() {
  const { userAccessLevel } = useContext(AuthContext);
  const [unverifiedAuthors, setUnverifiedAuthors] = useState([]);
  const [listingIndex, setListingIndex] = useState(0);
  const apiVerifyAddress = import.meta.env.VITE_API_VERIFY_AUTHORS_ADDRESS;
  const apiUpdateAddress = import.meta.env.VITE_API_MODIFY_AUTHORS_ADDRESS;

  const unauthorizedUser = () => {
    if (userAccessLevel !== "admin" && userAccessLevel !== "helper") {
      window.location.href = "/";
    }
  };

  const handleNoButton = () => {
    //progress to next author
    setListingIndex(listingIndex + 1);
  };

  const handleYesButton = async (authorEmail) => {
    const data = { isVerified: true };
    // fetch request to update isVerified to true
    try {
      const response = await fetch(apiUpdateAddress + `/${authorEmail}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        //remove author from list
        const newList = unverifiedAuthors.filter(
          (author) => author.email !== authorEmail
        );
        setUnverifiedAuthors(newList);
        //progress to next author
        setListingIndex(listingIndex + 1);
        //inform user that request was successful
        alert(
          `${result.author.firstName} ${result.author.lastName} is now verified as compliant with requirements. Thank you.`
        );
      } else {
        alert("Listing did not update");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filterAuthors = (authors) => {
    const authorsWithSites = [];
    //only return authors with websites
    for (let i = 0; i < authors.length; i++) {
      if (authors[i].website) {
        authorsWithSites.push(authors[i]);
      }
    }
    return authorsWithSites;
  };

  useEffect(() => {
    const fetchUnverifiedAuthors = async () => {
      try {
        const response = await fetch(apiVerifyAddress, {
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
      {/* check if user is authorized, and if not deny access and send them to the login */}
      {unauthorizedUser()}

      <nav className="top-bar">
        <NavLink to="/welcome" className="back">
          &#129092; Back
        </NavLink>
        <Logout />
      </nav>

      <h1 className="title">Verify Authors</h1>
      <h2 className="title">
        Currently there are {unverifiedAuthors.length} unverified authors.
      </h2>
      {unverifiedAuthors.length === 0 ? (
        <main className="main">
          <p className="author-info">
            Thank you for helping keep our authors compliant with requirements
            for listing.
          </p>
        </main>
      ) : (
        <main className="main">
          {listingIndex === unverifiedAuthors.length ? (
            <h3 className="author-info">
              You have viewed all unverified authors. Thank you.
            </h3>
          ) : (
            <>
              {" "}
              {unverifiedAuthors.map((author) => {
                return (
                  <>
                    {unverifiedAuthors[listingIndex].email === author.email ? (
                      <div key={author.id} className="author-info">
                        <p>
                          Is there an easy to find and clearly labeled link to
                          Indie Book Vault's website on this author's site?
                        </p>
                        <br />
                        <p className="spacer">
                          Name: {author.firstName} {author.lastName}
                        </p>
                        <p className="spacer">
                          Website:{" "}
                          <a
                            href={author.website}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {author.website}
                          </a>
                        </p>
                        <p className="spacer">Email: {author.email}</p>
                        <div className="spacer">
                          <p>Links:</p>
                          <div className="additional-links">
                            {!author.instagram ? null : (
                              <a
                                href={author.instagram}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Instagram
                              </a>
                            )}
                            {!author.facebook ? null : (
                              <a
                                href={author.facebook}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Facebook
                              </a>
                            )}
                            {!author.twitter ? null : (
                              <a
                                href={author.twitter}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Twitter/X
                              </a>
                            )}
                            {!author.tiktok ? null : (
                              <a
                                href={author.tiktok}
                                target="_blank"
                                rel="noreferrer"
                              >
                                TikTok
                              </a>
                            )}
                            {!author.threads ? null : (
                              <a
                                href={author.threads}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Threads
                              </a>
                            )}
                            {!author.mastodon ? null : (
                              <a
                                href={author.mastodon}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Mastodon
                              </a>
                            )}
                            {!author.amazonBio ? null : (
                              <a
                                href={author.amazonBio}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Amazon Author Page
                              </a>
                            )}
                            {!author.goodreads ? null : (
                              <a
                                href={author.goodreads}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Goodreads
                              </a>
                            )}
                            {!author.bookbub ? null : (
                              <a
                                href={author.bookbub}
                                target="_blank"
                                rel="noreferrer"
                              >
                                BookBub
                              </a>
                            )}
                          </div>
                        </div>

                        <p>Listed on: {author.createdAt}</p>
                        <br />
                        <p className="attention">
                          If author's listing is older than 7 days and author
                          does not meet requirements, please email author's
                          information to Indie Book Vault.
                        </p>
                        <br />
                        <p>
                          Does author meet requirements?{" "}
                          <span className="button-mobile-size">
                            <button
                              className="button"
                              onClick={() => handleYesButton(author.email)}
                            >
                              Yes
                            </button>{" "}
                            <button className="button" onClick={handleNoButton}>
                              No
                            </button>
                          </span>
                        </p>
                      </div>
                    ) : null}
                  </>
                );
              })}{" "}
            </>
          )}
        </main>
      )}
    </>
  );
}

export default VerifyListing;
