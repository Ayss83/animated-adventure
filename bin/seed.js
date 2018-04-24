const mongoose = require("mongoose");
const Quotation = require("../models/Quotation");

mongoose
  .connect('mongodb://localhost/iron-project', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

  const quotations = [
    {
      quotationNumber: "20180215-001",
      products: [{
        designation: "Baguette de pain",
        quantity: 5,
        unitPriceWT: 0.85,
        vatRate: 5
      },
      {
        designation: "Mercedes SLK ver. 2017",
        quantity: 1,
        unitPriceWT: 29500,
        vatRate: 20
      }],
      customer: {
        firstName: "Michel",
        lastName: "Poquelin",
        address1: "125 rue des plantes en pot",
        zipCode: "65200",
        city: "Châlons"
      },
      date: new Date(2018, 1, 15)
    },
    {
      quotationNumber: "20171214-001",
      products: [{
        designation: "Playstation 4",
        quantity: 2,
        unitPriceWT: 280,
        vatRate: 20
      },
      {
        designation: "CD single de Lorie",
        quantity: 10,
        unitPriceWT: 6,
        vatRate: 20
      }],
      customer: {
        firstName: "Hervé",
        lastName: "Patulacci",
        address1: "20 Avenue du maréchal de Tassigny",
        zipCode: "29500",
        city: "Mont de marsans"
      },
      date: new Date(2017, 11, 14)
    },
    {
      quotationNumber: "20180114-021",
      products: [{
        designation: "Intel i7 7800k processor",
        quantity: 1,
        unitPriceWT: 380,
        vatRate: 20
      },
      {
        designation: "Dog food can",
        quantity: 5,
        unitPriceWT: 1.9,
        vatRate: 20
      }],
      customer: {
        firstName: "Marie",
        lastName: "Semsa",
        address1: "798 Boulevard de Normandie",
        zipCode: "12000",
        city: "Berand"
      },
      date: new Date(2018, 0, 14)
    }
  ];

  quotations.forEach(quotation => {
    Quotation.create(quotation)
    .then(newQuotation => {
      console.log(`Created quotation number ${newQuotation.quotationNumber}`);
      mongoose.connection.close();
    })
    .catch(err => {
      console.log("Error", err);
      mongoose.connection.close();
    });
  });