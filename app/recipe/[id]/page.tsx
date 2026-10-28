"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Icon from "@/components/Icon";
import { getRecipe, stripHtml } from "@/lib/api";
import { addFavorite, isFavorite, removeFavorite, toFavorite } from "@/lib/favorites";
import type { RecipeDetail } from "@/lib/types";

const fmt = (n: number) => String(Number(n.toFixed(2)));

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [servings, setServings] = useState(1);
  const [unit, setUnit] = useState<"us" | "metric">("metric");
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
    getRecipe(id)
      .then((r) => {
        setRecipe(r);
        setServings(r.servings || 1);
        setSaved(isFavorite(r.id));
      })
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) return <p className="p-space-xl text-center text-error">{error}</p>;
  if (!recipe) return <p className="p-space-xl text-center text-on-surface-variant">Loading recipe...</p>;

  function toggleSave() {
    if (!recipe) return;
    if (saved) removeFavorite(recipe.id);
    else addFavorite(toFavorite(recipe));
    setSaved(!saved);
  }

  const toggleChecked = (i: number) =>
    setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));

  const ratio = servings / (recipe.servings || 1);
  const steps = recipe.analyzedInstructions?.[0]?.steps ?? [];
  const calories = recipe.nutrition?.nutrients.find((n) => n.name === "Calories");
  const cuisine = recipe.cuisines?.[0];

  const stats = [
    { icon: "timer", label: "READY IN", value: recipe.readyInMinutes ? `${recipe.readyInMinutes} min` : null },
    { icon: "group", label: "SERVINGS", value: String(recipe.servings) },
    { icon: "local_fire_department", label: "ENERGY", value: calories ? `${Math.round(calories.amount)} kcal` : null },
    { icon: "star", label: "SCORE", value: recipe.spoonacularScore ? `${Math.round(recipe.spoonacularScore)}/100` : null },
  ].filter((s) => s.value);

  return (
    <div className="flex flex-col">
      <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs py-space-md font-label-md text-label-md text-on-surface-variant print:hidden">
        <Link href="/" className="flex items-center gap-1 hover:text-primary"><Icon name="home" className="text-sm" /> Home</Link>
        {cuisine && (
          <>
            <Icon name="chevron_right" className="text-xs opacity-60" />
            <Link href={`/search?cuisine=${encodeURIComponent(cuisine)}`} className="hover:text-primary">{cuisine}</Link>
          </>
        )}
        <Icon name="chevron_right" className="text-xs opacity-60" />
        <span className="max-w-[200px] truncate font-title-md text-on-surface sm:max-w-none">{recipe.title}</span>
      </nav>

      {/* hero */}
      <section className="overflow-hidden rounded-2xl bg-surface-container-low shadow-sm">
        <div className="grid min-h-[420px] grid-cols-1 lg:grid-cols-12">
          <div className="z-10 flex flex-col justify-between gap-space-md p-space-lg lg:col-span-6 lg:p-space-xl">
            <div className="space-y-space-md">
              <div className="flex flex-wrap gap-space-xs">
                {cuisine && <span className="rounded-full bg-secondary/10 px-3 py-1 font-label-sm text-label-sm uppercase tracking-wide text-secondary">{cuisine}</span>}
                {recipe.diets?.slice(0, 3).map((d) => (
                  <span key={d} className="rounded-full bg-tertiary/10 px-3 py-1 font-label-sm text-label-sm uppercase text-tertiary">{d}</span>
                ))}
              </div>
              <h1 className="font-headline-md text-headline-md leading-tight tracking-tight lg:font-headline-lg lg:text-headline-lg">{recipe.title}</h1>
              <p className="line-clamp-5 max-w-xl font-body-md text-body-md leading-relaxed text-on-surface-variant">{stripHtml(recipe.summary)}</p>
              <div className="grid grid-cols-2 gap-space-sm sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="flex items-center gap-space-xs rounded-xl bg-surface-container-lowest p-space-sm shadow-sm">
                    <Icon name={s.icon} fill={s.icon === "star"} className="text-xl text-primary" />
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{s.label}</p>
                      <p className="font-title-md text-title-md">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-space-sm print:hidden">
              <button onClick={toggleSave} className={`flex items-center gap-space-xs rounded-full px-6 py-3 font-label-lg text-label-lg text-on-primary shadow-sm transition-all hover:opacity-90 ${saved ? "bg-secondary" : "bg-primary"}`}>
                <Icon name="favorite" fill className="text-xl" />
                {saved ? "Saved to Favorites" : "Save to Favorites"}
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-space-xs rounded-full bg-surface-container-lowest px-5 py-3 font-label-lg text-label-lg shadow-sm transition-colors hover:bg-surface-container">
                <Icon name="print" className="text-lg" /> Print Recipe
              </button>
            </div>
          </div>
          <div className="min-h-[300px] lg:col-span-6">
            {recipe.image && <img src={recipe.image} alt={recipe.title} className="h-full w-full object-cover" />}
          </div>
        </div>
      </section>

      {/* ingredients + steps */}
      <section className="mt-space-xl grid grid-cols-1 items-start gap-gutter lg:grid-cols-12">
        <aside className="lg:col-span-5">
          <div className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm">Ingredients</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Tap to cross off pantry items</p>
              </div>
              <div className="flex items-center rounded-full bg-surface-container-low p-1 font-label-sm text-label-sm">
                {(["us", "metric"] as const).map((u) => (
                  <button key={u} onClick={() => setUnit(u)} className={`rounded-full px-3 py-1 transition-all ${unit === u ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant"}`}>
                    {u === "us" ? "US" : "Metric"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-space-md flex items-center justify-between rounded-xl bg-surface-container-low/70 p-space-md">
              <div className="flex items-center gap-2">
                <Icon name="group" className="text-xl text-primary" />
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">SERVINGS</p>
                  <p className="font-title-md text-title-md">{servings} Portions</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-surface-container-lowest p-1 shadow-sm">
                <button aria-label="Decrease servings" disabled={servings <= 1} onClick={() => setServings(servings - 1)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-container disabled:opacity-30"><Icon name="remove" className="text-sm" /></button>
                <span className="select-none px-2 font-title-md text-title-md">{servings}</span>
                <button aria-label="Increase servings" disabled={servings >= 24} onClick={() => setServings(servings + 1)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-container disabled:opacity-30"><Icon name="add" className="text-sm" /></button>
              </div>
            </div>

            <ul className="mt-space-md space-y-space-xs">
              {recipe.extendedIngredients.map((ing, i) => {
                const m = ing.measures[unit];
                const done = checked.includes(i);
                return (
                  <li key={`${ing.id}-${i}`}>
                    <label className="flex cursor-pointer items-start gap-space-sm rounded-lg p-2 transition-colors hover:bg-surface-container-low/50">
                      <input type="checkbox" checked={done} onChange={() => toggleChecked(i)} className="mt-1.5 h-4 w-4 cursor-pointer accent-secondary" />
                      <span className={done ? "text-on-surface-variant line-through" : ""}>
                        <span className="font-title-md text-title-md">{fmt(m.amount * ratio)} {m.unitShort}</span>{" "}
                        {ing.nameClean || ing.name}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <div className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm lg:col-span-7 lg:p-space-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm">Method of Preparation</h2>
            {steps.length > 0 && <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">{steps.length} Steps</span>}
          </div>
          {steps.length === 0 ? (
            <p className="mt-space-md text-on-surface-variant">No preparation steps are available for this recipe.</p>
          ) : (
            <ol className="mt-space-lg space-y-space-lg">
              {steps.map((s) => (
                <li key={s.number} className="relative pl-10">
                  <div className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary font-title-md text-title-md text-on-primary">{s.number}</div>
                  <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">{s.step}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
      <div className="h-space-xl" />
    </div>
  );
}
