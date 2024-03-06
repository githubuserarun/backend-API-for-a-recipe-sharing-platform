const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/recipeDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Recipe model using OOP concepts
class Recipe {
  constructor(title, ingredients, instructions) {
    this.title = title;
    this.ingredients = ingredients;
    this.instructions = instructions;
  }
}

const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  instructions: String,
});

const RecipeModel = mongoose.model('Recipe', recipeSchema);

// API endpoints

// Get all recipes
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await RecipeModel.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific recipe by ID
app.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new recipe
app.post('/recipes', async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    const newRecipe = new RecipeModel({ title, ingredients, instructions });
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a recipe by ID
app.put('/recipes/:id', async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      req.params.id,
      { title, ingredients, instructions },
      { new: true }
    );
    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a recipe by ID
app.delete('/recipes/:id', async (req, res) => {
  try {
    const deletedRecipe = await RecipeModel.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
