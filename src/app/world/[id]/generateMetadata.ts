import { Metadata } from "next";
import { generateWorldMetadata } from "@/lib/metadata";
import { headers } from "next/headers";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const headersList = await headers();

  // Detect language from headers
  const acceptLanguage = headersList.get("accept-language");
  const lang = acceptLanguage?.toLowerCase().startsWith("fr") ? "fr" : "en";

  try {
    const baseUrl =
      process.env.VRCHAT_BRIDGE_API_URL ||
      "https://vrchat-bridge.unstealable.cloud";
    const response = await fetch(`${baseUrl}/api/search/worlds/${id}?n=1`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return {
        title:
          lang === "fr"
            ? "Monde Introuvable | VRChat Lookup"
            : "World Not Found | VRChat Lookup",
        description:
          lang === "fr"
            ? "Le monde VRChat demandé n'a pas pu être trouvé. Explorez les mondes, utilisateurs et groupes VRChat sur VRChat Lookup."
            : "The requested VRChat world could not be found. Explore VRChat worlds, users, and groups on VRChat Lookup.",
      };
    }

    const searchData = await response.json();
    const world = Array.isArray(searchData) ? searchData[0] : searchData;

    if (!world) {
      return {
        title:
          lang === "fr"
            ? "Monde Introuvable | VRChat Lookup"
            : "World Not Found | VRChat Lookup",
        description:
          lang === "fr"
            ? "Le monde VRChat demandé n'a pas pu être trouvé. Explorez les mondes, utilisateurs et groupes VRChat sur VRChat Lookup."
            : "The requested VRChat world could not be found. Explore VRChat worlds, users, and groups on VRChat Lookup.",
      };
    }

    return generateWorldMetadata(world, lang);
  } catch (error) {
    console.error("Error generating world metadata:", error);
    return {
      title: lang === "fr" ? "Monde | VRChat Lookup" : "World | VRChat Lookup",
      description:
        lang === "fr"
          ? "Explorez les mondes VRChat, expériences virtuelles et environnements sur VRChat Lookup - Le moteur de recherche VRChat ultime."
          : "Explore VRChat worlds, virtual experiences, and environments on VRChat Lookup - The ultimate VRChat search engine.",
    };
  }
}
