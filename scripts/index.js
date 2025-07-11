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

const profileNameEl = document.querySelector(".profile__name");
const profileBioEl = document.querySelector(".profile__bio");

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

editProfileButton.addEventListener("click", function () {
  openModal(editProfileModal);
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileBioInput.value = profileBioEl.textContent;
});
editProfileCloseButton.addEventListener("click", function () {
  closeModal(editProfileModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileBioEl.textContent = editProfileBioInput.value;
  closeModal(editProfileModal);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
// New Post Modal
const newPostButton = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostForm = newPostModal.querySelector(".modal__form");
const postLinkInput = newPostModal.querySelector("#post-link-input");
const postCaptionInput = newPostModal.querySelector("#post-caption-input");

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});
newPostCloseButton.addEventListener("click", function () {
  closeModal(newPostModal);
});

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  console.log("Image Link:", postLinkInput.value);
  console.log("Caption:", postCaptionInput.value);
  closeModal(newPostModal);
}

newPostForm.addEventListener("submit", handleNewPostSubmit);
