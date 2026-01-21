require("dotenv").config();

fetch("http://localhost:5000/api/v1/prices", {
  headers: {
    "x-api-key": process.env.API_KEYS.split(",")  // Use the first API key from the .env file
  }
   
})
  .then(res => res.json())
  .then(data => {
    console.log(data);
    // data.data contains crypto prices
  })
  .catch(err => console.error(err));
