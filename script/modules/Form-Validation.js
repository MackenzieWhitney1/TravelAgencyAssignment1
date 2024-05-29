export {
  checkInputsForEmpty,
  checkInputsForPattern,
  toggleInputMessage,
  removeMessage,
  submit,
  setMarginBottom,
  inputMouseOver,
};
export { regexObj, inputMessages };
export { telRegex, nameRegex, emailRegex };
// import { toggleModal } from "./modalToggle.js";

// REGEXES
const telRegex = /\d{3}[-. ]?\d{3}[-. ]?\d{4}$/;
const nameRegex = /^[A-Za-z]+$/;
const emailRegex =
  /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/;
const descriptionRegex = /./;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const regexObj = {
  ["f-name"]: nameRegex,
  ["l-name"]: nameRegex,
  ["tel"]: telRegex,
  ["email"]: emailRegex,
  ["description"]: descriptionRegex,
  ["password"]: passwordRegex,
  ["confirm-password"]: passwordRegex,
};

// INPUT MESSAGES
const inputMessages = {
  ["f-name"]: `Please enter a valid first name in the format of 'John' or 'Johnson`,
  ["l-name"]: `Please enter a valid last name in the format of 'John' or 'Johnson`,
  ["tel"]: `Please enter a valid phone number in the format 555-555-5555 with or without a '-', '.' or space`,
  ["email"]: `Please enter a valid email address in the format John@example.com`,
  ["description"]: "Cannot be left empty",
  ["password"]: `Please enter a valid password with at least 8 characters and one number`,
  ["confirm-password"]: `Please enter a valid password with at least 8 characters and one number`,
  passwordsDontMatch: `Passwords do not match`,
};

// VARIABLES
let inputsAreValid = [];
// const form = document.querySelector(`form`);

// LISTENS FOR MOUSEOVER ON INPUTS
const inputMouseOver = function (inputs) {
  inputs.forEach((input) => {
    input.addEventListener("mouseenter", () => {
      if (input.value === "")
        toggleInputMessage(input, `This field is required`);
    });
    input.addEventListener(`mouseout`, () => {
      removeMessage(input);
    });
  });
};

const checkPasswords = function ([pass1, pass2]) {
  if (pass1.value !== pass2.value) {
    [pass1, pass2].forEach((pass) =>
      toggleInputMessage(pass, inputMessages.passwordsDontMatch)
    );
    return false;
  } else {
    return true;
  }
};

const toggleInputColor = function (input, color) {
  input.style.borderColor = color;
};

const submit = function (event, inputs) {
  event.preventDefault();
  checkInputsForEmpty(inputs);

  // CHECKS FOR INPUTS WITH TEXT, SHOWS 'PLEASE ENTER VALID FORMAT' ON INVALID INPUTS
  let myArr = checkInputsForPattern(inputs);
  const passwords = inputs.filter((input) => input.type === "password");
  if (passwords.length > 0) {
    myArr.push(checkPasswords(passwords));
  }
  if (myArr.every((x) => x === true)) {
    myArr = [];
    inputsAreValid = [];
    return true;
  } else {
    myArr = [];
    inputsAreValid = [];
    return false;
  }
};

// SETS MARGIN-BOTTOM OF EACH INPUT
const setMarginBottom = function (input, value) {
  input.style.marginBottom = value;
};

// TOGGLES INPUT MESSAGES UNDER INPUT IE 'THIS FIELD IS REQUIRED'
const toggleInputMessage = function (input, message) {
  input.nextElementSibling.textContent = message;
};

// CHECKS IF THE INPUTS ARE EMPTY, IF TRUE ENTERS 'THIS FIELD IS REQUIRED
const checkInputsForEmpty = function (inputs) {
  inputs.forEach((input) => {
    if (input.value === "") {
      toggleInputMessage(input, `This field is required`);
      toggleInputColor(input, `red`);
    } else {
      removeMessage(input);
      toggleInputColor(input, `black`);
    }
  });
};

// REMOVES THE INPUT MESSAGE
const removeMessage = function (input) {
  input.nextElementSibling.textContent = "";
};

const toggleInputPatternMismatch = function (input, regexValue, message) {
  const regexResults =
    regexValue !== undefined ? regexValue.test(input.value) : true;
  // CHECKS IF THE INPUT VALUE MATCHES THE REGEX
  // IF ITS DOES, REMOVES THE MESSAGE AND RETURNS TRUE + VICE VERSA
  if (regexResults === true) {
    removeMessage(input);
    toggleInputColor(input, `black`);
    return true;
  } else {
    toggleInputMessage(input, `${message}`);
    toggleInputColor(input, `red`);
    return false;
  }
};

// CHECKS THE INPUTS FOR CORRECT PATTERNS IE INPUT.VALUE === REGEX
// AND CHECKS TO SEE IF INPUTS ARE EMPTY TO DISPLAY CORRECT MESSAGE
// IE INPUT.VALUE === "" -> 'THIS FIELD IS REQUIRED'
// INPUT.VALUE !== "" -> 'PLEASE ENTER VALID FORMAT
const checkInputsForPattern = function (inputs) {
  inputs.forEach((input) => {
    if (input.value !== "") {
      inputsAreValid.push(
        toggleInputPatternMismatch(
          input,
          regexObj[`${input.id}`],
          inputMessages[`${input.id}`]
        )
      );
    } else {
      inputsAreValid.push(false);
    }
  });
  return inputsAreValid;
};

// IGNORE THIS -> WAS FOR TESTING PURPOSES
// const inputs = document.querySelectorAll(`input`);
// const [...inputs1] = inputs;
// const submitButton = document.querySelector(`.submit--button`);
// const resetButton = document.querySelector(`.reset--button`);
// const form = document.querySelector(`form`);

// ADDS 'THIS FIELD IS REQUIRED' MESSAGE TO EACH INPUT
// inputs1.forEach((input) => {
//   input.addEventListener("mouseover", () => {
//     toggleInputMessage(input, `This field is required`);
//   });
//   input.addEventListener(`mouseout`, () => {
//     removeMessage(input);
//   });
// });

// submitButton.addEventListener(`click`, function (e) {
//   e.preventDefault();
//   checkInputsForEmpty(inputs1);

//   const myarr = checkInputsForPattern(inputs1);
//   if (myarr.every((x) => x === true)) {
//     console.log(`form submitted`);
//   }

//   inputsAreValid = [];
// });

// PREVENT FORM SUBMISSION BECAUSE IT WILL BE TRIGGERED BY THE SUBMIT BUTTON
// form.addEventListener(`submit`, (e) => {
//   e.preventDefault();
// });
