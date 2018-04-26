let count = 1;

//method to add a line to the products table
document.querySelector(".addProductBtn").onclick = function() {
  const row = document.createElement("tr");

  const fields = ["designation", "quantity", "unitPrice", "vatRate", "total"];

  fields.forEach(field => {
    const cell = document.createElement("td");
    const input = document.createElement("input");
    if(field !== "total") {
      input.name = field + count;
    }
    cell.appendChild(input);

    row.appendChild(cell);
  });

  const deleteCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.className = "button is-focused is-link is-centered";
  deleteButton.type = "button";
  deleteButton.innerHTML = "Delete";
  deleteCell.appendChild(deleteButton);

  row.appendChild(deleteCell);

  document.querySelector(".productsContainer").appendChild(row);
  count++;
}