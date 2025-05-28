const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const Transaction = require("./models/Transaction.js");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json("testok2");
});

app.post("/api/transaction", async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const { name, description, datetime, price } = req.body;
    const transaction = await Transaction.create({
      name, description, datetime, price
    });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/transactions",async(req,res)=>{
    await mongoose.connect(process.env.MONGO_URL);
    const transaction = await Transaction.find();
    res.json(transaction)

})

app.delete("/api/transaction/:id", async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});




