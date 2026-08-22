import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
  ],
});

export const cta = defineType({
  name: "cta",
  title: "CTA",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "href", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "variant",
      type: "string",
      options: { list: ["primary", "secondary", "text"] },
      initialValue: "primary",
    }),
  ],
});

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "subheading", type: "text", rows: 3 }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageAlt", type: "string" }),
    defineField({ name: "actions", type: "array", of: [{ type: "cta" }] }),
  ],
});

export const externalImage = defineType({
  name: "externalImage",
  title: "Image",
  type: "object",
  fields: [
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "externalUrl", type: "url" }),
    defineField({ name: "alt", type: "string", validation: (Rule) => Rule.required() }),
  ],
});

export const labeledItem = defineType({
  name: "labeledItem",
  title: "Labeled Item",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "value", type: "string" }),
    defineField({ name: "description", type: "text", rows: 2 }),
    defineField({ name: "href", type: "string" }),
  ],
});

export const mapLayer = defineType({
  name: "mapLayer",
  title: "Map Layer",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "active", type: "boolean", initialValue: true }),
  ],
});

export const trailHighlight = defineType({
  name: "trailHighlight",
  title: "Trail Highlight",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", description: "Keep this short enough to fit in a compact map button.", validation: (Rule) => Rule.required() }),
    defineField({
      name: "category",
      type: "string",
      options: { list: ["Scenic", "Trailhead", "Town", "Fuel", "Lodging", "Resupply", "Terrain"] },
      initialValue: "Scenic",
    }),
    defineField({ name: "note", type: "text", rows: 2, description: "One sentence, ideally under 110 characters." }),
    defineField({ name: "image", type: "externalImage", description: "Use a real trail, town, or terrain image that matches this highlight." }),
    defineField({ name: "coordinates", type: "mapCoordinates" }),
    defineField({
      name: "icon",
      type: "string",
      options: { list: ["mountain", "map-pin", "fuel", "lodging", "trees", "route", "scenic"] },
      initialValue: "scenic",
    }),
    defineField({ name: "facts", type: "array", description: "Use 2-4 compact facts such as town, fuel, lodging, terrain, or file status.", of: [{ type: "labeledItem" }], validation: (Rule) => Rule.max(4) }),
    defineField({ name: "town", type: "reference", to: [{ type: "town" }] }),
    defineField({ name: "route", type: "reference", to: [{ type: "route" }] }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "image.image",
    },
  },
});

export const itineraryCard = defineType({
  name: "itineraryCard",
  title: "Itinerary Card",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", description: "Route name as it should appear on the homepage.", validation: (Rule) => Rule.required() }),
    defineField({ name: "label", type: "string", initialValue: "Itinerary" }),
    defineField({ name: "href", type: "string" }),
    defineField({ name: "image", type: "externalImage", description: "Choose a strong route image; this carries most of the card." }),
    defineField({ name: "miles", type: "string" }),
    defineField({ name: "days", type: "string" }),
    defineField({
      name: "status",
      type: "string",
      options: { list: ["Available", "Coming Soon", "Draft"] },
      initialValue: "Available",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "status",
      media: "image.image",
    },
  },
});

export const timelineStop = defineType({
  name: "timelineStop",
  title: "Timeline Stop",
  type: "object",
  fields: [
    defineField({ name: "day", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "miles", type: "string" }),
    defineField({ name: "fuel", type: "string" }),
    defineField({ name: "lodging", type: "string" }),
  ],
});

export const rustysRoutePlanningNote = defineType({
  name: "rustysRoutePlanningNote",
  title: "Rusty's Route Planning Note",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "text",
      type: "text",
      rows: 2,
      description: "Keep this short and practical. It displays as large readable text.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "text",
    },
  },
});

export const rustysRouteDay = defineType({
  name: "rustysRouteDay",
  title: "Rusty's Route Day",
  type: "object",
  fields: [
    defineField({ name: "day", title: "Day Number", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "route", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "via", title: "Via Road", type: "string" }),
    defineField({ name: "miles", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "fuel", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "lodging", type: "string", validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: {
      title: "route",
      subtitle: "day",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `Day ${subtitle}` : undefined,
      };
    },
  },
});

export const iconCard = defineType({
  name: "iconCard",
  title: "Icon Card",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      type: "string",
      options: { list: ["shield", "map", "fuel", "tools", "trees", "store", "download"] },
      initialValue: "shield",
    }),
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "text", type: "text", rows: 3 }),
  ],
});

export const featuredNewsCard = defineType({
  name: "featuredNewsCard",
  title: "Featured News Card",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({ name: "image", type: "externalImage" }),
  ],
});

export const homeStoryBlock = defineType({
  name: "homeStoryBlock",
  title: "Homepage Story Block",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "text", type: "text", rows: 3 }),
    defineField({ name: "image", type: "externalImage" }),
    defineField({ name: "cta", type: "cta" }),
  ],
});

export const rideChapter = defineType({
  name: "rideChapter",
  title: "Ride Chapter",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Chapter Type",
      type: "string",
      options: {
        list: [
          { title: "Trailhead Arrival", value: "trailhead" },
          { title: "Moving Through Landscape", value: "landscape" },
          { title: "Open Navigation / Map", value: "map" },
          { title: "Download Route Files", value: "download" },
          { title: "Towns and Services", value: "towns" },
          { title: "Stewardship / CTA", value: "stewardship" },
        ],
      },
      initialValue: "landscape",
    }),
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "text", type: "text", rows: 4 }),
    defineField({ name: "image", type: "externalImage" }),
    defineField({ name: "cta", type: "cta" }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "eyebrow",
      media: "image.image",
    },
  },
});

export const mapCoordinates = defineType({
  name: "mapCoordinates",
  title: "Map Coordinates",
  type: "object",
  fields: [
    defineField({ name: "lat", type: "number", validation: (Rule) => Rule.required().min(-90).max(90) }),
    defineField({ name: "lng", type: "number", validation: (Rule) => Rule.required().min(-180).max(180) }),
  ],
});

export const routeStats = defineType({
  name: "routeStats",
  title: "Route Stats",
  type: "object",
  fields: [
    defineField({ name: "mileage", type: "number" }),
    defineField({ name: "days", type: "number" }),
    defineField({ name: "surface", type: "string" }),
    defineField({ name: "season", type: "string" }),
  ],
});

export const richText = defineType({
  name: "richText",
  title: "Rich Text",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [{ name: "href", type: "url", title: "URL" }],
          },
        ],
      },
    },
    { type: "image", options: { hotspot: true } },
  ],
});
