import { stripHtml } from "./api";
import type { FavoriteRecipe, Recipe } from "./types";

const KEY = "favorites";

export function getFavorites(): FavoriteRecipe[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function save(list: FavoriteRecipe[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function toFavorite(r: Recipe): FavoriteRecipe {
  return {
    id: r.id,
    title: r.title,
    image: r.image ?? "",
    summary: stripHtml(r.summary).slice(0, 140),
    readyInMinutes: r.readyInMinutes,
    dishType: r.dishTypes?.[0],
  };
}

export const isFavorite = (id: number) => getFavorites().some((r) => r.id === id);

export function addFavorite(r: FavoriteRecipe) {
  const list = getFavorites();
  if (!list.some((x) => x.id === r.id)) save([...list, r]);
}

export const removeFavorite = (id: number) => save(getFavorites().filter((r) => r.id !== id));
export const clearFavorites = () => save([]);
