import { Metadata } from "next";
import { generateWorldMetadata, detectServerLanguage } from "@/lib/metadata";
import { headers, cookies } from "next/headers";
import { logger } from "@/lib/logger";

// Interface removed as we now use direct endpoint

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const headersList = await headers();
  const cookieStore = await cookies();

  logger.info(`Generating metadata for world ID: ${id}`);

  // Enhanced language detection
  const acceptLanguage = headersList.get("accept-language");
  const cookieLang = cookieStore.get("vrchatlookup-language")?.value;
  const lang = detectServerLanguage(acceptLanguage, cookieLang);
  
  logger.debug('Language detection', { acceptLanguage, cookieLang, detectedLang: lang });

  try {
    const baseUrl =
      process.env.VRCHAT_BRIDGE_API_URL ||
      "https://vrchat-bridge.unstealable.cloud";
    
    const worldUrl = `${baseUrl}/api/worlds/${id}`;  // Using NEW direct endpoint
    logger.apiRequest('GET', worldUrl, { purpose: 'metadata generation', method: 'direct world lookup' });
    
    const response = await fetch(worldUrl, {
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

    const worldData = await response.json();
    logger.apiResponse('GET', worldUrl, response.status, {
      worldId: worldData?.id,
      worldName: worldData?.name,
      hasData: !!worldData
    });
    
    const world = worldData;

    if (!world) {
      logger.warn(`No world data found for metadata generation, ID: ${id}`);
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

    // ✅ VERIFICATION: With direct endpoint, ID should always match
    if (world.id && world.id !== id) {
      logger.error(`UNEXPECTED METADATA ID MISMATCH with direct endpoint! Requested: ${id}, Got: ${world.id}`, {
        requestedId: id,
        returnedId: world.id,
        worldName: world.name,
        worldUrl
      });
    } else {
      logger.info(`Direct metadata world lookup successful`, {
        requestedId: id,
        returnedId: world.id,
        worldName: world.name
      });
    }
    
    logger.debug('Generating world metadata', { worldId: world.id, worldName: world.name, lang });
    return generateWorldMetadata(world, lang);
  } catch (error) {
    logger.error(`Error generating world metadata for ID: ${id}`, error);
    logger.apiError('GET', 'world metadata', error)
    return {
      title: lang === "fr" ? "Monde • VRChat Lookup" : "World • VRChat Lookup",
      description:
        lang === "fr"
          ? "Explorez les mondes VRChat, expériences virtuelles et environnements sur VRChat Lookup - Le moteur de recherche VRChat ultime."
          : "Explore VRChat worlds, virtual experiences, and environments on VRChat Lookup - The ultimate VRChat search engine.",
    };
  }
}
