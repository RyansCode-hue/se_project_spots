import {
  enableValidation,
  resetFormErrors,
  disableSubmitButton,
  settings,
} from "../scripts/validation.js";
import "./index.css";
import Api from "../utils/Api.js";
import Card from "../components/Card.js";

// Import images so webpack processes them
import logoSrc from "../images/logo.svg";
import pencilSrc from "../images/pencil.svg";
import plusSrc from "../images/plus.svg";
import closeIconSrc from "../images/CloseIcon.svg";
import closeIconPWSrc from "../images/CloseIcon-PW.svg";

// Initialize API
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "0c5ccde0-45b3-42ed-ba10-2bb2d2b6f51b",
    "Content-Type": "application/json",
  },
});

// DOM Elements
const cardsList = document.querySelector(".cards__list");
const profileNameEl = document.querySelector(".profile__name");
const profileBioEl = document.querySelector(".profile__bio");
const profileImageEl = document.querySelector(".profile__image");

// Set static image sources from webpack imports
document.querySelector(".header__logo").src = logoSrc;
document.querySelector(".profile__edit-button img").src = pencilSrc;
document.querySelector(".profile__add-button img").src = plusSrc;
document.querySelector(".profile__image-edit-button img").src = pencilSrc;

const closeButtons = document.querySelectorAll(".modal__close-button img");
closeButtons.forEach((btn) => {
  if (btn.closest("#preview-modal")) {
    btn.src = closeIconPWSrc;
  } else {
    btn.src = closeIconSrc;
  }
});

// Preview Modal
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button"
);
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

// Edit Profile Modal
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileBioInput =
  editProfileModal.querySelector("#profile-bio-input");
const editProfileSubmitButton = editProfileForm.querySelector(".modal__save-button");

// New Post Modal
const newPostButton = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostForm = newPostModal.querySelector(".modal__form");
const postLinkInput = newPostModal.querySelector("#post-link-input");
const postCaptionInput = newPostModal.querySelector("#post-caption-input");
const newPostSubmitButton = newPostForm.querySelector(".modal__save-button");

// Delete Card Modal
const deleteCardModal = document.querySelector("#delete-card-modal");
const deleteCardCloseButton = deleteCardModal.querySelector(
  ".modal__close-button"
);
const deleteCardForm = document.querySelector("#delete-card-form");
const deleteCardSubmitButton = deleteCardForm.querySelector(".modal__save-button");

// Update Avatar Modal
const updateAvatarButton = document.querySelector(".profile__image-edit-button");
const updateAvatarModal = document.querySelector("#update-avatar-modal");
const updateAvatarCloseButton = updateAvatarModal.querySelector(
  ".modal__close-button"
);
const updateAvatarForm = updateAvatarModal.querySelector(".modal__form");
const avatarLinkInput = updateAvatarModal.querySelector("#avatar-link-input");
const updateAvatarSubmitButton = updateAvatarForm.querySelector(".modal__save-button");

// Variables for delete confirmation
let selectedCard;
let selectedCardId;

// Modal Open/Close Functions
function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

// Close modal on Escape key
function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

// Close modal when clicking outside the modal container
const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("mousedown", function (evt) {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});

// Helper function to render loading state
function renderLoading(button, isLoading, loadingText = "Saving...") {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = button.dataset.originalText || "Save";
  }
}

// Card Handlers
function handleImageClick(data) {
  previewImage.src = data.link;
  previewImage.alt = data.name;
  previewCaption.textContent = data.name;
  openModal(previewModal);
}

function handleDeleteClick(card) {
  selectedCard = card;
  selectedCardId = card.getId();
  openModal(deleteCardModal);
}

function handleLikeClick(card) {
  const isLiked = card.isLiked();
  const likeAction = isLiked ? api.dislikeCard(card.getId()) : api.likeCard(card.getId());
  
  likeAction
    .then(() => {
      card.setIsLiked(!isLiked);
    })
    .catch((err) => {
      console.error("Error toggling like:", err);
    });
}

// Create card function
function createCard(cardData) {
  const card = new Card(
    cardData,
    "#card-template",
    handleImageClick,
    handleDeleteClick,
    handleLikeClick
  );
  return card.generateCard();
}

