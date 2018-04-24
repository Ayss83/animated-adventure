const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quotationSchema = new Schema({
  quotationNumber: {type: String, required: true, unique: true},
  products: [{
    designation: {type: String, required: true},
    quantity: {type: Number, required: true},
    unitPriceWT: {type: Number, required: true},
    vatRate: {type: Number, required: true, default: 20}
  }],
  customer: {
    firstName: {type: String},
    lastName: {type: String, required: true},
    address1: {type: String, required: true},
    address2: {type: String},
    zipCode: {type: String, required: true},
    city: {type: String, required: true}
  },
  accepted: {type: Boolean, default: false},
  date: {type: Date, required: true}
});

const Quotation = mongoose.model("Quotation", quotationSchema);

module.exports = Quotation;