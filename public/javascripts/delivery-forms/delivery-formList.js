document.querySelector(".pagination-previous").onclick = function() {
  const currentPage = window.location.href.split("invoices/")[1];

  if(currentPage > 1) {
    window.location.replace(`/invoices/${Number(currentPage) - 1}`);
  }
}

document.querySelector(".pagination-next").onclick = function() {
  const currentPage = window.location.href.split("invoices/")[1];
  const maxPage = document.querySelector(".pagination-list li:last-child a").innerHTML

  if(currentPage < maxPage) {
    window.location.replace(`/invoices/${Number(currentPage) + 1}`);
  }
}

function displayInvoice() {
  invoiceNum = event.target.parentNode.firstElementChild.innerHTML.trim();
  window.location.assign(`/invoices/view/${invoiceNum}`);
}

window.onload = function() {
  document.querySelectorAll(".tr").forEach(tr => {
    tr.onclick = displayInvoice;
  });
}