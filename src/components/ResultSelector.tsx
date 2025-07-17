"use client";

import React from "react";
import { ArrowLeft, User, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
          className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] border-2 hover:border-primary/20"
          onClick={() => onSelect(user)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={userIcon} alt={`${user.displayName}'s avatar`} />
                <AvatarFallback className="bg-primary/10">
                  <User className="w-8 h-8 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{user.displayName}</CardTitle>
                {user.username && (
                  <CardDescription className="text-sm truncate">@{user.username}</CardDescription>
                )}
                {user.status && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {t(user.status)}
                  </Badge>
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
          className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] border-2 hover:border-primary/20"
          onClick={() => onSelect(world)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 rounded-lg">
                <AvatarImage src={world.thumbnailImageUrl} alt={world.name} className="object-cover" />
                <AvatarFallback className="bg-primary/10 rounded-lg">
                  <Globe className="w-8 h-8 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{world.name}</CardTitle>
                {world.authorName && (
                  <CardDescription className="text-sm truncate">
                    {t("author")}: {world.authorName}
                  </CardDescription>
                )}
                <div className="flex gap-2 mt-1">
                  {world.capacity && (
                    <Badge variant="outline" className="text-xs">
                      {world.capacity} {t("capacity")}
                    </Badge>
                  )}
                  {world.visitCount && (
                    <Badge variant="outline" className="text-xs">
                      {world.visitCount} {t("visits")}
                    </Badge>
                  )}
                </div>
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
          className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] border-2 hover:border-primary/20"
          onClick={() => onSelect(group)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 rounded-lg">
                <AvatarImage src={group.iconUrl} alt={group.name} className="object-cover" />
                <AvatarFallback className="bg-primary/10 rounded-lg">
                  <Users className="w-8 h-8 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{group.name}</CardTitle>
                {group.shortCode && (
                  <CardDescription className="font-mono text-sm truncate">
                    {group.shortCode}
                  </CardDescription>
                )}
                {group.memberCount && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {group.memberCount} {t("memberCount")}
                  </Badge>
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
    <div className="w-full max-w-6xl mx-auto animate-fadeIn">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold">{t("multipleResults")}</h2>
        <p className="text-muted-foreground text-lg">{t("selectResult")}</p>
        <Badge variant="outline" className="text-sm">
          {results.length} {t("searchResults")}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-8">
        {results.map((result) => renderResultItem(result))}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={onCancel}
          className="hover:scale-105 transition-all duration-200 px-6 py-3 text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("newSearch")}
        </Button>
      </div>
    </div>
  );
};
