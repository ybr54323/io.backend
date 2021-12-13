window.onload = function () {
  var paperTextAread = document.querySelector("#paper");
//   var axios;
//   setTimeout(function () {
//     axios = axios.create({
//       timeout: 1000,
//     });
//   },1000);

  paperTextAread.addEventListener("input", function (evt) {
    var value = evt.target.innerText;

    axios
      .post("/paper/", {
        content: value,
      })
      .then(() => {});
  });
};
