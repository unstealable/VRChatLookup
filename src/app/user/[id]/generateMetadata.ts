import { Metadata } from "next";
import { generateUserMetadata } from "@/lib/metadata";
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
    const response = await fetch(`${baseUrl}/api/users/${id}`, {
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
            ? "Utilisateur Introuvable | VRChat Lookup"
            : "User Not Found | VRChat Lookup",
        description:
          lang === "fr"
            ? "L'utilisateur VRChat demandé n'a pas pu être trouvé. Recherchez des utilisateurs, mondes et groupes VRChat sur VRChat Lookup."
            : "The requested VRChat user could not be found. Search for VRChat users, worlds, and groups on VRChat Lookup.",
      };
    }

    const user = await response.json();
    return generateUserMetadata(user, lang);
  } catch (error) {
    console.error("Error generating user metadata:", error);
    return {
      title:
        lang === "fr"
          ? "Profil Utilisateur | VRChat Lookup"
          : "User Profile | VRChat Lookup",
      description:
        lang === "fr"
          ? "Consultez les profils d'utilisateurs VRChat, mondes et groupes sur VRChat Lookup - Le moteur de recherche VRChat ultime."
          : "View VRChat user profiles, worlds, and groups on VRChat Lookup - The ultimate VRChat search engine.",
    };
  }
}
