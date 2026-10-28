"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";

const trending = ["Pasta", "Avocado", "Chicken", "Thai Curry", "Salmon", "Mushroom"];

// tested categories for complexSearch
const categories = [
  { icon: "timer", title: "Quick Dinners", sub: "Ready in 30 min or less", href: "/search?maxReadyTime=30&type=main+course", tone: "bg-surface-container-low text-primary group-hover:bg-primary group-hover:text-on-primary" },
  { icon: "eco", title: "Plant-Based", sub: "Vegan recipes", href: "/search?diet=vegan", tone: "bg-secondary-container/40 text-secondary group-hover:bg-secondary group-hover:text-on-secondary" },
  { icon: "soup_kitchen", title: "Comfort Soups", sub: "Hearty & warm", href: "/search?type=soup", tone: "bg-surface-container-low text-primary group-hover:bg-primary group-hover:text-on-primary" },
  { icon: "bakery_dining", title: "Artisan Bakery", sub: "Breads & more", href: "/search?type=bread", tone: "bg-secondary-container/40 text-secondary group-hover:bg-secondary group-hover:text-on-secondary" },
  { icon: "dinner_dining", title: "Weekend Feasts", sub: "Popular main courses", href: "/search?type=main+course&sort=popularity", tone: "bg-surface-container-low text-primary group-hover:bg-primary group-hover:text-on-primary" },
];

export default function Home() {
  const [q, setQ] = useState("");
  const [by, setBy] = useState<"name" | "ingredients">("name");
  const router = useRouter();

  function submit(e: FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}&by=${by}`);
  }

  return (
    <>
      <section className="relative overflow-hidden py-space-xl">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary-fixed/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 rounded-full bg-secondary-fixed/20 blur-2xl" />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 className="mb-space-sm max-w-3xl font-display-mobile text-display-mobile leading-tight sm:font-display sm:text-display">
            Cook Something <span className="font-normal italic text-primary">Extraordinary</span> Today
          </h1>
          <p className="mb-space-xl max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
            Discover seasonal dishes, farm-fresh inspirations and pantry staples transformed into unforgettable meals.
          </p>

          <form onSubmit={submit} className="flex w-full max-w-3xl items-center gap-space-xs rounded-full bg-surface-container-lowest p-2 shadow-xl shadow-on-surface/5 transition-shadow focus-within:shadow-2xl focus-within:ring-2 focus-within:ring-primary/20">
            <Icon name="search" className="pl-space-md text-2xl text-on-surface-variant" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for recipes by ingredients, cuisine, or keywords..."
              className="min-w-0 flex-1 bg-transparent px-space-sm py-3 font-body-md text-body-md placeholder:text-on-surface-variant/60 focus:outline-none"
            />
            <button type="submit" className="flex items-center gap-space-xs whitespace-nowrap rounded-full bg-primary px-space-lg py-3 font-label-lg text-label-lg text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-95">
              <span className="hidden sm:inline">Find Recipes</span>
              <Icon name="arrow_forward" className="text-lg" />
            </button>
          </form>

          <div className="mt-space-md flex items-center gap-space-xs rounded-full bg-surface-container-low p-space-xs font-label-md text-label-md">
            {(["name", "ingredients"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setBy(m)}
                className={`rounded-full px-space-md py-1 transition-colors ${by === m ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"}`}
              >
                {m === "name" ? "By recipe name" : "By ingredients"}
              </button>
            ))}
          </div>

          <div className="mt-space-md flex flex-wrap items-center justify-center gap-space-xs">
            <span className="mr-space-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Trending:</span>
            {trending.map((t) => (
              <button key={t} onClick={() => setQ(t)} className="rounded-full bg-surface-container px-space-sm py-1 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-primary-fixed hover:text-on-primary-fixed">
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-space-lg">
        <div className="mb-space-lg">
          <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-primary">Curated Discoveries</span>
          <h2 className="font-headline-md text-headline-md">Explore by Category</h2>
        </div>
        <div className="grid grid-cols-2 gap-gutter md:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <Link key={c.title} href={c.href} className="group flex flex-col rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-surface-container-high hover:shadow-md">
              <div className={`mb-space-md flex h-12 w-12 items-center justify-center rounded-full transition-colors ${c.tone}`}>
                <Icon name={c.icon} className="text-2xl" />
              </div>
              <span className="font-title-md text-title-md transition-colors group-hover:text-primary">{c.title}</span>
              <span className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">{c.sub}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
