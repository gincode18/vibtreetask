// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
//Twilio
var sid = process.env.Sid;
var token = process.env.Token;
var twilionumber = process.env.number;
var twilio = require("twilio")(sid, token);

// Initialize the app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

//Generate otp
function generateOTP(length) {
  const characters = "0123456789";
  const otpArray = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters.charAt(randomIndex);
    otpArray.push(randomCharacter);
  }

  return otpArray.join("");
}

// twilio.messages.create({
//   from:twilionumber,
//   to:'+919729233981',
//   body:otp

// }).then((res)=>{
//   console.log('message sent');
// }).catch((err)=>{
//   console.log(err);
// })
// Connect to MongoDB
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.Mongo)
  .then(() => console.log("connected to mongo"))
  .catch((err) => {
    console.error("failed to connect with mongo");
    console.error(err);
  });

// Define a schema for inventory items
const inventoryItemSchema = new mongoose.Schema({
  number: { type: String, required: true },
});

// Define a model for inventory items
const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

// Routes
//send voice calls
// app.get('/voice-call', (req, res) => {
//   const twiml = new twilio.twiml.VoiceResponse();
//   twiml.say('Hello! This is a test voice call.'); // Add your TwiML instructions here
  
//   res.type('text/xml');
//   res.send(twiml.toString());
// });
app.post("/api/call", async (req, res) => {
  const number = req.body.number;
  const otp = generateOTP(6);

  try {
    twilio.calls
  .create({
    twiml: `<Response><Say>${otp}</Say></Response>`,
    to: number,
    from: twilionumber,
  })
  .then(call => {console.log('Call SID:', call.sid)
  res.send(call)})
  .catch(error => console.error('Error making call:', error));

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
//send mobile otp

});app.post("/api/otp", async (req, res) => {
  const number = req.body.number;
  const otp = generateOTP(6);

  try {
    twilio.messages
      .create({
        from: twilionumber,
        to: number,
        body: otp,
      })
      .then(() => {
        res.json({ code: "1", mess: "message sent" });
      })
      .catch((err) => {
        const mess = { code:"0",mess: "please verify your number with" };
        res.json(mess);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all inventory items
app.get("/api/inventory", async (req, res) => {
  try {
    const inventoryItems = await InventoryItem.find();
    res.json(inventoryItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/", (req, res) => {
  res.send("helo");
});

// Get a single inventory item
app.get("/api/inventory/:id", getInventoryItem, (req, res) => {
  res.json(res.inventoryItem);
});

// Create a new inventory item
app.post("/api/inventory", async (req, res) => {
  const inventoryItem = new InventoryItem({
    number: req.body.number,
  });
  try {
    const newInventoryItem = await inventoryItem.save();
    res.status(201).json(newInventoryItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an existing inventory item
app.patch("/api/inventory/:id", getInventoryItem, async (req, res) => {
  if (req.body.number != null) {
    res.inventoryItem.number = req.body.number;
  }
  try {
    const updatedInventoryItem = await res.inventoryItem.save();
    res.json(updatedInventoryItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an inventory item
app.delete("/api/inventory/:id", getInventoryItem, async (req, res) => {
  try {
    await res.inventoryItem.deleteOne();
    res.json({ message: "Deleted inventory item" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a single inventory item by ID
async function getInventoryItem(req, res, next) {
  try {
    const inventoryItem = await InventoryItem.findById(req.params.id);
    if (inventoryItem == null) {
      return res.status(404).json({ message: "Cannot find inventory item" });
    }
    res.inventoryItem = inventoryItem;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Start the server
app.listen(3000, () => console.log("Server started"));
