document.querySelector("#addProductBtn").onclick = function() {
  const row = document.createElement("tr");
  row.innerHTML = "test";
  document.querySelector(".productsContainer").appendChild(row);
}