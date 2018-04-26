let count = 1;
let total;

function productTotal() {
  total = 0;
  const products = document.querySelectorAll(".product");
  products.forEach(product => {
    const quantity = product.children[1].children[0].value;
    const unitPrice = product.children[2].children[0].value;
    const rate = product.children[3].children[0].value;
    product.children[4].children[0].value = (quantity * unitPrice * (1 + Number(rate) / 100)).toFixed(2);
    total += Number((quantity * unitPrice * (1 + Number(rate) / 100)).toFixed(2));
  });
  document.querySelector("#quotationTotal").innerHTML = total.toFixed(2) + " €"
}

function removeProduct() {
  const product = event.target.parentNode.parentNode;
  product.remove();
  productTotal();
}

//method to add a line to the products table
document.querySelector(".addProductBtn").onclick = function() {
  const row = document.createElement("tr");
  row.className = "product";

  const fields = ["designation", "quantity", "unitPriceWT", "vatRate", "total"];

  fields.forEach(field => {
    const cell = document.createElement("td");
    const input = document.createElement("input");

    if(field !== "total") {
      input.name = field + count;
    } else {
      input.readOnly = true;
    }

    if(field === "quantity" || field === "unitPriceWT" || field === "vatRate") {
      input.onkeyup = function() {
        // const product = event.target.parentNode.parentNode;
        productTotal();
      }
    }
    cell.appendChild(input);

    row.appendChild(cell);
  });

  const deleteCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.className = "button is-focused is-link is-centered";
  deleteButton.type = "button";
  deleteButton.innerHTML = "Delete";
  deleteButton.onclick = removeProduct;
  deleteCell.appendChild(deleteButton);

  row.appendChild(deleteCell);

  document.querySelector(".productsContainer").appendChild(row);
  count++;
}

window.onload = function() {
  document.querySelector(".deleteBtn").onclick = removeProduct;
  document.querySelectorAll(".initFields").forEach(field => {
    field.onkeyup = productTotal;
  });
}