// Delete Card Handler
function handleDeleteSubmit(evt) {
  evt.preventDefault();
  renderLoading(deleteCardSubmitButton, true, "Deleting...");
  
  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.removeCard();
      closeModal(deleteCardModal);
    })
    .catch((err) => {
      console.error("Error deleting card:", err);
    })
    .finally(() => {
      renderLoading(deleteCardSubmitButton, false, "Yes");
      deleteCardSubmitButton.dataset.originalText = "Yes";
    });
}

// Edit Profile Handler
function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  renderLoading(editProfileSubmitButton, true);
  editProfileSubmitButton.dataset.originalText = "Save";
  
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileBioInput.value,
    })
    .then((userData) => {
      profileNameEl.textContent = userData.name;
      profileBioEl.textContent = userData.about;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error("Error updating profile:", err);
    })
    .finally(() => {
      renderLoading(editProfileSubmitButton, false);
    });
}

// New Post Handler
function handleNewPostSubmit(evt) {
  evt.preventDefault();
  renderLoading(newPostSubmitButton, true);
  newPostSubmitButton.dataset.originalText = "Save";
  
  api
    .addCard({
      name: postCaptionInput.value,
      link: postLinkInput.value,
    })
    .then((cardData) => {
      const cardElement = createCard(cardData);
      cardsList.prepend(cardElement);
      newPostForm.reset();
      closeModal(newPostModal);
      resetFormErrors(newPostForm);
      disableSubmitButton(newPostForm);
    })
    .catch((err) => {
      console.error("Error adding card:", err);
    })
    .finally(() => {
      renderLoading(newPostSubmitButton, false);
    });
}

// Update Avatar Handler
function handleUpdateAvatarSubmit(evt) {
  evt.preventDefault();
  renderLoading(updateAvatarSubmitButton, true);
  updateAvatarSubmitButton.dataset.originalText = "Save";
  
  api
    .updateAvatar({
      avatar: avatarLinkInput.value,
    })
    .then((userData) => {
      profileImageEl.src = userData.avatar;
      closeModal(updateAvatarModal);
      updateAvatarForm.reset();
      resetFormErrors(updateAvatarForm);
      disableSubmitButton(updateAvatarForm);
    })
    .catch((err) => {
      console.error("Error updating avatar:", err);
    })
    .finally(() => {
      renderLoading(updateAvatarSubmitButton, false);
    });
}

// Edit Profile Button Click
editProfileButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileBioInput.value = profileBioEl.textContent;
  openModal(editProfileModal);
  resetFormErrors(editProfileForm);
});

// New Post Button Click
newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

// Update Avatar Button Click
updateAvatarButton.addEventListener("click", function () {
  openModal(updateAvatarModal);
});

// Close Button Event Listeners
editProfileCloseButton.addEventListener("click", () =>
  closeModal(editProfileModal)
);
newPostCloseButton.addEventListener("click", () => closeModal(newPostModal));
deleteCardCloseButton.addEventListener("click", () =>
  closeModal(deleteCardModal)
);
updateAvatarCloseButton.addEventListener("click", () =>
  closeModal(updateAvatarModal)
);
previewModalCloseButton.addEventListener("click", () =>
  closeModal(previewModal)
);

// Form Submit Event Listeners
editProfileForm.addEventListener("submit", handleEditProfileSubmit);
newPostForm.addEventListener("submit", handleNewPostSubmit);
deleteCardForm.addEventListener("submit", handleDeleteSubmit);
updateAvatarForm.addEventListener("submit", handleUpdateAvatarSubmit);

// Initialize App
api
  .getAppInfo()
  .then(([userData, cards]) => {
    // Set user info
    profileNameEl.textContent = userData.name;
    profileBioEl.textContent = userData.about;
    profileImageEl.src = userData.avatar;

    // Render cards
    cards.forEach((cardData) => {
      const cardElement = createCard(cardData);
      cardsList.append(cardElement);
    });
  })
  .catch((err) => {
    console.error("Error loading app data:", err);
  });

// Enable validation
enableValidation(settings);
