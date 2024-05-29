import { submit, inputMouseOver } from "./modules/Form-Validation.js";

const inputs = document.querySelectorAll(`input`);
const [...inputs1] = inputs;
const submitButton = document.querySelector(`.submit--button`);
const form = document.querySelector(`form`);
const nextButtons = document.querySelectorAll(`.next--button`);
const prevButtons = document.querySelectorAll(`.prev--button`);
const fieldsets = document.querySelectorAll(`fieldset`);
const country = document.querySelector(`.country`);
const city = document.querySelector(`.city`);

let fieldsetIndex = 0;

const location = Geolocation.getCurrentPosition;
console.log(location);

const countries = await fetch(
  `https://api.radar.io/v1/addresses/validate?addressLabel=841+BROADWAY&city=NEW+YORK&stateCode=NY&postalCode=10003&countryCode=US`
)
  .then((res) => res.json())
  .then((data) => console.log(data));

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
});

nextButtons.forEach((button) => {
  button.addEventListener(`click`, (e) => {
    console.log(e);
    const curInputs = button.closest(`fieldset`).querySelectorAll(`input`);
    const [...curInputs1] = curInputs;
    if (submit(e, curInputs1)) {
      fieldsetIndex++;
      fieldsets.forEach((fieldset, i) => {
        fieldset.style.transform = `translateX(${300 * (i - fieldsetIndex)}%`;
      });
    }
  });
});

prevButtons.forEach((button) => {
  button.addEventListener(`click`, (e) => {
    fieldsetIndex--;
    fieldsets.forEach((fieldset, i) => {
      fieldset.style.transform = `translateX(${300 * (i - fieldsetIndex)}%`;
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
