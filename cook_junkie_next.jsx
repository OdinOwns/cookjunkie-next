# CookJunkie — Next.js Allrecipes‑Style Starter (Restored)

I restored the entire project with your requested features and kept **Auto Ads** enabled. Everything uses **square edges** (no rounded corners). Multi‑layer nav + ingredient search + random picker included. Your Publisher ID is wired in.

---

## File Tree
```
.
├─ app/
│  ├─ layout.js
│  ├─ globals.css
│  ├─ page.js
│  ├─ find/page.js
│  ├─ whats-in-my-kitchen/page.js
│  ├─ browse/
│  │  └─ [group]/[slug]/page.js
│  ├─ category/
│  │  └─ [slug]/page.js
│  └─ recipes/
│     └─ [slug]/page.js
├─ components/
│  ├─ AdSlot.js
│  ├─ Container.js
│  ├─ Header.js
│  ├─ MegaNav.js
│  ├─ Footer.js
│  ├─ RecipeCard.js
│  ├─ RecipeHero.js
│  └─ RecipeSchema.js
├─ lib/
│  ├─ recipes.js
│  ├─ search.js
│  └─ taxonomy.js
├─ public/
│  ├─ ads.txt
│  ├─ cookjunkie-logo.svg (placeholder; will swap with your PNG)
│  └─ images/
│     ├─ sample-apple-pie.jpg
│     ├─ sample-chicken-alfredo.jpg
│     ├─ sample-taco-salad.jpg
│     ├─ sample-banana-bread.jpg
│     └─ sample-veggie-soup.jpg
├─ .gitignore
├─ next.config.mjs
├─ package.json
├─ postcss.config.mjs
├─ tailwind.config.mjs
├─ README.md
└─ docker-compose.yml
```

---

## package.json
```json
{
  "name": "cookjunkie",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "autoprefixer": "10.4.20",
    "postcss": "8.4.41",
    "tailwindcss": "3.4.10"
  }
}
```

## next.config.mjs
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { optimizePackageImports: [] }
};
export default nextConfig;
```

## postcss.config.mjs
```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

## tailwind.config.mjs
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: "#111111", dark: "#0a0a0a" }, accent: "#2ec4b6" }
    }
  },
  plugins: []
};
```

## .gitignore
```gitignore
/node_modules
/.next
/.vercel
.env.local
```

---

## app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; }

/* Square look: remove border-radius globally for common elements */
img, button, input, textarea, select, .card, .panel { border-radius: 0 !important; }

/* Basic prose tweaks */
.prose ul { list-style: disc; padding-left: 1.25rem; }
.prose ol { list-style: decimal; padding-left: 1.25rem; }
.prose h2 { @apply text-2xl font-semibold mt-8 mb-3; }
.prose h3 { @apply text-xl font-semibold mt-6 mb-2; }
```

## app/layout.js
```js
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Cook Junkie — Get Hooked on Flavor!",
  description: "Allrecipes-style cooking site with fast search, rich recipe pages, and ad-friendly layout.",
  icons: { icon: "/cookjunkie-logo.svg" }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense Auto Ads */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1711717467187347"
          crossOrigin="anonymous"
        ></script>
        {/* Preconnects */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-white text-zinc-900 antialiased">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

## app/page.js (Home)
```js
import { getAllRecipes, getAllCategories } from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";

export default function Home() {
  const recipes = getAllRecipes();
  const categories = getAllCategories();

  return (
    <div className="space-y-8">
      <section className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight">Featured Recipes</h1>
        <nav className="hidden md:flex gap-2 flex-wrap">
          {categories.slice(0,6).map((c) => (
            <a key={c.slug} href={`/category/${c.slug}`} className="text-sm px-3 py-1 bg-zinc-100 hover:bg-zinc-200">{c.name}</a>
          ))}
        </nav>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((r) => (
          <RecipeCard key={r.slug} recipe={r} />
        ))}
      </section>
    </div>
  );
}
```

## app/category/[slug]/page.js
```js
import { getAllRecipes, getCategoryBySlug } from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";

