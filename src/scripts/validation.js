// Utility to disable a form's submit button and style it as inactive
export const disableSubmitButton = (formElement, config = settings) => {
  const saveButton = formElement.querySelector(config.submitButtonSelector);
  if (saveButton) {
    saveButton.classList.add(config.inactiveButtonClass);
    saveButton.disabled = true;
  }
};
// Validation configuration object
export const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__save-button",
  inactiveButtonClass: "button_inactive",
  inputErrorClass: "modal__input_type_error",
  errorSelector: ".modal__error",
};

// Show error for input
const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = inputElement.parentElement.querySelector(
    config.errorSelector
  );
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.hidden = false;
};

// Hide error for input
const hideInputError = (formElement, inputElement, config) => {
  const errorElement = inputElement.parentElement.querySelector(
    config.errorSelector
  );
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = "";
  errorElement.hidden = true;
};

// Check validity and show/hide error
const checkInputValidity = (formElement, inputElement, config) => {
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    );
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

// Check if any input is invalid
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

// Toggle submit button state
const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
};

// Set event listeners for a form
const setEventListeners = (formElement, config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

// Enable validation for all forms
export const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
};

// Reset all errors and input styles in a form
export const resetFormErrors = (formElement, config = settings) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
  });
};
