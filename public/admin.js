const packageContainer = document.querySelector(`.package-container`);
console.log(`Hello world`);
const renderData = function (data) {
  console.log(data);
};

fetch("/api/admin", { method: "GET" })
  .then((res) => res.json())
  .then((data) => renderData(data));
