const form = document.querySelector(`form`);
const submitButton = document.querySelector(`button`);
const username = document.querySelector(`.username`);
const password = document.querySelector(`.password`);

const checkData = function (data) {
  document.cookie = `token=${data.token}`;
  if (data.user === false && data.password === false) {
    document.querySelector(`div`).textContent = "User does not exist";
  } else if (data.username !== false && data.password === false) {
    document.querySelector(`div`).textContent = "Password is incorrect";
  } else if (data.username !== false && data.password !== false) {
    window.location.href = "/profile";
  }
};

const checkUser = async function () {
  await fetch("/api/sign-in", {
    method: "POST",
    headers: { Accept: "application/json", "Content-type": "application/json" },
    body: JSON.stringify({
      username: `${username.value}`,
      password: `${password.value}`,
    }),
  })
    .then((res) => res.json())
    .then((data) => checkData(data));
};

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  checkUser();
});
