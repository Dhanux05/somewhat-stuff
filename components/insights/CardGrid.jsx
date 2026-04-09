import Card from "./Card";

const insightCards = [
  {
    title: "Designing Demand Engines",
    description:
      "How community-led media buys reveal hidden intent and move prospects from interest to pipeline at higher velocity.",
    gradientColor: "from-cyan-400/35 via-cyan-300/10 to-transparent",
    label: "STRATEGY",
    cta: "Read more ->",
  },
  {
    title: "3D-First Creative Systems",
    description:
      "Cinematic product visuals and motion layers built to increase watch time, memorability, and conversion quality.",
    gradientColor: "from-orange-400/35 via-amber-300/10 to-transparent",
    label: "CREATIVE",
    cta: "See playbook ->",
  },
  {
    title: "Owning Local Search Signals",
    description:
      "Schema layering, trust loops, and landing page clusters that improve map visibility and direct high-intent leads.",
    gradientColor: "from-emerald-400/35 via-green-300/10 to-transparent",
    label: "SEO",
    cta: "Learn signals ->",
  },
];

export default function CardGrid() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-6 right-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="mb-10">
        <p className="text-xs font-semibold tracking-[0.24em] text-cyan-200/75">FEATURED INSIGHTS</p>
        <h2 className="mt-3 max-w-[14ch] text-3xl font-semibold tracking-tight text-white md:text-5xl">
          Ideas powering the next campaigns.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {insightCards.map((card, index) => (
          <Card
            key={card.title}
            index={index + 1}
            title={card.title}
            description={card.description}
            gradientColor={card.gradientColor}
            label={card.label}
            cta={card.cta}
          />
        ))}
      </div>
    </section>
  );
}

