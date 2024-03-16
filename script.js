"use strict";

//Variables relating to the modalWindow
const modalWindow = document.querySelector(".modalFadeWindow");
const addBookButton = document.getElementById("addBookButton");
const modalTitle = document.getElementById("inputBookTitle");
const modalAuthor = document.getElementById("inputBookAuthor");
const modalBookRating = document.getElementById("inputBookRating");
const modalBookReadStatus = document.getElementsByName("bookReadStatus");
const modalSaveButton = document.getElementById("addBookModalSaveButton");
const modalCancelButton = document.getElementById("addBookModalCancelButton");

//Variables related to the library display card
const mainLibrarySection = document.querySelector(".librarySection");
const emptyLibrary = document.querySelector(".emptyLibrary");
let emptyLibraryHTML;
let userStarRating = 0;
let selectedValue;

//Variables related to rest of the HTML body sections
const headerSection = document.querySelector(".header");
const footerSection = document.querySelector(".footer");

//Function for modalWindow appearance
addBookButton.addEventListener("click", modalOpen);
function modalOpen() {
  modalWindow.style.visibility = "visible";
  headerSection.style.opacity = "0.3";
  mainLibrarySection.style.opacity = "0.3";
  footerSection.style.opacity = "0.3";
}

/*A function where a whole bunch of stuff happens after clicking save,
depending on modalWindow current state */
modalSaveButton.addEventListener("click", function () {
  const title = modalTitle.value.trim();
  const author = modalAuthor.value.trim();

  if (title === "" || author === "") {
    e.preventDefault();
  } else {
    addBookToLibraryArray();
    resetModalWindow();
    modalWindow.style.visibility = "hidden";
    headerSection.style.opacity = "1.0";
    mainLibrarySection.style.opacity = "1.0";
    footerSection.style.opacity = "1.0";
    if (emptyLibraryHTML) {
      const emptyLibraryElement =
        mainLibrarySection.querySelector(".emptyLibrary");
      if (emptyLibraryElement) {
        emptyLibraryElement.remove();
      }
    }
  }
});

//Function for the cancel button - self-explanatory
modalCancelButton.addEventListener("click", function () {
  resetModalWindow();
  modalWindow.style.visibility = "hidden";
  headerSection.style.opacity = "1.0";
  mainLibrarySection.style.opacity = "1.0";
  footerSection.style.opacity = "1.0";
});

//Function that's called back inside of the modalCancelButton event listener
function resetModalWindow() {
  modalTitle.value = "";
  modalAuthor.value = "";

  modalBookReadStatus.forEach((radio) => {
    radio.checked = false;
  });

  const stars = document.querySelectorAll(".ratingStar");
  stars.forEach((star) => {
    star.classList.remove("selected");
  });
  userStarRating = 0;
}

// Function to update the current display of each library card if the user is deleting the cards
function updateLibraryDisplay() {
  if (userLibraryArray.length === 0) {
    mainLibrarySection.innerHTML = "";
    emptyLibraryHTML = `
    <div class="librarySection">
      <div class="emptyLibrary">
        <!-- Appears if the user hasn't logged any books -->
        <div class="emptyLibraryHeader">
          <h2 class="libraryTitle">Your reading list is empty!</h2>
        </div>
        <div class="emptyLibrarySubtext">
          <p class="librarySubtext">
            Click the "Add Book" button above to save a new book.
          </p>
        </div>
      </div>
    </div>
  `;
    mainLibrarySection.insertAdjacentHTML("beforeend", emptyLibraryHTML);
  } else {
    mainLibrarySection.innerHTML = "";
    userLibraryArray.forEach(function (book, index) {
      book.index = index;
      createBook(book);
    });
  }
}

//Where each library card the user adds is stored
const userLibraryArray = [];

//Constructor function to create new objects for every book the user adds
function Book(index, title, author, bookRating, bookReadStatus) {
  this.index = index;
  this.title = title;
  this.author = author;
  this.bookRating = bookRating;
  this.bookReadStatus = bookReadStatus;
}

//Function to store the user book data and then shove it into an array and a new object(?)
function addBookToLibraryArray() {
  let title = modalTitle.value;
  let author = modalAuthor.value;
  let rating = userStarRating;
  let bookReadStatus = getSelectedBookStatus();

  let index = userLibraryArray.length;

  let book = new Book(index, title, author, rating, bookReadStatus);
  userLibraryArray.push(book);
  createBook(book);
  userStarRating = 0;
  console.log(userLibraryArray);
}

//Function that uses DOM manipulation to create each library card from data inside each object instance
function createBook(book) {
  let libraryBooks = document.createElement("div");
  libraryBooks.classList.add("book");

  const starSVG = `
  <svg width="24" height="24">
    <path
      d="M24 9.63469C24 9.35683 23.7747 9.13158 23.4969 9.13158H15.0892L12.477 1.34327C12.4269 1.19375 12.3095 1.0764 12.16 1.02625C11.8966 0.937894 11.6114 1.07983 11.523 1.34327L8.91088 9.13158H0.503157C0.33975 9.13158 0.186521 9.21094 0.0922364 9.3444C-0.0680877 9.57134 -0.0140806 9.88529 0.212865 10.0456L7.00408 14.8432L4.40172 22.6166C4.35092 22.7683 4.37534 22.9352 4.46749 23.066C4.6275 23.2932 4.94137 23.3476 5.16853 23.1876L12 18.3758L18.8317 23.183C18.9625 23.2751 19.1293 23.2994 19.281 23.2486C19.5445 23.1604 19.6865 22.8752 19.5983 22.6117L16.996 14.8432L23.7872 10.0456C23.9206 9.95133 24 9.7981 24 9.63469Z"
    ></path>
  </svg>
`;

  const starsHTML = Array.from({ length: book.bookRating }, () => starSVG).join(
    ""
  );

  libraryBooks.innerHTML = `
<div class="libraryPlaceHolderCard">
    <div class="card">
        <div class="cardBody">
            <h4>${book.title}</h4>
            <p>${book.author}</p>
            <div class="bookRatingStars--small">
            ${starsHTML}
            </div>
            <div class="cardFooter">
        <span class="libraryCardFooter">Status: ${book.bookReadStatus}</span>
        </div>      
        <button type="button" class="btnCardDelete">Delete</button>
      </div>
    </div>
</div> `;
  emptyLibrary.style.display = "none";
  mainLibrarySection.appendChild(libraryBooks);

  const deleteButton = libraryBooks.querySelector(".btnCardDelete");
  deleteButton.addEventListener("click", function () {
    userLibraryArray.splice(book.index, 1);
    updateLibraryDisplay();
  });
}

//Function for user clicking the star ratings in modalWindow
function rate(starCount) {
  const stars = document.querySelectorAll(".ratingStar");

  userStarRating = starCount;

  stars.forEach((star, index) => {
    const svg = star.querySelector("svg");

    if (index < starCount) {
      star.classList.add("selected");
    } else {
      star.classList.remove("selected");
    }
  });
}

// Function for tracking "finished" or "still reading" button - called inside addBookToLibraryArray()
function getSelectedBookStatus() {
  modalBookReadStatus.forEach((radio) => {
    if (radio.checked) {
      selectedValue = radio.id;
    }
  });
  return selectedValue;
}