export default function CategoryPage({ params }) {
  const category = getCategoryBySlug(params.slug);
  const recipes = getAllRecipes().filter((r) => r.category === category?.slug);

  if (!category) return <div>Category not found.</div>;

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">{category.name}</h1>
          <p className="text-zinc-600">{category.description}</p>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((r) => <RecipeCard key={r.slug} recipe={r} />)}
      </section>
    </div>
  );
}
```

## app/browse/[group]/[slug]/page.js
```js
import { getAllRecipes } from "@/lib/recipes";
import { regions, styles, types } from "@/lib/taxonomy";
import RecipeCard from "@/components/RecipeCard";

const maps = { regions, styles, types };

export default function Browse({ params }) {
  const { group, slug } = params; // group: regions|styles|types
  const list = maps[group] || [];
  const node = list.find((x) => x.slug === slug);
  if (!node) return <div>Not found.</div>;

  const recipes = getAllRecipes().filter((r) =>
    (group === "regions" && r.region === slug) ||
    (group === "styles" && r.style === slug) ||
    (group === "types" && r.type === slug)
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">{node.name}</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((r)=> <RecipeCard key={r.slug} recipe={r} />)}
      </section>
    </div>
  );
}
```

## app/whats-in-my-kitchen/page.js
```js
'use client';
import { useState } from 'react';
import { searchByIngredients } from '@/lib/search';
import RecipeCard from '@/components/RecipeCard';

export default function Kitchen() {
  const [input, setInput] = useState('chicken, rice, broccoli');
  const [results, setResults] = useState([]);

  const onSearch = () => {
    const list = input.split(',').map(s => s.trim()).filter(Boolean);
    setResults(searchByIngredients(list));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">What's in my kitchen?</h1>
      <div className="flex gap-2">
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="e.g. chicken, rice, broccoli" className="flex-1 border px-3 py-2" />
        <button onClick={onSearch} className="border px-4 py-2 bg-zinc-900 text-white">Search</button>
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((r)=> <RecipeCard key={r.slug} recipe={r} />)}
      </section>
    </div>
  );
}
```

## app/find/page.js
```js
import { randomRecipe } from '@/lib/search';

export default function Find() {
  const r = randomRecipe();
  if (!r) return <div>No recipes yet.</div>;
  if (typeof window !== 'undefined') {
    window.location.href = `/recipes/${r.slug}`;
  }
  return <div>Finding something tasty…</div>;
}
```

## app/recipes/[slug]/page.js
```js
import { getRecipeBySlug } from "@/lib/recipes";
import RecipeHero from "@/components/RecipeHero";
import RecipeSchema from "@/components/RecipeSchema";

export default function RecipePage({ params }) {
  const recipe = getRecipeBySlug(params.slug);
  if (!recipe) return <div>Recipe not found.</div>;

  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <RecipeSchema recipe={recipe} />
        <RecipeHero recipe={recipe} />

        <div className="prose max-w-none">
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}
          </ul>

          <h2>Directions</h2>
          <ol>
            {recipe.instructions.map((step, idx) => <li key={idx}>{step}</li>)}
          </ol>

          <h2>Nutrition</h2>
          <p className="text-sm text-zinc-600">Calories: {recipe.nutrition.calories} • Protein: {recipe.nutrition.proteinContent} • Carbs: {recipe.nutrition.carbohydrateContent} • Fat: {recipe.nutrition.fatContent}</p>
        </div>
      </div>

      <aside className="lg:col-span-4 space-y-4">
        <div className="border p-4">
          <h3 className="font-semibold mb-2">Chef Notes</h3>
          <p className="text-sm text-zinc-700">{recipe.description}</p>
        </div>
      </aside>
    </article>
  );
}
```

---

## components/Container.js
```js
export default function Container({ className = "", children }) {
  return <div className={`mx-auto max-w-6xl px-4 ${className}`}>{children}</div>;
}
```

## components/Header.js
```js
import { useState } from "react";
import MegaNav from "@/components/MegaNav";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-white border-b">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src="/cookjunkie-logo.svg" alt="Cook Junkie" className="h-8" />
          <span className="sr-only">Cook Junkie</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <button onClick={() => setOpen((v) => !v)} className="px-0 py-0 font-medium">Browse</button>
          <a href="/category/dinner" className="hover:underline">Dinner</a>
          <a href="/category/dessert" className="hover:underline">Dessert</a>
          <a href="/category/healthy" className="hover:underline">Healthy</a>
          <a href="/find" className="hover:underline">Find me something</a>
          <a href="/whats-in-my-kitchen" className="hover:underline">What's in my kitchen?</a>
        </nav>
      </div>
      {open && <MegaNav />}
    </header>
  );
}
```

## components/MegaNav.js
```js
import { regions, styles, types } from "@/lib/taxonomy";

