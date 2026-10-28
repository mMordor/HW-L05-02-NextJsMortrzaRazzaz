"use client";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";
import RecipeCard from "@/components/RecipeCard";
import { PER_PAGE, searchRecipes } from "@/lib/api";
import type { Recipe } from "@/lib/types";

const cuisines = ["Mediterranean", "Italian", "French", "Middle Eastern", "Asian", "Mexican"];
const diets = [
  { label: "Gluten-Free", value: "gluten free" },
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Vegan", value: "vegan" },
  { label: "Keto", value: "ketogenic" },
];

function pageList(cur: number, total: number): (number | "…")[] {
  const nums = Array.from(new Set([1, total, cur - 1, cur, cur + 1]))
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

const pill = (on: boolean, activeCls: string) =>
  `whitespace-nowrap rounded-full px-space-md py-1.5 font-label-md text-label-md transition-colors ${
    on ? activeCls : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
  }`;

function SearchContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const get = (k: string) => sp.get(k) || "";
  const q = get("q"), by = get("by"), cuisine = get("cuisine"), diet = get("diet");
  const type = get("type"), sort = get("sort"), maxReadyTime = get("maxReadyTime");
  const page = Number(sp.get("page")) || 1;

  const [text, setText] = useState(q);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => setText(q), [q]);

  useEffect(() => {
    setLoading(true);
    setError("");
    searchRecipes({ q, by, cuisine, diet, type, sort, maxReadyTime, page })
      .then((d) => {
        setRecipes(d.results);
        setTotal(d.totalResults);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [q, by, cuisine, diet, type, sort, maxReadyTime, page]);

  function update(changes: Record<string, string>) {
    const p = new URLSearchParams(sp.toString());
    Object.entries(changes).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    if (!("page" in changes)) p.set("page", "1");
    router.push(`/search?${p}`);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    update({ q: text.trim() });
  }

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="py-space-lg">
      {/* search bar */}
      <section className="rounded-xl bg-surface-container-low p-space-lg shadow-sm">
        <div className="mb-space-md flex justify-end">
          <div className="inline-flex items-center gap-space-xs rounded-full bg-surface-container-lowest px-space-md py-space-xs shadow-sm">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            <span className="font-label-lg text-label-lg">
              <strong className="font-title-md text-primary">{total.toLocaleString()}</strong> recipes found
            </span>
          </div>
        </div>
        <form onSubmit={submit} className="flex flex-col items-center gap-space-sm sm:flex-row">
          <div className="relative w-full flex-1">
            <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-primary" />
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Search recipes or ingredients..."
              className="h-14 w-full rounded-full bg-surface-container-lowest pl-12 pr-12 font-body-lg text-body-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {text && (
              <button type="button" aria-label="Clear" onClick={() => setText("")} className="absolute right-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-variant">
                <Icon name="close" className="text-base" />
              </button>
            )}
          </div>
          <button type="submit" className="flex h-14 w-full items-center justify-center gap-space-xs rounded-full bg-primary px-space-lg font-label-lg text-label-lg text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-95 sm:w-auto">
            Update Search <Icon name="arrow_forward" className="text-lg" />
          </button>
        </form>
      </section>

      {/* filters */}
      <section className="my-space-lg flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm sm:p-space-lg">
        <div className="flex flex-col gap-space-xs lg:flex-row lg:items-center lg:gap-space-md">
          <span className="flex w-28 shrink-0 items-center gap-1 font-label-md text-label-md text-on-surface-variant">
            <Icon name="public" className="text-sm text-primary" /> Cuisine
          </span>
          <div className="flex items-center gap-space-xs overflow-x-auto pb-1 lg:pb-0">
            <button onClick={() => update({ cuisine: "" })} className={pill(!cuisine, "bg-secondary text-on-secondary shadow-sm")}>All Cuisines</button>
            {cuisines.map((c) => (
              <button key={c} onClick={() => update({ cuisine: cuisine === c ? "" : c })} className={pill(cuisine === c, "bg-secondary text-on-secondary shadow-sm")}>{c}</button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-space-xs lg:flex-row lg:items-center lg:gap-space-md">
          <span className="flex w-28 shrink-0 items-center gap-1 font-label-md text-label-md text-on-surface-variant">
            <Icon name="eco" className="text-sm text-secondary" /> Dietary
          </span>
          <div className="flex items-center gap-space-xs overflow-x-auto pb-1 lg:pb-0">
            {diets.map((d) => (
              <button key={d.value} onClick={() => update({ diet: diet === d.value ? "" : d.value })} className={`flex items-center gap-1 ${pill(diet === d.value, "bg-secondary-container text-on-secondary-container shadow-sm")}`}>
                {diet === d.value && <Icon name="check" className="text-sm" />}
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-space-sm">
          <span className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
            <Icon name="sort" className="text-sm text-tertiary" /> Sort By:
          </span>
          <select value={sort} onChange={(e) => update({ sort: e.target.value })} className="cursor-pointer rounded-full bg-surface-container-low px-4 py-2 font-label-lg text-label-lg shadow-sm hover:bg-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">Relevance</option>
            <option value="popularity">Most Popular</option>
            <option value="healthiness">Healthiest</option>
            <option value="time">Cook Time: Fast to Slow</option>
          </select>
        </div>
      </section>

      {/* results */}
      {loading && <p className="p-space-xl text-center text-on-surface-variant">Loading recipes...</p>}
      {error && <p className="p-space-xl text-center text-error">{error}</p>}
      {!loading && !error && recipes.length === 0 && <p className="p-space-xl text-center text-on-surface-variant">No recipes found. Try different words or filters.</p>}

      {!loading && (
        <div className="mb-space-xl grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mb-space-xl flex flex-col items-center justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm sm:flex-row">
          <button disabled={page <= 1} onClick={() => update({ page: String(page - 1) })} className="flex items-center gap-1 rounded-full bg-surface-container-low px-space-md py-2.5 font-label-md text-label-md transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40">
            <Icon name="chevron_left" className="text-base" /> Previous
          </button>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {pageList(page, totalPages).map((n, i) =>
              n === "…" ? (
                <span key={`d${i}`} className="px-2 text-on-surface-variant">…</span>
              ) : (
                <button key={n} onClick={() => update({ page: String(n) })} className={`h-10 w-10 rounded-full font-label-lg text-label-lg transition-colors ${n === page ? "bg-primary text-on-primary shadow-md" : "bg-surface-container-low hover:bg-surface-container-high"}`}>{n}</button>
              )
            )}
          </div>
          <button disabled={page >= totalPages} onClick={() => update({ page: String(page + 1) })} className="flex items-center gap-1 rounded-full bg-surface-container-low px-space-md py-2.5 font-label-md text-label-md transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40">
            Next <Icon name="chevron_right" className="text-base" />
          </button>
        </nav>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="p-space-xl text-center">Loading...</p>}>
      <SearchContent />
    </Suspense>
  );
}
