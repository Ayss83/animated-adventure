document.querySelector(".pagination-previous").onclick = function() {
  const currentPage = window.location.href.split("products/")[1];

  if(currentPage > 1) {
    window.location.replace(`/products/${Number(currentPage) - 1}`);
  }
}

document.querySelector(".pagination-next").onclick = function() {
  const currentPage = window.location.href.split("products/")[1];
  const maxPage = document.querySelector(".pagination-list li:last-child a").innerHTML

  if(currentPage < maxPage) {
    window.location.replace(`/products/${Number(currentPage) + 1}`);
  }
}

function displayProduct() {
  productNum = event.target.parentNode.firstElementChild.innerHTML.trim();
  window.location.assign(`/products/view/${productNum}`);
}

window.onload = function() {
  document.querySelectorAll(".tr").forEach(tr => {
    tr.onclick = displayProduct;
  });
}