"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  VRChatUser,
  VRChatWorld,
  VRChatGroup,
  SearchType,
} from "@/types/vrchat";
import { useLanguage } from "@/contexts/LanguageContext";

interface ResultSelectorProps {
  results: (VRChatUser | VRChatWorld | VRChatGroup)[];
  type: SearchType;
  onSelect: (result: VRChatUser | VRChatWorld | VRChatGroup) => void;
  onCancel: () => void;
}

export const ResultSelector: React.FC<ResultSelectorProps> = ({
  results,
  type,
  onSelect,
  onCancel,
}) => {
  const { t } = useLanguage();

  const renderResultItem = (result: VRChatUser | VRChatWorld | VRChatGroup) => {
    if (type === "users") {
      const user = result as VRChatUser;
      const userIcon =
        user.profilePicOverrideThumbnail || user.currentAvatarThumbnailImageUrl;
      return (
        <Card
          key={user.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSelect(user)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-3">
              {userIcon && (
                <img
                  draggable={false}
                  src={userIcon}
                  alt={`${user.displayName}'s avatar`}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div>
                <CardTitle className="text-lg">{user.displayName}</CardTitle>
                {user.username && (
                  <CardDescription>@{user.username}</CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          {user.bio && (
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {user.bio}
              </p>
            </CardContent>
          )}
        </Card>
      );
    }

    if (type === "worlds") {
      const world = result as VRChatWorld;
      return (
        <Card
          key={world.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSelect(world)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-3">
              {world.thumbnailImageUrl && (
                <img
                  draggable={false}
                  src={world.thumbnailImageUrl}
                  alt={world.name}
                  className="w-12 h-12 rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div>
                <CardTitle className="text-lg">{world.name}</CardTitle>
                {world.authorName && (
                  <CardDescription>
                    {t("author")}: {world.authorName}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          {world.description && (
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {world.description}
              </p>
            </CardContent>
          )}
        </Card>
      );
    }

    if (type === "groups") {
      const group = result as VRChatGroup;
      return (
        <Card
          key={group.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSelect(group)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-3">
              {group.iconUrl && (
                <img
                  draggable={false}
                  src={group.iconUrl}
                  alt={group.name}
                  className="w-12 h-12 rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div>
                <CardTitle className="text-lg">{group.name}</CardTitle>
                {group.shortCode && (
                  <CardDescription className="font-mono">
                    {group.shortCode}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          {group.description && (
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {group.description}
              </p>
            </CardContent>
          )}
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-2xl font-bold">{t("multipleResults")}</h2>
        <p className="text-muted-foreground">{t("selectResult")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {results.map((result) => renderResultItem(result))}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={onCancel}
          className="hover:scale-105 transition-transform duration-200"
        >
          {t("searchButton")} {/* Réutiliser pour "Nouvelle recherche" */}
        </Button>
      </div>
    </div>
  );
};
