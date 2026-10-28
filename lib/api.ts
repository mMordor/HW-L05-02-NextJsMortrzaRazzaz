import type { RecipeDetail, SearchOptions, SearchResponse } from "./types";

const KEY = process.env.NEXT_PUBLIC_SPOONACULAR_KEY ?? "";
const BASE = "https://api.spoonacular.com/recipes";
export const PER_PAGE = 9;

// complexSearch
export async function searchRecipes(o: SearchOptions): Promise<SearchResponse> {
  const params = new URLSearchParams({
    apiKey: KEY,
    number: String(PER_PAGE),
    offset: String(((o.page ?? 1) - 1) * PER_PAGE),
    addRecipeInformation: "true", // summary, diets, cuisines, readyInMinutes, ...
  });
  if (o.q) params.set(o.by === "ingredients" ? "includeIngredients" : "query", o.q);
  (["cuisine", "diet", "type", "sort", "maxReadyTime"] as const).forEach((k) => {
    const v = o[k];
    if (v) params.set(k, v);
  });
  if (o.sort === "time") params.set("sortDirection", "asc");

  const res = await fetch(`${BASE}/complexSearch?${params}`);
  if (!res.ok) throw new Error("Could not load recipes. Please try again.");
  return res.json();
}

// get recipes detailes with Nutrition info's
export async function getRecipe(id: string): Promise<RecipeDetail> {
  const res = await fetch(`${BASE}/${id}/information?includeNutrition=true&apiKey=${KEY}`);
  if (!res.ok) throw new Error("Could not load this recipe.");
  return res.json();
}

export function stripHtml(html = ""): string {
  return html.replace(/<[^>]+>/g, "");
}
