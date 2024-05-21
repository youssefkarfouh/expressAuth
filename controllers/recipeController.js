const Recipe = require('../model/Recipe');

// Add a new recipe
const addRecipe = async (req, res) => {
    try {
        const { name, ingredients, instructions } = req.body;
        // const userId = req.user._id; // Get the user ID from the authentication middleware

        const newRecipe = new Recipe({
            name,
            ingredients,
            instructions,
            // user: userId,
        });

        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the recipe' });
    }
};

module.exports = {addRecipe};
