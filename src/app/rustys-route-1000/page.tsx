import { PageShell } from "@/components/PageShell";
import { itineraryDays } from "@/lib/content";

export default function RustysRoutePage() {
  return (
    <PageShell
      title="Rusty's Route 1000"
      description="An 11-day hotel-based itinerary that starts and ends in Alpine, modeled so AZAT can maintain each day in Sanity."
    >
      <div className="grid gap-3">
        {itineraryDays.map(([day, from, to, miles, fuel, lodging]) => (
          <article key={day} className="rounded-sm border border-[#d8ded4] bg-[#fffdf7] p-5">
            <p className="font-mono text-sm text-[#b74f32]">Day {day} / {miles} miles</p>
            <h2 className="mt-3 text-2xl font-semibold">{from} to {to}</h2>
            <p className="mt-2 text-[#5f6c63]">Fuel: {fuel}. Lodging: {lodging}.</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
