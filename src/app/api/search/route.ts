import { NextRequest, NextResponse } from "next/server";
import { globalCache } from '@/lib/cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || searchParams.get("name");
    const type = searchParams.get("type") || "users"; // users, worlds, groups
    const method = searchParams.get("method") || "name"; // name or id
    const limit = searchParams.get("n") || "12";

    if (!query) {
      return NextResponse.json(
        { error: "Search query parameter is required" },
        { status: 400 }
      );
    }

    // Check cache first for search results
    const cacheKey = globalCache.generateSearchKey(type, query, method)
    const cachedData = globalCache.get(cacheKey)
    
    if (cachedData) {
      console.log(`Cache hit for search: ${type}/${method}/${query}`)
      return NextResponse.json(cachedData, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=300",
          "X-Cache": "HIT",
        },
      })
    }

    console.log(`Cache miss for search: ${type}/${method}/${query}, fetching from API`)

    // Base URL pour l'API VRChat Bridge
    const baseUrl = process.env.VRCHAT_BRIDGE_API_URL || "https://vrchat-bridge.unstealable.cloud";
    let endpoint = "";

    // Construire l'endpoint selon le type de recherche
    if (method === "id") {
      // Recherche par ID direct
      if (type === "users") {
        endpoint = `/api/users/${encodeURIComponent(query)}`;
      } else if (type === "worlds") {
        // Pour les worlds par ID, on va utiliser une recherche par nom avec l'ID
        // car il n'y a pas d'endpoint direct pour récupérer un world par ID
        endpoint = `/api/search/worlds/${encodeURIComponent(query)}`;
      } else if (type === "groups") {
        endpoint = `/api/groups/${encodeURIComponent(query)}`;
      }
    } else {
      // Recherche par nom
      if (type === "users") {
        endpoint = `/api/search/users/${encodeURIComponent(query)}`;
      } else if (type === "worlds") {
        endpoint = `/api/search/worlds/${encodeURIComponent(query)}`;
      } else if (type === "groups") {
        // Groups n'ont pas de recherche par nom, seulement par ID
        return NextResponse.json(
          { error: 'Groups can only be searched by ID' },
          { status: 400 }
        );
      }
    }

    if (!endpoint) {
      return NextResponse.json(
        { error: "Invalid search type" },
        { status: 400 }
      );
    }

    const url = `${baseUrl}${endpoint}${
      method === "name" ? `?n=${limit}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // Timeout de 15 secondes
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validation basique du JSON reçu
    if (!data) {
      throw new Error("Invalid response format");
    }

    // Normaliser la réponse selon le type de recherche
    let normalizedData = data;

    if (method === "id") {
      // Pour une recherche par ID, on retourne l'objet directement
      if (type === "users") {
        normalizedData = { users: [data] };
      } else if (type === "worlds") {
        normalizedData = { worlds: [data] };
      } else if (type === "groups") {
        normalizedData = { groups: [data] };
      }
    } else {
      // Pour une recherche par nom, on s'assure que la structure est correcte
      if (type === "users" && !data.users) {
        normalizedData = { users: Array.isArray(data) ? data : [data] };
      } else if (type === "worlds" && !data.worlds) {
        normalizedData = { worlds: Array.isArray(data) ? data : [data] };
      } else if (type === "groups" && !data.groups) {
        normalizedData = { groups: Array.isArray(data) ? data : [data] };
      }
    }

    // Store search results in cache
    globalCache.set(cacheKey, normalizedData)

    return NextResponse.json(normalizedData, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=300",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("API Error:", error);

    // Gestion des différents types d'erreurs
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return NextResponse.json({ error: "Request timeout" }, { status: 408 });
      }

      if (error.message.includes("HTTP error")) {
        return NextResponse.json(
          { error: "External API error" },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
