const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: {type: String},
  date: {type: Date },
  designation: {type: String },
  unitPriceWT: {type: Number},
  unitPriceTax: {type: Number},
  vatRate: {type: Number, default: 20}
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;