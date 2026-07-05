import {
  ArrowRight,
  CalendarDays,
  Download,
  Fuel,
  Hotel,
  Map,
  Mountain,
  Newspaper,
  Route,
  ShieldCheck,
  Store,
  Trees,
} from "lucide-react";

export const navItems = [
  { label: "Trail", href: "/trail" },
  { label: "Route 1000", href: "/rustys-route-1000" },
  { label: "Towns", href: "/towns" },
  { label: "Resources", href: "/resources" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export const oldSiteRoutes = [
  "/",
  "/the-trail",
  "/rustys-route-1000",
  "/about-us",
  "/frequently-asked-questions",
  "/contact-us",
  "/shop",
  "/cart",
  "/login",
  "/privacy-policy",
];

export const trailFilters = [
  { label: "A Route", active: true },
  { label: "B Route", active: false },
  { label: "Towns", active: true },
  { label: "Fuel", active: true },
  { label: "Lodging", active: true },
];

export const downloads = [
  { label: "Full Trail GPX", type: "GPX", version: "v1 draft" },
  { label: "Route Overlay KML", type: "KML", version: "v1 draft" },
  { label: "GIS Shapefile", type: "SHP", version: "planning" },
];

export const towns = [
  {
    title: "Alpine",
    slug: "alpine",
    services: ["Trail Access", "Fuel", "Food", "Lodging"],
    description: "The high-country anchor for AZAT and Rusty's Route 1000.",
  },
  {
    title: "Greer",
    slug: "greer",
    services: ["Lodging", "Food", "Scenic"],
    description: "A mountain stop with lodging inventory that should be booked early.",
  },
  {
    title: "Show Low",
    slug: "show-low",
    services: ["Fuel", "Repairs", "Groceries"],
    description: "A larger services hub for riders crossing the White Mountains.",
  },
  {
    title: "Pine",
    slug: "pine",
    services: ["Fuel", "Food", "Lodging"],
    description: "A community gateway that connects trail tourism to local businesses.",
  },
];

export const segments = [
  {
    title: "A Route",
    slug: "a-route",
    code: "A",
    status: "Preliminary",
    mileage: "700+ mi",
    description: "Primary loop planning route with town connectors and downloadable files.",
  },
  {
    title: "B Route",
    slug: "b-route",
    code: "B",
    status: "Preliminary",
    mileage: "TBD",
    description: "Alternate trail family for future official and seasonal segment detail.",
  },
];

export const itineraryDays = [
  ["01", "Alpine", "Greer", "~100", "Eagar", "Lazy Trout Lodge"],
  ["02", "Greer", "Show Low", "~85", "Show Low", "Days Inn"],
  ["03", "Show Low", "Heber/Overgaard", "~100", "Show Low, Heber", "Sawmill Inn"],
  ["04", "Heber/Overgaard", "Pine", "~110", "Pine", "The Strawberry Inn"],
  ["05", "Pine", "Punkin Center", "~80", "Punkin Center", "Local lodging"],
  ["06", "Punkin Center", "Young", "~75", "Young", "Book early"],
];

export const news = [
  {
    title: "AZ Game & Fish Outdoor Expo",
    slug: "az-game-fish-outdoor-expo",
    date: "2025-03-28",
    excerpt: "AZAT shares the trail project with riders, families, and agency partners.",
  },
  {
    title: "AZAT Goals and Objectives Workshop",
    slug: "azat-goals-and-objectives-workshop",
    date: "2024-01-12",
    excerpt: "Community input helps align the trail system with town and county goals.",
  },
  {
    title: "Alpine Open House Meeting",
    slug: "alpine-open-house-meeting",
    date: "2023-08-30",
    excerpt: "Feedback from Alpine residents shaped master-plan conversations.",
  },
];

export const resourceCards = [
  {
    icon: ShieldCheck,
    title: "OHV Safety",
    text: "Clear guidance for equipment, preparation, trail etiquette, and responsible riding.",
  },
  {
    icon: Trees,
    title: "Stewardship",
    text: "Leave-no-trace education and cleanup support can become visible content, not a buried post.",
  },
  {
    icon: Store,
    title: "Economic Benefit",
    text: "Town pages can connect trail visitors to lodging, restaurants, repairs, and local shops.",
  },
];

export const stats = [
  { label: "Planning loop", value: "700+ mi", icon: Route },
  { label: "Route 1000 rhythm", value: "11 days", icon: CalendarDays },
  { label: "CMS content types", value: "14+", icon: Newspaper },
  { label: "Trail files", value: "GPX/KML/SHP", icon: Download },
];

export const mapPins = [
  { label: "Alpine", top: "68%", left: "74%", icon: Mountain },
  { label: "Greer", top: "52%", left: "78%", icon: Hotel },
  { label: "Show Low", top: "38%", left: "56%", icon: Fuel },
  { label: "Pine", top: "31%", left: "24%", icon: Map },
  { label: "Young", top: "53%", left: "33%", icon: Trees },
];

export const heroImage =
  "https://azalpinetrail.org/wp-content/uploads/2026/06/732464060_1314291140918938_8655586887586886350_n.jpg";

export const scenicImage =
  "https://azalpinetrail.org/wp-content/uploads/2021/11/alpine_forest_aboutus-2500x1215.jpg";

export const arrowIcon = ArrowRight;
