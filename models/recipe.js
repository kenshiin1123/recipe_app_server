import { model, Schema } from "mongoose";

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  img: {
    data: Buffer,
    contentType: String,
  },
  ingredients: [
    {
      quantity: Number,
      name: String,
    },
  ],
  preparationSteps: [String],
});

export default model("Recipe", recipeSchema);
