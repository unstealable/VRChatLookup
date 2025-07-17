import { Metadata } from "next";
import { generateGroupMetadata } from "@/lib/metadata";
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
    const response = await fetch(`${baseUrl}/api/groups/${id}`, {
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
            ? "Groupe Introuvable | VRChat Lookup"
            : "Group Not Found | VRChat Lookup",
        description:
          lang === "fr"
            ? "Le groupe VRChat demandé n'a pas pu être trouvé. Découvrez les groupes, utilisateurs et mondes VRChat sur VRChat Lookup."
            : "The requested VRChat group could not be found. Discover VRChat groups, users, and worlds on VRChat Lookup.",
      };
    }

    const group = await response.json();
    return generateGroupMetadata(group, lang);
  } catch (error) {
    console.error("Error generating group metadata:", error);
    return {
      title: lang === "fr" ? "Groupe | VRChat Lookup" : "Group | VRChat Lookup",
      description:
        lang === "fr"
          ? "Rejoignez les groupes VRChat, communautés et cercles sociaux sur VRChat Lookup - Le moteur de recherche VRChat ultime."
          : "Join VRChat groups, communities, and social circles on VRChat Lookup - The ultimate VRChat search engine.",
    };
  }
}
