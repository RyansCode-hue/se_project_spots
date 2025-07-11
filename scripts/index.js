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

editProfileButton.addEventListener("click", function () {
  editProfileModal.classList.add("modal_is-opened");
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileBioInput.value = profileBioEl.textContent;
});
editProfileCloseButton.addEventListener("click", function () {
  editProfileModal.classList.remove("modal_is-opened");
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileBioEl.textContent = editProfileBioInput.value;
  editProfileModal.classList.remove("modal_is-opened");
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
  newPostModal.classList.add("modal_is-opened");
});
newPostCloseButton.addEventListener("click", function () {
  newPostModal.classList.remove("modal_is-opened");
});

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  console.log("Image Link:", postLinkInput.value);
  console.log("Caption:", postCaptionInput.value);
  newPostModal.classList.remove("modal_is-opened");
}

newPostForm.addEventListener("submit", handleNewPostSubmit);
