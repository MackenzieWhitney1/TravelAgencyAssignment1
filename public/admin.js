// NOT IN USE
const packageContainer = document.querySelector(`.package-container`);
const renderData = function (data) {};

fetch("/api/admin", { method: "GET" })
  .then((res) => res.json())
  .then((data) => renderData(data));
