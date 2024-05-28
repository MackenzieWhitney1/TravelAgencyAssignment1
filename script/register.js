import { submit, inputMouseOver } from "./modules/Form-Validation.js";

const inputs = document.querySelectorAll(`input`);
const [...inputs1] = inputs;
const submitButton = document.querySelector(`.submit--button`);
const form = document.querySelector(`form`);
const nextButton = document.querySelector(`.next--button`);
const prevButton = document.querySelector(`.prev--button`);
console.log(nextButton);

form.addEventListener(`submit`, (e) => {
  e.preventDefault();
});

inputMouseOver(inputs1);

submitButton.addEventListener(`click`, (e) => {
  e.preventDefault();
  submit(e, inputs1);
});

nextButton.addEventListener(`click`, (e) => {
  e.preventDefault();
  submit(e, inputs1);
});
