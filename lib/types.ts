export interface Recipe {
  id: number;
  title: string;
  image?: string;
  summary?: string;
  readyInMinutes?: number;
  diets?: string[];
  cuisines?: string[];
  dishTypes?: string[];
  aggregateLikes?: number;
}

export interface Measure {
  amount: number;
  unitShort: string;
}

export interface Ingredient {
  id: number;
  name: string;
  nameClean?: string;
  measures: { us: Measure; metric: Measure };
}

export interface RecipeDetail extends Recipe {
  servings: number;
  spoonacularScore?: number;
  extendedIngredients: Ingredient[];
  analyzedInstructions?: { steps: { number: number; step: string }[] }[];
  nutrition?: { nutrients: { name: string; amount: number; unit: string }[] };
}

export interface SearchResponse {
  results: Recipe[];
  totalResults: number;
}

export interface SearchOptions {
  q?: string;
  by?: string;
  cuisine?: string;
  diet?: string;
  type?: string;
  sort?: string;
  maxReadyTime?: string;
  page?: number;
}

export interface FavoriteRecipe {
  id: number;
  title: string;
  image: string;
  summary: string;
  readyInMinutes?: number;
  dishType?: string;
}
