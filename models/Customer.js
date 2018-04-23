const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  firstName: {type: String},
  lastName: {type: String, required: true},
  address1: {type: String, required: true},
  address2: {type: String},
  zipCode: {type: String, required: true},
  city: {type: String, required: true},
  phone: {type: String},
  email: {type: String},
  deliveryInfos: {type: String}
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;