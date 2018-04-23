const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
  deliveryNumber: {type: String, required: true, unique: true},
  products: [{
    designation: {type: String, required: true},
    quantity: {type: Number, required: true},
  }],
  customer: {
    firstName: {type: String},
    lastName: {type: String, required: true},
    address1: {type: String, required: true},
    address2: {type: String},
    zipCode: {type: String, required: true},
    city: {type: String, required: true},
    deliveryInfos: {type: String}
  }
}, {
  timestamps: true
});

const DeliveryForm = mongoose.model("DeliveryForm", deliverySchema);

module.exports = DeliveryForm;