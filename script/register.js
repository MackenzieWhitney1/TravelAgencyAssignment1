import { submit, inputMouseOver } from "./modules/Form-Validation.js";

const inputs = document.querySelectorAll(`input`);
const [...inputs1] = inputs;
const submitButton = document.querySelector(`.submit--button`);
const form = document.querySelector(`form`);
const nextButtons = document.querySelectorAll(`.next--button`);
const prevButtons = document.querySelectorAll(`.prev--button`);
const fieldsets = document.querySelectorAll(`fieldset`);

let fieldsetIndex = 0;

// console.log(nextButton);

form.addEventListener(`submit`, (e) => {
  e.preventDefault();
});

inputMouseOver(inputs1);

// submitButton.addEventListener(`click`, (e) => {
//   e.preventDefault();
//   submit(e, inputs1);
// });
fieldsets.forEach((fieldset, i) => {
  fieldset.style.transform = `translateX(${i * 300}%)`;
  console.log(fieldset);
});

nextButtons.forEach((button) => {
  button.addEventListener(`click`, (e) => {
    const curInputs = button.closest(`fieldset`).querySelectorAll(`input`);
    console.log(curInputs);
    const [...curInputs1] = curInputs;
    if (submit(e, curInputs1)) {
      fieldsetIndex++;
      console.log(fieldsetIndex);
      fieldsets.forEach((fieldset, i) => {
        fieldset.style.transform = `translateX(${300 * (i - fieldsetIndex)}%`;
        console.log(fieldset);
      });
    }
  });
});

prevButtons.forEach((button) => {
  button.addEventListener(`click`, (e) => {
    fieldsetIndex--;
    fieldsets.forEach((fieldset, i) => {
      console.log(fieldsetIndex);
      fieldset.style.transform = `translateX(${300 * (i - fieldsetIndex)}%`;
      console.log(fieldset);
    });
  });
});

submitButton.addEventListener(`click`, (e) => {
  e.preventDefault();
  console.log(submit(e, inputs1));
  if (submit(e, inputs1)) {
    form.submit();
    window.location.href = "../pages/confirm.html";
  }
});
