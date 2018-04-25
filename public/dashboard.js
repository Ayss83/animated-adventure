

var dropdown = document.querySelector(“#Menu”);
 dropdown.addEventListener(“click”, function(event) {
 console.log(“yolo”);
 event.stopPropagation();
 dropdown.classList.toggle(“is-active”);
 document.querySelector(“#Menu”).classList.toggle(“is-active”);
});