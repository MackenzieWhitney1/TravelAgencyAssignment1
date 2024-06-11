import { submit, inputMouseOver } from "./modules/Form-Validation.js";

const select = document.querySelector(`select`);
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

// NEXT BUTTON
nextButtons.forEach((button) => {
  button.addEventListener(`click`, (e) => {
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

// PREVIOUS BUTTON
prevButtons.forEach((button) => {
  button.addEventListener(`click`, (e) => {
    fieldsetIndex--;
    fieldsets.forEach((fieldset, i) => {
      fieldset.style.transform = `translateX(${300 * (i - fieldsetIndex)}%`;
    });
  });
});

// SUBMIT FORM ON SUBMIT BUTTON
submitButton.addEventListener(`click`, (e) => {
  e.preventDefault();
  if (submit(e, inputs1)) {
    form.submit();
    // window.location.href = "/confirm";
  }
});

// PREVENT ENTER KEY SUBMISSION
window.addEventListener(`keydown`, (e) => {
  if (e.key === `Enter`) {
    e.preventDefault();
  }
});

// document.querySelector(`.sign-in`).addEventListener(`click`, () => {
//   window.location.href = "/sign-in";
// });

const renderAgents = function (data) {
  console.log(data);
  data.forEach((agent) => {
    select.insertAdjacentHTML(
      "afterbegin",
      `
      <option value="${agent.AgentId}">${agent.AgtFirstName} ${agent.AgtLastName}</option>
      `
    );
  });
};

fetch("api/register", { method: "GET" })
  .then((res) => res.json())
  .then((data) => renderAgents(data));
