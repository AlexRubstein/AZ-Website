import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ItineraryFeature } from "@/components/ItineraryFeature";
import { MissionStatement } from "@/components/MissionStatement";
import { ScrollHero } from "@/components/ScrollHero";
import { TrailMap } from "@/components/TrailMap";
import { getHomePageData } from "@/lib/home";

export const revalidate = 30;

export default async function Home() {
  const homePage = await getHomePageData();
  const downloads = (homePage.downloads || []).slice(0, 3);

  return (
    <>
      <Header />
      <main id="main" className="overflow-hidden bg-[#07150f] text-white">
        <ScrollHero
          title={homePage.heroTitle}
          copy={homePage.heroCopy}
          image={homePage.heroImage}
          imageAlt={homePage.heroImageAlt}
          primaryCta={homePage.primaryCta}
          secondaryCta={homePage.secondaryCta}
        />

        <TrailMap
          title={homePage.mapTitle}
          copy={homePage.mapCopy}
          highlights={homePage.trailHighlights}
          downloads={downloads}
        />

        <MissionStatement
          statement={homePage.missionStatement}
          attribution={homePage.missionAttribution}
          image={homePage.missionImage}
          imageAlt={homePage.missionImageAlt}
        />

        <ItineraryFeature
          title={homePage.itineraryTitle}
          image={homePage.itineraryImage}
          imageAlt={homePage.itineraryImageAlt}
          href={homePage.itineraryHref}
          cards={homePage.itineraryCards}
        />
      </main>
      <Footer />
    </>
  );
}
