// ============================================================
// utils/wasteCategoryMap.js - CLEAN WASTE CATEGORY MAPPING LAYER
// ============================================================

export const WASTE_CATEGORIES = {
  plastic: {
    category: "GARBAGE",
    wasteType: "plastic",
    label: "Plastic Waste",
    bin: "recyclable",
    binColor: "Blue Bin",
    department: "SANITATION",
    suggestedTitle: "Plastic Waste Accumulation Hazard",
    suggestedDescription: "Plastic waste detected spilling on public property requiring recyclable waste collection.",
  },
  paper: {
    category: "GARBAGE",
    wasteType: "paper",
    label: "Paper & Paperboard",
    bin: "recyclable",
    binColor: "Blue Bin",
    department: "SANITATION",
    suggestedTitle: "Paper Waste Accumulation",
    suggestedDescription: "Discarded paper and paperboard waste reported for municipal recycling pickup.",
  },
  cardboard: {
    category: "GARBAGE",
    wasteType: "cardboard",
    label: "Cardboard Packaging",
    bin: "recyclable",
    binColor: "Blue Bin",
    department: "SANITATION",
    suggestedTitle: "Cardboard Boxes & Commercial Packaging",
    suggestedDescription: "Discarded cardboard packaging dumped near public walkway.",
  },
  glass: {
    category: "GARBAGE",
    wasteType: "glass",
    label: "Glass Bottles & Jars",
    bin: "recyclable",
    binColor: "Blue Bin",
    department: "SANITATION",
    suggestedTitle: "Glass Waste & Shattered Bottle Hazard",
    suggestedDescription: "Glass bottles detected posing safety risk to pedestrians and vehicle tires.",
  },
  metal: {
    category: "GARBAGE",
    wasteType: "metal",
    label: "Metal & Scrap Cans",
    bin: "recyclable",
    binColor: "Blue Bin",
    department: "SANITATION",
    suggestedTitle: "Discarded Scrap Metal & Cans",
    suggestedDescription: "Metal debris and tin cans accumulated on public ground.",
  },
  organic: {
    category: "GARBAGE",
    wasteType: "organic",
    label: "Organic / Bio-Waste",
    bin: "organic",
    binColor: "Green Bin",
    department: "SANITATION",
    suggestedTitle: "Organic Food Waste Overflow",
    suggestedDescription: "Biodegradable organic waste accumulation creating foul odor and unhygienic conditions.",
  },
};

export const getWasteInfo = (rawClass) => {
  const normalizedKey = (rawClass || "").toLowerCase().trim();
  return (
    WASTE_CATEGORIES[normalizedKey] || {
      category: "GARBAGE",
      wasteType: normalizedKey || "general",
      label: normalizedKey ? `${normalizedKey.toUpperCase()} Waste` : "General Waste",
      bin: "recyclable",
      binColor: "Blue Bin",
      department: "SANITATION",
      suggestedTitle: "Municipal Waste Dump",
      suggestedDescription: "Accumulated waste reported for sanitation team cleanup.",
    }
  );
};