export default function MegaNav() {
  return (
    <div className="absolute left-0 right-0 top-full bg-white border-b">
      <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-3 gap-8 text-sm">
        <NavColumn title="Regions" items={regions} base="/browse/regions" />
        <NavColumn title="Styles" items={styles} base="/browse/styles" />
        <NavColumn title="Types" items={types} base="/browse/types" />
      </div>
    </div>
  );
}

function NavColumn({ title, items, base }) {
  return (
    <div>
      <div className="mb-3 font-semibold tracking-wide">{title}</div>
      <ul className="space-y-1">
        {items.map((x) => (
          <li key={x.slug}><a className="hover:underline" href={`${base}/${x.slug}`}>{x.name}</a></li>
        ))}
      </ul>
    </div>
  );
}
```

## components/Footer.js
```js
export default function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-zinc-600 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Cook Junkie — Get Hooked on Flavor!</p>
        <a href="/ads.txt" className="underline">ads.txt</a>
      </div>
    </footer>
  );
}
```

## components/RecipeCard.js
```js
export default function RecipeCard({ recipe }) {
  return (
    <a href={`/recipes/${recipe.slug}`} className="group block overflow-hidden border hover:shadow-md transition">
      <div className="aspect-[4/3] overflow-hidden">
        <img src={recipe.image} alt={recipe.title} className="h-full w-full object-cover group-hover:scale-105 transition" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2 mb-1">{recipe.title}</h3>
        <p className="text-sm text-zinc-600 line-clamp-2">{recipe.description}</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
          <span>⏱ {recipe.totalTime}</span>
          <span>•</span>
          <span>⭐ {recipe.ratingValue} ({recipe.reviewCount})</span>
        </div>
      </div>
    </a>
  );
}
```

## components/RecipeHero.js
```js
export default function RecipeHero({ recipe }) {
  const doPrint = () => window.print();
  return (
    <section className="space-y-4">
      <div className="aspect-[16/9] overflow-hidden border">
        <img src={recipe.image} alt={recipe.title} className="h-full w-full object-cover" />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">{recipe.title}</h1>
          <p className="text-zinc-600">By {recipe.author} • {recipe.datePublished}</p>
        </div>
        <button onClick={doPrint} className="border px-4 py-2 bg-zinc-900 text-white">Print</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
        <Stat label="Prep" value={recipe.prepTime} />
        <Stat label="Cook" value={recipe.cookTime} />
        <Stat label="Total" value={recipe.totalTime} />
        <Stat label="Serves" value={recipe.recipeYield} />
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border px-3 py-2 text-center">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
```

## components/RecipeSchema.js
```js
export default function RecipeSchema({ recipe }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: recipe.image,
    author: { "@type": "Person", name: recipe.author },
    datePublished: recipe.datePublished,
    prepTime: toISO8601Duration(recipe.prepTime),
    cookTime: toISO8601Duration(recipe.cookTime),
    totalTime: toISO8601Duration(recipe.totalTime),
    recipeYield: recipe.recipeYield,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((i) => ({ "@type": "HowToStep", text: i })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: recipe.ratingValue,
      reviewCount: recipe.reviewCount
    },
    nutrition: {
      "@type": "NutritionInformation",
      calories: recipe.nutrition.calories,
      proteinContent: recipe.nutrition.proteinContent,
      fatContent: recipe.nutrition.fatContent,
      carbohydrateContent: recipe.nutrition.carbohydrateContent
    }
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

function toISO8601Duration(str) {
  if (!str) return undefined;
  const lower = String(str).toLowerCase();
  const hMatch = lower.match(/(\d+)\s*h/);
  const mMatch = lower.match(/(\d+)\s*m/);
  const hours = hMatch ? parseInt(hMatch[1], 10) : 0;
  const mins = mMatch ? parseInt(mMatch[1], 10) : 0;
  if (hours === 0 && mins === 0) return undefined;
  return `PT${hours ? hours + 'H' : ''}${mins ? mins + 'M' : ''}`;
}
```

---

## lib/taxonomy.js
```js
export const regions = [
  { slug: "american", name: "American" },
  { slug: "mexican", name: "Mexican" },
  { slug: "italian", name: "Italian" },
  { slug: "asian", name: "Asian" }
];
export const styles = [
  { slug: "comfort", name: "Comfort" },
  { slug: "low-carb", name: "Low‑Carb" },
  { slug: "keto", name: "Keto" },
  { slug: "vegan", name: "Vegan" }
];
export const types = [
  { slug: "appetizer", name: "Appetizers" },
  { slug: "main", name: "Mains" },
  { slug: "side", name: "Sides" },
  { slug: "dessert", name: "Desserts" }
];
```

## lib/search.js
```js
import { getAllRecipes } from '@/lib/recipes';

export function searchByIngredients(ingredients) {
  const lower = ingredients.map(i => i.toLowerCase());
  return getAllRecipes().filter(r =>
    (r.ingredients || []).some(item => lower.some(k => item.toLowerCase().includes(k)))
  );
}

export function randomRecipe() {
  const list = getAllRecipes();
  return list[Math.floor(Math.random() * list.length)];
}
```

## lib/recipes.js (sample data)
```js
const categories = [
  { slug: "dinner", name: "Dinner", description: "Easy weeknight dinners and crowd-pleasers." },
  { slug: "dessert", name: "Dessert", description: "Sweet treats, classics, and new favorites." },
  { slug: "healthy", name: "Healthy", description: "Balanced, nutritious meals without fuss." },
  { slug: "budget", name: "Budget", description: "Delicious meals on a dime." }
];

const recipes = [
  mkRecipe({
    slug: "classic-apple-pie",
    title: "Classic Apple Pie",
    description: "Buttery crust, cinnamon-spiced apples, and a glossy finish.",
    image: "/images/sample-apple-pie.jpg",
    author: "Cook Junkie Test Kitchen",
    category: "dessert",
    region: "american",
    style: "comfort",
    type: "dessert",
    prepTime: "30 min",
    cookTime: "1 h",
    totalTime: "1 h 30 min",
    recipeYield: "8 servings",
    ingredients: [
      "2 lbs apples, sliced",
      "3/4 cup sugar",
      "2 tbsp flour",
      "1 tsp cinnamon",
      "1/4 tsp nutmeg",
      "1 tbsp lemon juice",
      "1 double pie crust"
    ],
    instructions: [
      "Preheat oven to 400°F (200°C).",
      "Toss apples with sugar, flour, spices, and lemon.",
      "Fill crust, top with second crust, vent, and crimp.",
      "Bake 50–60 minutes until golden and bubbly."
    ],
    nutrition: { calories: "320 kcal", proteinContent: "3 g", fatContent: "12 g", carbohydrateContent: "52 g" },
    ratingValue: 4.7,
    reviewCount: 124,
    datePublished: "2025-08-01"
  }),
  mkRecipe({
    slug: "creamy-chicken-alfredo",
    title: "Creamy Chicken Alfredo",
    description: "Silky garlic-parmesan sauce over tender pasta.",
    image: "/images/sample-chicken-alfredo.jpg",
    author: "Cook Junkie Test Kitchen",
    category: "dinner",
    region: "italian",
    style: "comfort",
    type: "main",
    prepTime: "15 min",
    cookTime: "25 min",
    totalTime: "40 min",
    recipeYield: "4 servings",
    ingredients: ["12 oz fettuccine", "2 chicken breasts", "2 cups cream", "3 cloves garlic", "1 cup parmesan", "2 tbsp butter"],
    instructions: [
      "Cook pasta until al dente.",
      "Sauté chicken; slice.",
      "Simmer cream with garlic and butter; whisk in parmesan.",
      "Toss pasta with sauce; top with chicken."
    ],
    nutrition: { calories: "680 kcal", proteinContent: "42 g", fatContent: "31 g", carbohydrateContent: "58 g" },
    ratingValue: 4.6,
    reviewCount: 98,
    datePublished: "2025-08-01"
  }),
  mkRecipe({
    slug: "taco-salad-bowl",
    title: "Taco Salad Bowl",
    description: "Crisp lettuce, seasoned beef, beans, and a zesty dressing.",
    image: "/images/sample-taco-salad.jpg",
    author: "Cook Junkie Test Kitchen",
    category: "budget",
    region: "mexican",
    style: "low-carb",
    type: "main",
    prepTime: "15 min",
    cookTime: "10 min",
    totalTime: "25 min",
    recipeYield: "4 servings",
    ingredients: ["1 lb ground beef", "1 packet taco seasoning", "1 head romaine", "1 cup black beans", "1 cup cherry tomatoes", "1/2 cup shredded cheese"],
    instructions: [
      "Brown beef and season.",
      "Chop lettuce; drain beans.",
      "Assemble bowls and drizzle with dressing."
    ],
    nutrition: { calories: "420 kcal", proteinContent: "26 g", fatContent: "22 g", carbohydrateContent: "30 g" },
    ratingValue: 4.4,
    reviewCount: 56,
    datePublished: "2025-08-01"
  }),
  mkRecipe({
    slug: "moist-banana-bread",
    title: "Moist Banana Bread",
    description: "Super tender, fragrant, and not overly sweet.",
    image: "/images/sample-banana-bread.jpg",
    author: "Cook Junkie Test Kitchen",
    category: "dessert",
    region: "american",
    style: "comfort",
    type: "dessert",
    prepTime: "10 min",
    cookTime: "55 min",
    totalTime: "1 h 5 min",
    recipeYield: "10 slices",
    ingredients: ["3 ripe bananas", "1/2 cup butter", "3/4 cup sugar", "2 eggs", "1.5 cups flour", "1 tsp baking soda", "pinch salt"],
    instructions: [
      "Mash bananas; cream butter and sugar.",
      "Mix in eggs, bananas, then dry ingredients.",
      "Bake at 350°F (175°C) for 50–60 min."
    ],
    nutrition: { calories: "240 kcal", proteinContent: "4 g", fatContent: "9 g", carbohydrateContent: "36 g" },
    ratingValue: 4.8,
    reviewCount: 201,
    datePublished: "2025-08-01"
  }),
  mkRecipe({
    slug: "hearty-veggie-soup",
    title: "Hearty Veggie Soup",
    description: "Comforting, fiber-rich soup loaded with vegetables.",
    image: "/images/sample-veggie-soup.jpg",
    author: "Cook Junkie Test Kitchen",
    category: "healthy",
    region: "asian",
    style: "vegan",
    type: "side",
    prepTime: "15 min",
    cookTime: "30 min",
    totalTime: "45 min",
    recipeYield: "6 servings",
    ingredients: ["1 onion", "2 carrots", "2 celery stalks", "2 cups tomatoes", "4 cups broth", "1 cup beans", "1 cup chopped greens"],
    instructions: [
      "Sauté aromatics.",
      "Add remaining ingredients and simmer 20–30 min.",
      "Season to taste."
    ],
    nutrition: { calories: "180 kcal", proteinContent: "7 g", fatContent: "3 g", carbohydrateContent: "32 g" },
    ratingValue: 4.5,
    reviewCount: 74,
    datePublished: "2025-08-01"
  })
];

export function getAllRecipes() { return recipes; }
export function getRecipeBySlug(slug) { return recipes.find((r) => r.slug === slug); }
export function getAllCategories() { return categories; }
export function getCategoryBySlug(slug) { return categories.find((c) => c.slug === slug); }

function mkRecipe(obj) { return obj; }
```

---

## public/ads.txt
```txt
google.com, pub-1711717467187347, DIRECT, f08c47fec0942fa0
```

## public/cookjunkie-logo.svg (placeholder)
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="220" height="36" viewBox="0 0 220 36" fill="none">
  <rect width="220" height="36" fill="#111111"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, Arial" font-size="16" fill="white">Cook Junkie</text>
</svg>
```

## README.md (run & deploy)
```md
# Cook Junkie — Allrecipes-Style Starter (Restored)

## Quick Start
```bash
npm install
npm run dev
# http://localhost:3000
```

## Auto Ads
We enabled Google **Auto Ads** with your Publisher ID (`ca-pub-1711717467187347`) in `app/layout.js`. You can refine density/placements from the AdSense dashboard.

## Replace Logo
Swap `/public/cookjunkie-logo.svg` with your PNG/SVG when ready.

## Taxonomy
Edit `lib/taxonomy.js` for Regions/Styles/Types. Tag recipes with `region/style/type` in `lib/recipes.js`.
```

## docker-compose.yml
```yaml
version: "3.9"
services:
  web:
    build: .
    container_name: cookjunkie
    ports:
      - "3000:3000"
    restart: unless-stopped
```
