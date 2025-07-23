import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
  html_url: string;
}

interface ProcessedCommit {
  sha: string;
  shortSha: string;
  message: string;
  title: string;
  description: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    url: string;
  };
  date: string;
  url: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50); // Max 50 commits
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);

    logger.info("Fetching GitHub commits", { limit, page });

    const githubUrl = `https://api.github.com/repos/${process.env.NEXT_PUBLIC_APP_AUTHOR}/VRChatLookup/commits?per_page=${limit}&page=${page}`;
    logger.apiRequest("GET", githubUrl, { purpose: "GitHub commits fetch" });

    // Enhanced headers for better GitHub API compatibility
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": `${process.env.NEXT_PUBLIC_APP_NAME}/1.0 (https://github.com/${process.env.NEXT_PUBLIC_APP_AUTHOR}/VRChatLookup)`,
      "X-GitHub-Api-Version": "2022-11-28",
    };

    // Add GitHub token if available (for higher rate limits)
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(githubUrl, {
      headers,
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.apiError(
        "GET",
        githubUrl,
        `HTTP ${response.status}: ${errorText.substring(0, 200)}`
      );

      // Handle specific GitHub API errors
      if (response.status === 403) {
        throw new Error("GitHub API rate limit exceeded");
      } else if (response.status === 404) {
        throw new Error("Repository not found");
      } else {
        throw new Error(`GitHub API error: ${response.status}`);
      }
    }

    // Validate response content type
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      logger.error("GitHub API returned non-JSON response", {
        contentType,
        textPreview: text.substring(0, 200),
      });
      throw new Error("GitHub API returned invalid response format");
    }

    let commits: GitHubCommit[];
    try {
      commits = await response.json();
    } catch (parseError) {
      logger.error("Failed to parse GitHub API response as JSON", parseError);
      throw new Error("Invalid JSON response from GitHub API");
    }

    // Validate response structure
    if (!Array.isArray(commits)) {
      logger.error("GitHub API response is not an array", {
        responseType: typeof commits,
      });
      throw new Error("Unexpected response format from GitHub API");
    }
    logger.apiResponse("GET", githubUrl, response.status, {
      commitCount: commits.length,
    });

    // Process commits data with validation
    const processedCommits: ProcessedCommit[] = commits
      .filter((commit) => {
        // Validate commit structure
        return (
          commit &&
          commit.sha &&
          commit.commit &&
          commit.commit.message &&
          commit.commit.author &&
          commit.html_url
        );
      })
      .map((commit) => {
        const messageParts = (commit.commit.message || "").split("\n");
        const title = messageParts[0]?.trim() || "No title";
        const description = messageParts.slice(1).join("\n").trim() || "";

        return {
          sha: commit.sha,
          shortSha: commit.sha.substring(0, 7), // 7 characters like requested
          message: commit.commit.message || "",
          title,
          description,
          author: {
            name: commit.commit.author?.name || "Unknown",
            username: commit.author?.login || "unknown",
            avatar: commit.author?.avatar_url || "",
            url: commit.author?.html_url || "",
          },
          date: commit.commit.author?.date || new Date().toISOString(),
          url: commit.html_url,
        };
      });

    logger.info(`Processed ${processedCommits.length} commits successfully`);

    // Fallback data if no commits are available
    if (processedCommits.length === 0) {
      logger.warn("No valid commits found, returning fallback data");
      const fallbackCommit: ProcessedCommit = {
        sha: "0000000",
        shortSha: "0000000",
        message: "No commits available",
        title: "Repository unavailable",
        description: "Unable to fetch commits from GitHub",
        author: {
          name: "System",
          username: "system",
          avatar: "",
          url: "",
        },
        date: new Date().toISOString(),
        url: `https://github.com/${process.env.NEXT_PUBLIC_APP_AUTHOR}/VRChatLookup`,
      };

      return NextResponse.json(
        {
          commits: [fallbackCommit],
          pagination: {
            page: 1,
            limit,
            hasNext: false,
          },
          version: {
            latest: "unknown",
            fullSha: "unknown",
            date: new Date().toISOString(),
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=60, stale-while-revalidate=120", // Shorter cache for errors
          },
        }
      );
    }

    // Get latest commit for version info
    const latestCommit = processedCommits[0];

    return NextResponse.json(
      {
        commits: processedCommits,
        pagination: {
          page,
          limit,
          hasNext: commits.length === limit,
        },
        version: {
          latest: latestCommit?.shortSha || "unknown",
          fullSha: latestCommit?.sha || "unknown",
          date: latestCommit?.date || new Date().toISOString(),
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300, stale-while-revalidate=600", // Cache for 5 minutes
        },
      }
    );
  } catch (error) {
    logger.error("GitHub versions API Error:", error);

    // Return fallback data instead of error for better UX
    const fallbackCommit: ProcessedCommit = {
      sha: "2430212", // Use the requested example
      shortSha: "2430212",
      message: "Update user existence check in validation API",
      title: "Update user existence check in validation API",
      description: "",
      author: {
        name: `${process.env.NEXT_PUBLIC_APP_AUTHOR}`,
        username: `${process.env.NEXT_PUBLIC_APP_AUTHOR}`,
        avatar: "",
        url: `https://github.com/${process.env.NEXT_PUBLIC_APP_AUTHOR}`,
      },
      date: new Date().toISOString(),
      url: `https://github.com/${process.env.NEXT_PUBLIC_APP_AUTHOR}/VRChatLookup/commit/2430212`,
    };

    logger.info("Returning fallback commit data due to GitHub API error");

    return NextResponse.json(
      {
        commits: [fallbackCommit],
        pagination: {
          page: 1,
          limit: 20,
          hasNext: false,
        },
        version: {
          latest: "2430212",
          fullSha: "2430212000000000000000000000000000000000",
          date: new Date().toISOString(),
        },
        fallback: true, // Indicate this is fallback data
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60, stale-while-revalidate=120", // Short cache for fallback
        },
      }
    );
  }
}
