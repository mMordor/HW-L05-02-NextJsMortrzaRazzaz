"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { stripHtml } from "@/lib/api";
import { addFavorite, isFavorite, removeFavorite, toFavorite } from "@/lib/favorites";
import type { Recipe } from "@/lib/types";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(isFavorite(recipe.id)), [recipe.id]);

  function toggle() {
    if (saved) removeFavorite(recipe.id);
    else addFavorite(toFavorite(recipe));
    setSaved(!saved);
  }

  const diet = recipe.diets?.[0];
  const cuisine = recipe.cuisines?.[0] ?? recipe.dishTypes?.[0];

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-high">
        {recipe.image && (
          <img src={recipe.image} alt={recipe.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {diet && (
            <span className="rounded-full bg-secondary-container px-2.5 py-1 font-label-sm text-label-sm uppercase tracking-wider text-on-secondary-container shadow-sm">
              {diet}
            </span>
          )}
          {recipe.readyInMinutes && (
            <span className="rounded-full bg-surface-container-lowest/90 px-2.5 py-1 font-label-sm text-label-sm shadow-sm">
              {recipe.readyInMinutes} Mins
            </span>
          )}
        </div>
        <button
          aria-label={saved ? "Remove from favorites" : "Save to favorites"}
          onClick={toggle}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-lowest/90 shadow-md transition-all active:scale-90 ${
            saved ? "text-primary" : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <Icon name="favorite" fill={saved} className="text-lg" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-space-lg">
        <div className="mb-2 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
          <span className="flex items-center gap-1 font-title-md capitalize text-tertiary">
            <Icon name="restaurant" className="text-base" />
            {cuisine ?? "Recipe"}
          </span>
          {recipe.aggregateLikes !== undefined && (
            <span className="flex items-center gap-1 text-on-surface">
              <Icon name="thumb_up" fill className="text-base text-primary" />
              {recipe.aggregateLikes}
            </span>
          )}
        </div>
        <h3 className="mb-space-xs font-headline-sm text-headline-sm leading-tight transition-colors group-hover:text-primary">
          <Link href={`/recipe/${recipe.id}`}>{recipe.title}</Link>
        </h3>
        <p className="mb-space-md line-clamp-2 font-body-sm text-body-sm text-on-surface-variant">{stripHtml(recipe.summary)}</p>
        <div className="-mx-space-lg -mb-space-lg mt-auto flex items-center justify-between bg-surface-container-low/40 px-space-lg py-space-md">
          <span className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
            <Icon name="timer" className="text-base" />
            {recipe.readyInMinutes ? `${recipe.readyInMinutes} mins` : "—"}
          </span>
          <Link href={`/recipe/${recipe.id}`} className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:text-primary-container">
            View recipe <Icon name="arrow_forward" className="text-sm" />
          </Link>
        </div>
      </div>
    </article>
  );
}
