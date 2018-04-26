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
const addButtons = document.querySelectorAll(".addProductBtn");
addButtons.forEach(button => {
    button.onclick = function() {
    const row = document.createElement("tr");
    row.className = "product";

    const fields = ["designation", "quantity", "unitPriceWT", "vatRate", "total"];

    fields.forEach(field => {
      const cell = document.createElement("td");
      if(field !== "total" && field !== "designation") {
        cell.className += " is-hidden-mobile";
      }
      const input = document.createElement("input");
      input.className += " input is-fullwidth is-small";

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

      switch(field) {
        case "unitPriceWT":
        case "total":
          input.placeholder = "€";
          break;
        
        case "vatRate" :
          input.placeholder = "%";
          break;
      }
      cell.appendChild(input);

      row.appendChild(cell);
    });

    const deleteCell = document.createElement("td");
    deleteCell.className = "is-hidden-mobile";
    const deleteButton = document.createElement("button");
    deleteButton.className += " button is-focused is-link is-centered is-small";
    deleteButton.type = "button";
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = removeProduct;
    deleteCell.appendChild(deleteButton);

    row.appendChild(deleteCell);

    document.querySelector(".productsContainer").appendChild(row);
    count++;
  } 
});

window.onload = function() {
  document.querySelector(".deleteBtn").onclick = removeProduct;
  document.querySelectorAll(".initFields").forEach(field => {
    field.onkeyup = productTotal;
  });
}