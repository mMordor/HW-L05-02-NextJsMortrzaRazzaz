export default function About() {
  return (
    <section className="mx-auto max-w-2xl py-space-xl">
      <h1 className="mb-space-md font-headline-lg text-headline-lg">About Recipe Finder</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant">
        Recipe Finder is a practice project built with Next.js, TypeScript and Tailwind CSS. Recipes come from the
        Spoonacular API, and your favorites are saved in your browser&apos;s localStorage.
      </p>
    </section>
  );
}
