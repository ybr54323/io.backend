window.onload = function () {
  var paperTextAread = document.querySelector("#paper"),
    infoIcon = document.querySelector(".icon"),
    mask = document.querySelector(".mask"),
    box = document.querySelector(".box");

  infoIcon.addEventListener("click", function () {
    mask.classList.toggle("mask--active");
  });

  mask.addEventListener("click", function () {
    mask.classList.remove("mask--active");
  });
  box.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

  paperTextAread.addEventListener("input", function (evt) {
    var value = evt.target.innerText;

    axios
      .post("/paper/", {
        content: value,
      })
      .then(() => {});
  });
};
