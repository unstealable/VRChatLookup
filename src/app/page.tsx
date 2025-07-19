"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchForm } from "@/components/SearchForm";
import { ProfileCard } from "@/components/ProfileCard";
import { WorldCard } from "@/components/WorldCard";
import { GroupCard } from "@/components/GroupCard";
import { ResultSelector } from "@/components/ResultSelector";
import { Navigation } from "@/components/Navigation";
import { StructuredData } from "@/components/StructuredData";
import { VRChatUser, VRChatWorld, VRChatGroup, SearchResponse, SearchType, SearchMethod } from "@/types/vrchat";
import { useLanguage } from "@/contexts/LanguageContext";
import { generateWebsiteStructuredData } from "@/lib/structured-data";

export default function Home() {
  const [users, setUsers] = useState<VRChatUser[]>([]);
  const [worlds, setWorlds] = useState<VRChatWorld[]>([]);
  const [groups, setGroups] = useState<VRChatGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSearchType, setCurrentSearchType] = useState<SearchType>('users');
  const [showResultSelector, setShowResultSelector] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();

  const isIDFormat = (input: string) => {
    return /^(usr_|wrld_|grp_)[a-f0-9-]+$/i.test(input);
  };

  const handleSearch = async (query: string, type: SearchType, method: SearchMethod) => {
    setLoading(true);
    setError(null);
    setUsers([]);
    setWorlds([]);
    setGroups([]);
    setCurrentSearchType(type);
    setShowResultSelector(false);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=${type}&method=${method}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SearchResponse = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      // For ID searches, redirect directly to the appropriate page
      if (method === 'id' && isIDFormat(query)) {
        if (type === 'users' && data.users && data.users.length > 0) {
          router.push(`/user/${query}`);
          return;
        } else if (type === 'worlds' && data.worlds && data.worlds.length > 0) {
          router.push(`/world/${query}`);
          return;
        } else if (type === 'groups' && data.groups && data.groups.length > 0) {
          router.push(`/group/${query}`);
          return;
        }
      }

      // For name searches or multiple results, show results
      if (type === 'users' && data.users && data.users.length > 0) {
        if (data.users.length === 1) {
          router.push(`/user/${data.users[0].id}`);
        } else {
          setUsers(data.users);
          setShowResultSelector(true);
        }
      } else if (type === 'worlds' && data.worlds && data.worlds.length > 0) {
        if (data.worlds.length === 1) {
          router.push(`/world/${data.worlds[0].id}`);
        } else {
          setWorlds(data.worlds);
          setShowResultSelector(true);
        }
      } else if (type === 'groups' && data.groups && data.groups.length > 0) {
        if (data.groups.length === 1) {
          router.push(`/group/${data.groups[0].id}`);
        } else {
          setGroups(data.groups);
          setShowResultSelector(true);
        }
      } else {
        setError(t("noResults"));
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const handleResultSelect = (result: VRChatUser | VRChatWorld | VRChatGroup) => {
    if (currentSearchType === 'users') {
      router.push(`/user/${result.id}`);
    } else if (currentSearchType === 'worlds') {
      router.push(`/world/${result.id}`);
    } else if (currentSearchType === 'groups') {
      router.push(`/group/${result.id}`);
    }
  };

  const handleCancelSelection = () => {
    setShowResultSelector(false);
    setUsers([]);
    setWorlds([]);
    setGroups([]);
  };

  const renderResults = () => {
    if (showResultSelector) {
      let results: (VRChatUser | VRChatWorld | VRChatGroup)[] = [];
      
      if (currentSearchType === 'users' && users.length > 0) {
        results = users;
      } else if (currentSearchType === 'worlds' && worlds.length > 0) {
        results = worlds;
      } else if (currentSearchType === 'groups' && groups.length > 0) {
        results = groups;
      }

      return (
        <ResultSelector
          results={results}
          type={currentSearchType}
          onSelect={handleResultSelect}
          onCancel={handleCancelSelection}
        />
      );
    }

    if (currentSearchType === 'users' && users.length > 0) {
      return (
        <div className="space-y-6">
          {users.map((user) => (
            <ProfileCard key={user.id} user={user} />
          ))}
        </div>
      );
    }

    if (currentSearchType === 'worlds' && worlds.length > 0) {
      return (
        <div className="space-y-6">
          {worlds.map((world) => (
            <WorldCard key={world.id} world={world} />
          ))}
        </div>
      );
    }

    if (currentSearchType === 'groups' && groups.length > 0) {
      return (
        <div className="space-y-6">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      );
    }

    return null;
  };

  const websiteStructuredData = generateWebsiteStructuredData()

  return (
    <div className="bg-gradient-to-br from-background to-background/50 relative">
      <StructuredData data={websiteStructuredData} />
      <Navigation />
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="space-y-12">
          <SearchForm onSearch={handleSearch} loading={loading} />

          {error && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center animate-fadeIn">
              <div className="inline-flex items-center gap-3 p-6 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground text-lg">{t("loading")}</p>
              </div>
            </div>
          )}

          <div className="animate-fadeIn">
            {renderResults()}
          </div>
        </div>
      </div>
    </div>
  );
}
