import { submit, inputMouseOver } from "./modules/Form-Validation.js";

const inputs = document.querySelectorAll(`input`);
const [...inputs1] = inputs;
const submitButton = document.querySelector(`.submit--button`);
const form = document.querySelector(`form`);

form.addEventListener(`submit`, (e) => {
  e.preventDefault();
});

inputMouseOver(inputs1);

submitButton.addEventListener(`click`, (e) => {
  e.preventDefault();
  submit(e, inputs1);
});
