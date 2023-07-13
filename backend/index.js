// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB



mongoose.set('strictQuery', true);
  mongoose.connect('mongodb+srv://vishal:vishal1234@vibtree.lfch0kj.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('connected to mongo'))
    .catch((err) => {
      console.error('failed to connect with mongo');
      console.error(err);
    });

// Define a schema for inventory items
const inventoryItemSchema = new mongoose.Schema({
  number: { type: String, required: true },
});

// Define a model for inventory items
const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

// Routes
// Get all inventory items
app.get('/api/inventory', async (req, res) => {
  try {
    const inventoryItems = await InventoryItem.find();
    res.json(inventoryItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get('/', (req, res) => {
  res.send('helo')
});

// Get a single inventory item
app.get('/api/inventory/:id', getInventoryItem, (req, res) => {
  res.json(res.inventoryItem);
});

// Create a new inventory item
app.post('/api/inventory', async (req, res) => {
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
app.patch('/api/inventory/:id', getInventoryItem, async (req, res) => {
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
app.delete('/api/inventory/:id', getInventoryItem, async (req, res) => {
  try {
    await res.inventoryItem.deleteOne();
    res.json({ message: 'Deleted inventory item' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a single inventory item by ID
async function getInventoryItem(req, res, next) {
  try {
    const inventoryItem = await InventoryItem.findById(req.params.id);
    if (inventoryItem == null) {
      return res.status(404).json({ message: 'Cannot find inventory item' });
    }
    res.inventoryItem = inventoryItem;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Start the server
app.listen(3000, () => console.log('Server started'));
