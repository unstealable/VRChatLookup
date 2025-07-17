"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VRChatUser } from "@/types/vrchat";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileCardProps {
  user: VRChatUser;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const { t } = useLanguage();

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "text-green-500 bg-green-500/10";
      case "offline":
        return "text-gray-500 bg-gray-500/10";
      case "busy":
        return "text-red-500 bg-red-500/10";
      case "ask me":
        return "text-yellow-500 bg-yellow-500/10";
      case "join me":
        return "text-blue-500 bg-blue-500/10";
      case "private":
        return "text-purple-500 bg-purple-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "online":
        return t("online");
      case "offline":
        return t("offline");
      case "busy":
        return t("busy");
      case "ask me":
        return t("askMe");
      case "join me":
        return t("joinMe");
      case "private":
        return t("private");
      default:
        return status || t("offline");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const userIcon =
    user.profilePicOverrideThumbnail || user.currentAvatarThumbnailImageUrl;
  return (
    <Card className="w-full max-w-4xl mx-auto animate-fadeIn hover:shadow-lg transition-all duration-300">
      <CardHeader className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {userIcon && (
            <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20">
              <img
                draggable={false}
                src={userIcon}
                alt={`${user.displayName}'s avatar`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <CardTitle className="text-3xl">{user.displayName}</CardTitle>
            {user.username && (
              <CardDescription className="text-lg font-mono">
                @{user.username}
              </CardDescription>
            )}
            <div className="flex flex-wrap gap-2 items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  user.status
                )}`}
              >
                {getStatusText(user.status)}
              </span>
              {user.platform && (
                <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                  {user.platform}
                </span>
              )}
              {user.ageVerified && (
                <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                  {user.ageVerificationStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {user.bio && (
          <div className="animate-slideIn">
            <h3 className="font-semibold mb-2 text-lg">{t("bio")}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {user.bio}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {user.pronouns && (
              <div>
                <h3 className="font-semibold mb-1">{t("pronouns")}</h3>
                <p className="text-muted-foreground">{user.pronouns}</p>
              </div>
            )}

            {user.statusDescription && (
              <div>
                <h3 className="font-semibold mb-1">{t("status")}</h3>
                <p className="text-muted-foreground">
                  {user.statusDescription}
                </p>
              </div>
            )}

            {user.location && (
              <div>
                <h3 className="font-semibold mb-1">{t("location")}</h3>
                <p className="text-muted-foreground">{user.location}</p>
              </div>
            )}

            {user.dateJoined && (
              <div>
                <h3 className="font-semibold mb-1">{t("joinDate")}</h3>
                <p className="text-muted-foreground">
                  {formatDate(user.dateJoined)}
                </p>
              </div>
            )}

            {user.last_login && (
              <div>
                <h3 className="font-semibold mb-1">{t("lastLogin")}</h3>
                <p className="text-muted-foreground">
                  {formatDate(user.last_login)}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {user.tags && user.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">{t("trustLevel")}</h3>
                <div className="flex flex-wrap gap-2">
                  {user.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.badges && user.badges.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((badge, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-secondary/50 p-2 rounded-lg hover:bg-secondary/70 transition-colors"
                    >
                      <img
                        draggable={false}
                        src={badge.badgeImageUrl}
                        alt={badge.badgeDescription}
                        className="w-6 h-6"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <span className="text-xs">{badge.badgeDescription}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {user.publicWorlds && user.publicWorlds.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-lg">{t("publicWorlds")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.publicWorlds.slice(0, 4).map((world, index) => (
                <Link
                  key={index}
                  href={`/world/${world.id}`}
                  className="block p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
                >
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
                      <h4 className="font-medium">{world.name}</h4>
                      {world.visitCount && (
                        <p className="text-xs text-muted-foreground">
                          {t("visits")}: {world.visitCount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {user.groups && user.groups.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-lg">{t("publicGroups")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.groups.slice(0, 4).map((group, index) => (
                <Link
                  key={index}
                  href={`/group/${group.groupId}`}
                  className="block p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
                >
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
                      <h4 className="font-medium">{group.name}</h4>
                      {group.memberCount && (
                        <p className="text-xs text-muted-foreground">
                          {t("memberCount")}:{" "}
                          {group.memberCount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
