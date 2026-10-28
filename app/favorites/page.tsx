"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { clearFavorites, getFavorites, removeFavorite } from "@/lib/favorites";
import type { FavoriteRecipe } from "@/lib/types";

export default function FavoritesPage() {
  const [favs, setFavs] = useState<FavoriteRecipe[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavs(getFavorites());
    setReady(true);
  }, []);

  const remove = (id: number) => {
    removeFavorite(id);
    setFavs(getFavorites());
  };
  const clearAll = () => {
    clearFavorites();
    setFavs([]);
  };

  return (
    <div>
      <section className="space-y-space-xs py-space-xl">
        <div className="inline-flex items-center gap-space-xs rounded-full bg-surface-container-high px-space-md py-1 font-label-md text-label-md text-primary">
          <Icon name="bookmark_heart" className="text-base" /> Personal Library
        </div>
        <h1 className="font-headline-md text-headline-md tracking-tight sm:font-headline-lg sm:text-headline-lg">Your Saved Favorites</h1>
        <p className="max-w-2xl font-body-lg text-body-lg text-on-surface-variant">Keep track of the meals you love and come back to them anytime.</p>
      </section>

      {ready && favs.length === 0 && (
        <div className="mb-space-xl flex flex-col items-center rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-sm">
          <div className="mb-space-md flex h-24 w-24 items-center justify-center rounded-full bg-surface-container-low text-primary">
            <Icon name="favorite" className="text-5xl" />
          </div>
          <h3 className="mb-space-lg font-headline-md text-headline-md">No favorites yet. Start saving your favorite recipes!</h3>
          <Link href="/search" className="flex items-center gap-space-xs rounded-full bg-primary px-space-xl py-3 font-label-lg text-label-lg text-on-primary shadow-md transition-all hover:bg-primary-container">
            <Icon name="travel_explore" className="text-lg" /> Explore Recipes
          </Link>
        </div>
      )}

      {favs.length > 0 && (
        <div className="mb-space-xl flex flex-col gap-space-md">
          <div className="flex items-center justify-between rounded-xl bg-surface-container-low px-space-md py-space-sm">
            <span className="font-label-md text-label-md text-on-surface-variant">{favs.length} saved recipe{favs.length > 1 ? "s" : ""}</span>
            <button onClick={clearAll} className="flex items-center gap-1 rounded-full px-space-md py-1.5 font-label-md text-label-md text-error transition-colors hover:bg-error-container/30">
              <Icon name="delete_sweep" className="text-base" /> Clear All
            </button>
          </div>

          {favs.map((r) => (
            <article key={r.id} className="group flex flex-col items-center justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-all hover:shadow-md sm:flex-row">
              <div className="flex w-full flex-col items-center gap-space-md sm:w-auto sm:flex-row">
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg bg-surface-container sm:w-36">
                  {r.image && <img src={r.image} alt={r.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                  {r.dishType && <span className="absolute left-2 top-2 rounded-full bg-surface-container-lowest/90 px-2 py-0.5 font-label-sm text-label-sm capitalize text-secondary">{r.dishType}</span>}
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  {r.readyInMinutes && (
                    <div className="flex items-center justify-center gap-0.5 font-label-sm text-label-sm text-on-surface-variant sm:justify-start">
                      <Icon name="schedule" className="text-sm" /> {r.readyInMinutes} mins
                    </div>
                  )}
                  <h2 className="cursor-pointer font-headline-sm text-headline-sm transition-colors hover:text-primary"><Link href={`/recipe/${r.id}`}>{r.title}</Link></h2>
                  <p className="line-clamp-1 font-body-sm text-body-sm text-on-surface-variant">{r.summary}</p>
                </div>
              </div>
              <div className="flex w-full shrink-0 items-center justify-end gap-space-xs sm:w-auto sm:flex-col">
                <Link href={`/recipe/${r.id}`} className="flex w-full items-center justify-center gap-1 rounded-full bg-primary px-space-md py-2 font-label-lg text-label-lg text-on-primary shadow-sm transition-all hover:bg-primary-container sm:w-32">
                  <Icon name="skillet" className="text-base" /> Cook Now
                </Link>
                <button onClick={() => remove(r.id)} className="flex w-full items-center justify-center gap-1 rounded-full px-space-sm py-1.5 font-label-md text-label-md text-error/90 transition-colors hover:bg-error-container/30 sm:w-32">
                  <Icon name="heart_broken" className="text-base" /> Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
