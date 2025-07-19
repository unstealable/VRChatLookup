"use client";

import React, { useState } from "react";
import { Search, User, Globe, Users, Hash, Type, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { SearchType, SearchMethod } from "@/types/vrchat";

interface SearchFormProps {
  onSearch: (query: string, type: SearchType, method: SearchMethod) => void;
  loading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  loading,
}) => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("users");
  const [searchMethod, setSearchMethod] = useState<SearchMethod>("name");
  const { t, language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), searchType, searchMethod);
    }
  };

  const isIDFormat = (input: string) => {
    return /^(usr_|wrld_|grp_)[a-f0-9-]+$/i.test(input);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Auto-detect ID format
    if (isIDFormat(value)) {
      setSearchMethod("id");
    } else if (searchMethod === "id" && !isIDFormat(value)) {
      setSearchMethod("name");
    }
  };

  const getPlaceholderText = () => {
    if (searchType === "availability") {
      if (searchMethod === "username") {
        return t("usernamePlaceholder") || "Enter username to check availability...";
      }
      if (searchMethod === "email") {
        return t("emailPlaceholder") || "Enter email to check availability...";
      }
    }
    if (searchMethod === "id") {
      if (searchType === "users")
        return "usr_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
      if (searchType === "worlds")
        return "wrld_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
      if (searchType === "groups")
        return "grp_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
    }
    return t("searchPlaceholder");
  };

  const isValidForSearchType = () => {
    if (searchType === "groups" && searchMethod === "name") {
      return false; // Groups can only be searched by ID
    }
    if (searchType === "availability" && !["username", "email"].includes(searchMethod)) {
      return false; // Availability type only works with username/email methods
    }
    return true;
  };

  const getSearchTypeIcon = (type: SearchType) => {
    switch (type) {
      case "users":
        return <User className="w-4 h-4" />;
      case "worlds":
        return <Globe className="w-4 h-4" />;
      case "groups":
        return <Users className="w-4 h-4" />;
      case "availability":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getSearchMethodIcon = (method: SearchMethod) => {
    switch (method) {
      case "name":
        return <Type className="w-4 h-4" />;
      case "id":
        return <Hash className="w-4 h-4" />;
      case "username":
        return <User className="w-4 h-4" />;
      case "email":
        return <Mail className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
          {language === "fr"
            ? process.env.NEXT_PUBLIC_APP_DESCRIPTION_FR
            : process.env.NEXT_PUBLIC_APP_DESCRIPTION_EN}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="flex rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={getPlaceholderText()}
                value={query}
                onChange={handleInputChange}
                disabled={loading}
                className="pl-12 h-14 text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                aria-label={t("searchPlaceholder")}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !query.trim() || !isValidForSearchType()}
              className="h-14 px-8 text-lg font-semibold rounded-l-none hover:scale-105 transition-all duration-200 shadow-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("loading")}
                </div>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  {t("searchButton")}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Search Options */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          {/* Search Type Selection */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {t("searchType")}
            </span>
            <div className="flex bg-muted/50 rounded-lg p-1 backdrop-blur-sm">
              {(["users", "worlds", "groups", "availability"] as SearchType[]).map((type) => (
                <Toggle
                  key={type}
                  pressed={searchType === type}
                  onPressedChange={() => {
                    setSearchType(type);
                    if (type === "groups") {
                      setSearchMethod("id");
                    } else if (type === "availability") {
                      setSearchMethod("username");
                    } else {
                      // Pour users et worlds, remettre à "name" par défaut
                      if (searchMethod === "username" || searchMethod === "email") {
                        setSearchMethod("name");
                      }
                    }
                  }}
                  className="h-10 px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all duration-200"
                  aria-label={`Search ${type}`}
                >
                  <div className="flex items-center gap-2">
                    {getSearchTypeIcon(type)}
                    <span className="font-medium">
                      {type === "users" ? t("searchUsers") :
                       type === "worlds" ? t("searchWorlds") :
                       type === "groups" ? t("searchGroups") :
                       type === "availability" ? t("searchAvailability") : type}
                    </span>
                  </div>
                </Toggle>
              ))}
            </div>
          </div>

          {/* Search Method Selection */}
          {searchType !== "groups" && (
            <div className="flex flex-col items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                {t("searchMethod")}
              </span>
              <div className="flex bg-muted/50 rounded-lg p-1 backdrop-blur-sm">
                {(searchType === "availability" 
                  ? ["username", "email"] as SearchMethod[]
                  : ["name", "id"] as SearchMethod[]
                ).map((method) => (
                  <Toggle
                    key={method}
                    pressed={searchMethod === method}
                    onPressedChange={() => setSearchMethod(method)}
                    className="h-10 px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all duration-200"
                    aria-label={`Search by ${method}`}
                  >
                    <div className="flex items-center gap-2">
                      {getSearchMethodIcon(method)}
                      <span className="font-medium">
                        {method === "name" ? t("searchByName") : 
                         method === "id" ? "ID" :
                         method === "username" ? t("searchUsername") : 
                         method === "email" ? t("searchEmail") : method}
                      </span>
                    </div>
                  </Toggle>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Groups ID Only Notice */}
        {searchType === "groups" && (
          <div className="text-center text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 border border-border/50">
            <Users className="w-4 h-4 inline-block mr-2" />
            {t("groupsIdOnly")}
          </div>
        )}
      </form>
    </div>
  );
};
