import { cookies } from "next/headers";

export type Locale = "np" | "en";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("ln_locale")?.value;
  return value === "en" ? "en" : "np"; // Nepali is the default
}

export const dictionary = {
  np: {
    latest: "ताजा समाचार",
    featured: "मुख्य समाचार",
    live: "ताजा",
    readMore: "पूरा पढ्नुहोस्",
    search: "खोज्नुहोस्",
    searchPlaceholder: "समाचार खोज्नुहोस्...",
    searchResultsFor: "खोज परिणाम:",
    noResults: "कुनै परिणाम फेला परेन।",
    by: "लेखक:",
    home: "गृहपृष्ठ",
    allCategories: "सबै श्रेणी",
    minRead: "मिनेट पढाइ",
    views: "पटक हेरिएको",
    footerTagline: "उज्यालो सूचना, स्पष्ट दृष्टिकोण।",
    footerAbout: "हाम्रो बारेमा",
    footerCategories: "श्रेणीहरू",
    footerContact: "सम्पर्क",
    admin: "एडमिन",
  },
  en: {
    latest: "Latest",
    featured: "Featured",
    live: "Live",
    readMore: "Read more",
    search: "Search",
    searchPlaceholder: "Search articles...",
    searchResultsFor: "Search results for:",
    noResults: "No results found.",
    by: "By",
    home: "Home",
    allCategories: "All categories",
    minRead: "min read",
    views: "views",
    footerTagline: "Clear light on the news that matters.",
    footerAbout: "About",
    footerCategories: "Categories",
    footerContact: "Contact",
    admin: "Admin",
  },
} as const;

export function t(locale: Locale) {
  return dictionary[locale];
}
