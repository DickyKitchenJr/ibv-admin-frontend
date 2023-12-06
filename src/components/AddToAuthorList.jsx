import React, { useState } from "react";

const AddToAuthorList = () => {
  const [formData, setFormData] = useState({
    firstName: null,
    lastName: null,
    email: null,
    website: null,
    umbrellaGenre: [],
    subGenre: [],
    instagram: null,
    facebook: null,
    twitter: null,
    tiktok: null,
    goodreads: null,
    mastodon: null,
    amazonBio: null,
    threads: null,
    bookbub: null,
    bio: null,
    isVerified: false
  });
  const [additionalLink, setAdditionalLink] = useState({
    instagrambox: false,
    facebookbox: false,
    twitterbox: false,
    tiktokbox: false,
    threadsbox: false,
    mastodonbox: false,
    amazonbiobox: false,
    goodreadsbox: false,
    bookbubbox: false,
  });
  const [userChoice, setUserChoice] = useState("");

  const apiAddress = import.meta.env.VITE_API_ADDRESS_FOR_FORM;

  //handlers for firstName, lastName, email, and links

  // used to make sure there is only one empty line between sections in the bio
  const enforceSingleLineBreaks = (input) => {
    return input.replace(/\n{2,}/g, "\n\n");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // if the input is for bio use enforceSingleLineBreaks, otherwise just return the value
    const processedValue =
      name === "bio" ? enforceSingleLineBreaks(value) : value;

    setFormData({ ...formData, [name]: processedValue });
  };

  // genre handlers
  const handleGenreChange = (e) => {
    const genreValue = e.target.value;
    const updatedGenres = [...formData.umbrellaGenre];

    if (e.target.checked) {
      // If checkbox is checked, add the genre to the array
      updatedGenres.push(genreValue);
    } else {
      // If checkbox is unchecked, remove the genre from the array
      const genreIndex = updatedGenres.indexOf(genreValue);
      if (genreIndex !== -1) {
        updatedGenres.splice(genreIndex, 1);
      }
    }

    setFormData({ ...formData, umbrellaGenre: updatedGenres });
  };

  // subGenre handlers
  const handleAddSubGenre = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      subGenre: [...formData.subGenre, userChoice],
    });
    // clear userChoice
    setUserChoice("");
  };

  const handleRemoveSubGenre = (index) => {
    const updatedSubGenre = formData.subGenre.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      subGenre: updatedSubGenre,
    });
  };

  const handleUserChoice = (e) => {
    const { value } = e.target;
    setUserChoice(value);
  };

  // additional links handler
  const handleAdditionalLinksBox = (checkboxName) => {
    setAdditionalLink((prevLinks) => ({
      ...prevLinks,
      [checkboxName]: !prevLinks[checkboxName],
    }));
  };

  // isVerified handler
  const handleIsVerified = (e) => {
    const checked = e.target.checked;

    if(checked){
      setFormData({...formData, isVerified: true})
    }
    else{
      setFormData({...formData, isVerified: false})
    }
  }

  // submit handlers

  const socialMediaLink =
    formData.instagram ||
    formData.facebook ||
    formData.twitter ||
    formData.tiktok ||
    formData.threads ||
    formData.mastodon;

  const isInputValid = (name, value) => {
    switch (name) {
      case "firstName":
        return value.length > 0;
      case "lastName":
        return value.length > 0;
      case "email":
        return value.length > 0;
      case "bio":
        return value.length > 0;
      case "website":
      case "instagram":
      case "facebook":
      case "twitter":
      case "tiktok":
      case "goodreads":
      case "mastodon":
      case "amazonBio":
      case "threads":
      case "bookbub":
        // URL validation logic
        const urlRegex =
          /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?([^\s]*)?$/;
        return urlRegex.test(value);
      default:
        return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(
      "Your form is processing. Please be patient and do not exit this page. You will be redirected when the form successfully submits. Please click 'OK' and wait."
    );
    const isFirstNameValid = isInputValid("firstName", formData.firstName);
    const isLastNameValid = isInputValid("lastName", formData.lastName);
    const isEmailValid = isInputValid("email", formData.email);
    const isBioValid = isInputValid("bio", formData.bio);
    const isLinkURL =
      (!formData.website || isInputValid("website", formData.website)) &&
      (!formData.instagram || isInputValid("instagram", formData.instagram)) &&
      (!formData.facebook || isInputValid("facebook", formData.facebook)) &&
      (!formData.twitter || isInputValid("twitter", formData.twitter)) &&
      (!formData.tiktok || isInputValid("tiktok", formData.tiktok)) &&
      (!formData.threads || isInputValid("threads", formData.threads)) &&
      (!formData.mastodon || isInputValid("mastodon", formData.mastodon)) &&
      (!formData.amazonBio || isInputValid("amazonBio", formData.amazonBio)) &&
      (!formData.goodreads || isInputValid("goodreads", formData.goodreads)) &&
      (!formData.bookbub || isInputValid("bookbub", formData.bookbub));

    // Check if First Name contains a response
    if (!isFirstNameValid) {
      alert("Please enter a first name");
      return;
    }

    // Check if Last Name contains a response
    if (!isLastNameValid) {
      alert("Please enter a last name");
      return;
    }

    // Check if Email contains a response
    if (!isEmailValid) {
      alert("Please enter an email address");
      return;
    }

    // Check if at least one social media link is included
    if (!socialMediaLink) {
      alert(
        "Please include a link for at least one of the following: Instagram, Facebook, Twitter/X, TikTok, Threads, Mastodon"
      );
      return;
    }

    // Check if links are in valid URL format
    if (!isLinkURL) {
      alert("All links must be in a valid format (ex. https://linkname.com)");
      return;
    }

    // Check if at least one umbrellaGenre is selected
    if (formData.umbrellaGenre.length === 0) {
      alert("Please select at least one Umbrella Genre");
      return;
    }

    // Check if at least one subGenre is added
    if (formData.subGenre.length === 0) {
      alert("Please add at least one SubGenre");
      return;
    }

    // Check if Bio contains a response
    if (!isBioValid) {
      alert("Please enter a bio");
    }

    try {
      const response = await fetch(apiAddress, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // TODO: Handle successful submission
      } else {
        const responseBody = await response.json();

        if (response.status === 400) {
          // Handle specific error for 400 status (Bad Request)
          alert(responseBody.error);
        } else {
          // Handle other errors, e.g., show a generic error message to the user
          alert(
            "Form submission failed. Please recheck your information and try again"
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <p>Add Author To Listed Authors</p>

      {/* author application form */}
      <form onSubmit={handleSubmit}>
        <h2>Author Application</h2>

        {/* First Name Section*/}
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          
        />
        <br />
        {/* Last Name Section */}
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          
        />
        <br />
        {/* Email Section */}
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
          
        />
        <br />
        {/* Website Section */}
        <label htmlFor="website">Website:</label>
        <input
          type="text"
          name="website"
          id="website"
          value={formData.website}
          onChange={handleInputChange}
          
        />
        <br />
        {/* Umbrella Genre Section */}
        <label htmlFor="umbrellaGenre">Umbrella Genre:</label>
        <div id="umbrellaGenre">
          <div>
            <input
              type="checkbox"
              id="romance"
              name="umbrellaGenre"
              value="romance"
              checked={formData.umbrellaGenre.includes("romance")}
              onChange={handleGenreChange}
              
            />
            <label htmlFor="romance">Romance</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="fantasy"
              name="umbrellaGenre"
              value="fantasy"
              checked={formData.umbrellaGenre.includes("fantasy")}
              onChange={handleGenreChange}
              
            />
            <label htmlFor="fantasy">Fantasy</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="thriller"
              name="umbrellaGenre"
              value="thriller"
              checked={formData.umbrellaGenre.includes("thriller")}
              onChange={handleGenreChange}
              
            />
            <label htmlFor="thriller">Thriller</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="scifi"
              name="umbrellaGenre"
              value="scifi"
              checked={formData.umbrellaGenre.includes("scifi")}
              onChange={handleGenreChange}
              
            />
            <label htmlFor="scifi">Sci-Fi</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="childrens"
              name="umbrellaGenre"
              value="childrens"
              checked={formData.umbrellaGenre.includes("childrens")}
              onChange={handleGenreChange}
              
            />
            <label htmlFor="childrens">Children's</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="drama"
              name="umbrellaGenre"
              value="drama"
              checked={formData.umbrellaGenre.includes("drama")}
              onChange={handleGenreChange}
              
            />
            <label htmlFor="drama">Drama</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="horror"
              name="umbrellaGenre"
              value="horror"
              checked={formData.umbrellaGenre.includes("horror")}
              onChange={handleGenreChange}
              
            />
            <label htmlFor="horror">Horror</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="comedy"
              name="umbrellaGenre"
              value="comedy"
              checked={formData.umbrellaGenre.includes("comedy")}
              onChange={handleGenreChange}
              
            />
            <label htmlFor="comedy">Comedy</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="dystopian"
              name="umbrellaGenre"
              value="dystopian"
              checked={formData.umbrellaGenre.includes("dystopian")}
              onChange={handleGenreChange}
              
            />
            <label htmlFor="dystopian">Dystopian</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="nonfiction"
              name="umbrellaGenre"
              value="nonfiction"
              checked={formData.umbrellaGenre.includes("nonfiction")}
              onChange={handleGenreChange}
              
            />
            <label htmlFor="nonfiction">Non-Fiction</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="western"
              name="umbrellaGenre"
              value="western"
              checked={formData.umbrellaGenre.includes("western")}
              onChange={handleGenreChange}
              
            />
            <label htmlFor="western">Western</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="historicalfiction"
              name="umbrellaGenre"
              value="historicalfiction"
              checked={formData.umbrellaGenre.includes("historicalfiction")}
              onChange={handleGenreChange}
              
            />
            <label htmlFor="historicalfiction">Hist. Fict.</label>
          </div>
        </div>
        <br />
        {/* SubGenre section */}
        <label htmlFor="subGenre">SubGenre:</label>
        <div>
          <input
            type="text"
            name="subGenre"
            id="subGenre"
            value={userChoice}
            onChange={handleUserChoice}
            
          />
          {/* adds text to subGenre array */}
          <button onClick={handleAddSubGenre}>Add</button>
        </div>
        {/* display current subGenre array */}
        <p>Current SubGenres Selected:</p>
        <p>
          {formData.subGenre.map((subGenre, index) => (
            <span key={index}>
              {subGenre}&nbsp;
              {/* removes the selected item from the array */}
              <span
                // TODO: convert style to external css
                style={{
                  cursor: "pointer",
                  color: "red",
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                }}
                onClick={() => handleRemoveSubGenre(index)}
              >
                -
              </span>
              &nbsp;
            </span>
          ))}
        </p>
        <br />
        {/* Bio section */}
        <label htmlFor="bio">Bio:</label>
        <textarea
          name="bio"
          id="bio"
          rows="10"
          cols="30"
          value={formData.bio}
          onChange={handleInputChange}
          
        />
        <br />
        {/* Additional Links section */}
        <label htmlFor="additionalLinks">Additional Links:</label>
        <div id="additionalLinks">
          <div>
            <input
              type="checkbox"
              id="instagrambox"
              onChange={() => handleAdditionalLinksBox("instagrambox")}
              checked={additionalLink.instagrambox}
              
            />
            <label htmlFor="instagrambox">Instagram</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="facebookbox"
              onChange={() => handleAdditionalLinksBox("facebookbox")}
              checked={additionalLink.facebookbox}
              
            />
            <label htmlFor="facebookbox">Facebook</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="twitterbox"
              onChange={() => handleAdditionalLinksBox("twitterbox")}
              checked={additionalLink.twitterbox}
              
            />
            <label htmlFor="twitterbox">Twitter/X</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="tiktokbox"
              onChange={() => handleAdditionalLinksBox("tiktokbox")}
              checked={additionalLink.tiktokbox}
              
            />
            <label htmlFor="tiktokbox">TikTok</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="threadsbox"
              onChange={() => handleAdditionalLinksBox("threadsbox")}
              checked={additionalLink.threadsbox}
              
            />
            <label htmlFor="threadsbox">Threads</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="mastodonbox"
              onChange={() => handleAdditionalLinksBox("mastodonbox")}
              checked={additionalLink.mastodonbox}
              
            />
            <label htmlFor="mastodonbox">Mastodon</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="amazonbiobox"
              onChange={() => handleAdditionalLinksBox("amazonbiobox")}
              checked={additionalLink.amazonbiobox}
              
            />
            <label htmlFor="amazonbiobox">Amazon Author Page</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="goodreadsbox"
              onChange={() => handleAdditionalLinksBox("goodreadsbox")}
              checked={additionalLink.goodreadsbox}
              
            />
            <label htmlFor="goodreadsbox">Goodreads</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="bookbubbox"
              onChange={() => handleAdditionalLinksBox("bookbubbox")}
              checked={additionalLink.bookbubbox}
              
            />
            <label htmlFor="bookbubbox">BookBub</label>
          </div>
        </div>
        <br />
        {additionalLink.instagrambox ? (
          <>
            <label htmlFor="instagram">Instagram:</label>
            <input
              type="text"
              name="instagram"
              id="instagram"
              value={formData.instagram}
              onChange={handleInputChange}
            />
            <br />
          </>
        ) : null}
        {additionalLink.facebookbox ? (
          <>
            <label htmlFor="facebook">Facebook:</label>
            <input
              type="text"
              name="facebook"
              id="facebook"
              value={formData.facebook}
              onChange={handleInputChange}
            />
            <br />
          </>
        ) : null}
        {additionalLink.twitterbox ? (
          <>
            <label htmlFor="twitter">Twitter/X:</label>
            <input
              type="text"
              name="twitter"
              id="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
            />
            <br />
          </>
        ) : null}
        {additionalLink.tiktokbox ? (
          <>
            <label htmlFor="tiktok">TikTok:</label>
            <input
              type="text"
              name="tiktok"
              id="tiktok"
              value={formData.tiktok}
              onChange={handleInputChange}
            />
            <br />
          </>
        ) : null}
        {additionalLink.threadsbox ? (
          <>
            <label htmlFor="threads">Threads:</label>
            <input
              type="text"
              name="threads"
              id="threads"
              value={formData.threads}
              onChange={handleInputChange}
            />
            <br />
          </>
        ) : null}
        {additionalLink.mastodonbox ? (
          <>
            <label htmlFor="mastodon">Mastodon:</label>
            <input
              type="text"
              name="mastodon"
              id="mastodon"
              value={formData.mastodon}
              onChange={handleInputChange}
            />
            <br />
          </>
        ) : null}
        {additionalLink.amazonbiobox ? (
          <>
            <label htmlFor="amazonBio">Amazon Author Page:</label>
            <input
              type="text"
              name="amazonBio"
              id="amazonBio"
              value={formData.amazonBio}
              onChange={handleInputChange}
            />
            <br />
          </>
        ) : null}
        {additionalLink.goodreadsbox ? (
          <>
            <label htmlFor="goodreads">Goodreads:</label>
            <input
              type="text"
              name="goodreads"
              id="goodreads"
              value={formData.goodreads}
              onChange={handleInputChange}
            />
            <br />
          </>
        ) : null}
        {additionalLink.bookbubbox ? (
          <>
            <label htmlFor="bookbub">BookBub:</label>
            <input
              type="text"
              name="bookbub"
              id="bookbub"
              value={formData.bookbub}
              onChange={handleInputChange}
            />
            <br />
          </>
        ) : null}
        <label htmlFor="isVerified">Completed Requirements?</label>
        <input type="checkbox" onChange={handleIsVerified} id="isVerified"/>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default AddToAuthorList;
