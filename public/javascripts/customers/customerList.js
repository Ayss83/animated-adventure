document.querySelector(".pagination-previous").onclick = function() {
  const currentPage = window.location.href.split("customers/")[1];

  if(currentPage > 1) {
    window.location.replace(`/customers/${Number(currentPage) - 1}`);
  }
}

document.querySelector(".pagination-next").onclick = function() {
  const currentPage = window.location.href.split("customers/")[1];
  const maxPage = document.querySelector(".pagination-list li:last-child a").innerHTML

  if(currentPage < maxPage) {
    window.location.replace(`/customers/${Number(currentPage) + 1}`);
  }
}

function displayQuotation() {
  quotationNum = event.target.parentNode.firstElementChild.innerHTML.trim();
  window.location.assign(`/customers/view/${customerNum}`);
}

window.onload = function() {
  document.querySelectorAll(".tr").forEach(tr => {
    tr.onclick = displayQuotation;
  });
}