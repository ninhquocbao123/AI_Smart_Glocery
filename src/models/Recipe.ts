import mongoose, { Schema, Document } from 'mongoose';

export interface IIngredient {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  store: string;
  category: string;
  image?: string;
}

export interface IRecipe extends Document {
  cookingGuide?: import('@/data/mockData').Recipe['cookingGuide'];
  id: string; // using string id to match mockData for now
  title: string;
  cuisine: string;
  description: string;
  image: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: IIngredient[];
  instructions: string[];
  totalPrice: number;
  tags: string[];
}

const IngredientSchema = new Schema<IIngredient>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true },
  store: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, default: "" },
});

const RecipeSchema = new Schema<IRecipe>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    cuisine: { type: String, default: "Việt Nam" },
    description: { type: String, required: true },
    image: { type: String, required: true },
    difficulty: { type: String, enum: ["Dễ", "Trung bình", "Khó"], required: true },
    prepTime: { type: Number, required: true },
    cookTime: { type: Number, required: true },
    servings: { type: Number, required: true },
    ingredients: { type: [IngredientSchema], required: true },
    cookingGuide: { type: Schema.Types.Mixed },
    instructions: { type: [String], required: true },
    totalPrice: { type: Number, required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema);
