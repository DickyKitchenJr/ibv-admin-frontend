import { useEffect, useState, useContext } from "react";
import Logout from "../components/Logout";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { ConvertBio } from "../components/ConvertBio";
import "../styles/Pages.css";

function ProcessNewAuthors() {
  const { userAccessLevel } = useContext(AuthContext);
  const [pendingAuthors, setPendingAuthors] = useState([]);
  const apiAddress = import.meta.env.VITE_API_PENDING_AUTHORS_ADDRESS;

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
        //result returns an object with a success message and an array of objects called awaitingAuthors

        const adjustRawListings = (arrayOfAuthorObjects) => {
          //create empty array to populate finished list of objects
          const adjustedListings = [];
          //go into the array
          for (let i = 0; i < arrayOfAuthorObjects.length; i++) {
            //copy original object
            const author = arrayOfAuthorObjects[i];
            //convert JSON string to array for umbrellaGenre and subGenre
            const parseUmbrellaGenre = JSON.parse(author.umbrellaGenre);
            const parseSubGenre = JSON.parse(author.subGenre);
            //replace previous values with parsed values
            author.umbrellaGenre = parseUmbrellaGenre;
            author.subGenre = parseSubGenre;
            //add adjusted listing to adjustedListings array
            adjustedListings.push(author);
          }
          return adjustedListings;
        };

        //assign adjusted results for awaitingAuthors array to finalResult
        const finalResult = adjustRawListings(result.awaitingAuthors);

        setPendingAuthors(finalResult);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPendingAuthors();
  }, []);

  const properUmbrellaGenreName = (genreValue) => {
    switch (genreValue) {
      case "romance":
        return "Romance";
      case "fantasy":
        return "Fantasy";
      case "thriller":
        return "Thriller";
      case "scifi":
        return "Sci-Fi";
      case "childrens":
        return "Children's";
      case "drama":
        return "Drama";
      case "horror":
        return "Horror";
      case "comedy":
        return "Comedy";
      case "dystopian":
        return "Dystopian";
      case "nonfiction":
        return "Non-Fiction";
      case "western":
        return "Western";
      case "historicalfiction":
        return "Hist. Fict.";
      default:
        return "Not Found";
    }
  };

  const unauthorizedUser = () => {
    if (userAccessLevel !== "admin" && userAccessLevel !== "helper") {
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

      <h1 className="title">Process Author Applications</h1>
      <h2 className="title">
        Currently there are {pendingAuthors.length} authors in the queue
      </h2>
      {pendingAuthors.length === 0 ? (
        <main className="main">
          <p className="author-info">
            Thank you for helping keep our list empty.
          </p>
        </main>
      ) : (
        <main className="main">
          <div className="author-info">
            <p className="center-text">
              Verify Accuracy Of All Links And That Author Has Published Work
            </p>
            <br />
            <p>
              Name: {pendingAuthors[0].firstName} {pendingAuthors[0].lastName}
            </p>
            <p>Email: {pendingAuthors[0].email}</p>
            {pendingAuthors[0].website ? (
              <p>
                Website:{" "}
                <a href={pendingAuthors[0].website}>
                  {pendingAuthors[0].website}
                </a>
              </p>
            ) : (
              <p>No Website Found. Verify Membership Before Continuing.</p>
            )}
            <p>
              Umbrella Genre:{" "}
              {pendingAuthors[0].umbrellaGenre.map((genres, index, array) => (
                <span key={index}>
                  {properUmbrellaGenreName(genres)}
                  {index !== array.length - 1 && ", "}
                </span>
              ))}
            </p>
            <p>
              Subgenre:{" "}
              {pendingAuthors[0].subGenre.map((genres, index, array) => (
                <span key={index}>
                  {genres}
                  {index !== array.length - 1 && ", "}
                </span>
              ))}
            </p>
            {!pendingAuthors[0].instagram ? null : (
              <p>
                Instagram:{" "}
                <a href={pendingAuthors[0].instagram}>
                  {pendingAuthors[0].instagram}
                </a>
              </p>
            )}
            {!pendingAuthors[0].facebook ? null : (
              <p>
                Facebook:{" "}
                <a href={pendingAuthors[0].facebook}>
                  {pendingAuthors[0].facebook}
                </a>
              </p>
            )}
            {!pendingAuthors[0].twitter ? null : (
              <p>
                Twitter:{" "}
                <a href={pendingAuthors[0].twitter}>
                  {pendingAuthors[0].twitter}
                </a>
              </p>
            )}
            {!pendingAuthors[0].tiktok ? null : (
              <p>
                TikTok:{" "}
                <a href={pendingAuthors[0].tiktok}>
                  {pendingAuthors[0].tiktok}
                </a>
              </p>
            )}
            {!pendingAuthors[0].threads ? null : (
              <p>
                Threads:{" "}
                <a href={pendingAuthors[0].threads}>
                  {pendingAuthors[0].threads}
                </a>
              </p>
            )}
            {!pendingAuthors[0].mastodon ? null : (
              <p>
                Mastodon:{" "}
                <a href={pendingAuthors[0].mastodon}>
                  {pendingAuthors[0].mastodon}
                </a>
              </p>
            )}
            {!pendingAuthors[0].amazonBio ? null : (
              <p>
                Amazon Author Page:{" "}
                <a href={pendingAuthors[0].amazonBio}>
                  {pendingAuthors[0].amazonBio}
                </a>
              </p>
            )}
            {!pendingAuthors[0].goodreads ? null : (
              <p>
                Goodreads:{" "}
                <a href={pendingAuthors[0].goodreads}>
                  {pendingAuthors[0].goodreads}
                </a>
              </p>
            )}
            {!pendingAuthors[0].bookbub ? null : (
              <p>
                BookBub:{" "}
                <a href={pendingAuthors[0].bookbub}>
                  {pendingAuthors[0].bookbub}
                </a>
              </p>
            )}
            <p>Bio: {ConvertBio(pendingAuthors[0].bio)}</p>
          </div>
          <form className="author-info">Place Saver</form>
        </main>
      )}
    </>
  );
}

export default ProcessNewAuthors;
