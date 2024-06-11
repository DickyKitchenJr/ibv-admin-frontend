import Logout from "../components/Logout";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { useContext, useState, useEffect } from "react";
import "../styles/Pages.css";

function AllAuthors() {
  const { userAccessLevel } = useContext(AuthContext);
  const [allAuthors, setAllAuthors] = useState([]);
  const apiAllAuthorsAddress = import.meta.env.VITE_API_ALL_AUTHORS_ADDRESS;
  const apiAllAuthorsAdminAddress =
    import.meta.env.VITE_API_ALL_AUTHORS_ADMIN_ADDRESS;

  const apiAddress =
    userAccessLevel === "admin"
      ? apiAllAuthorsAdminAddress
      : apiAllAuthorsAddress;

  const unauthorizedUser = () => {
    if (userAccessLevel !== "admin" && userAccessLevel !== "helper") {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const fetchData = (url) => {
      fetch(url, {method:"GET", credentials: "include"})
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Bad Response: ${response.status}`);
          }
          return response.json();
        })
        .then((dataFetched) => {
          setAllAuthors(dataFetched.authors);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    fetchData(apiAddress);
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

      <h1 className="title">All Authors</h1>
      <h2 className="title">
        Currently there are {allAuthors.length} authors on IBV.
      </h2>

      <main className="main">
        {allAuthors.map((author) => {
        return (
          <>
            <p>
              &#123;
              <br />
              firstName: &#34;{author.firstName}&#34;,
              <br />
              lastName: &#34;{author.lastName}&#34;,
              <br />
              {author.website ? (
                <>
                  website: &#34;{author.website}&#34;,
                  <br />
                </>
              ) : null}
              umbrellaGenre: {author.umbrellaGenre}
              ,
              <br />
              subGenre: {author.subGenre}
              ,
              <br />
              {author.instagram ? (
                <>
                  instagram: &#34;{author.instagram}&#34;,
                  <br />
                </>
              ) : null}
              {author.facebook ? (
                <>
                  facebook: &#34;{author.facebook}&#34;,
                  <br />
                </>
              ) : null}
              {author.twitter ? (
                <>
                  twitter: &#34;{author.twitter}&#34;,
                  <br />
                </>
              ) : null}
              {author.tiktok ? (
                <>
                  tiktok: &#34;{author.tiktok}&#34;,
                  <br />
                </>
              ) : null}
              {author.goodreads ? (
                <>
                  goodreads: &#34;{author.goodreads}&#34;,
                  <br />
                </>
              ) : null}
              {author.mastodon ? (
                <>
                  mastodon: &#34;{author.mastodon}&#34;,
                  <br />
                </>
              ) : null}
              {author.amazonBio ? (
                <>
                  amazonBio: &#34;{author.amazonBio}&#34;,
                  <br />
                </>
              ) : null}
              {author.threads ? (
                <>
                  threads: &#34;{author.threads}&#34;,
                  <br />
                </>
              ) : null}
              {author.bookbub ? (
                <>
                  bookbub: &#34;{author.bookbub}&#34;,
                  <br />
                </>
              ) : null}
              bio: {JSON.stringify(author.bio)},
              <br />
              &#125;,
            </p>
          </>
        );
      })}
      </main>
    </>
  );
}

export default AllAuthors;
