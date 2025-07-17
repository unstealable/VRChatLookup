"use client";

import React from "react";
import Link from "next/link";
import { User, MapPin, Calendar, Globe, Users, Award, ExternalLink, Shield, CheckCircle, Clock, Smartphone, Monitor } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FaviconIcon } from "@/components/FaviconIcon";
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
    <Card className="w-full max-w-4xl mx-auto animate-fadeIn hover:shadow-lg transition-all duration-300 border-2">
      <CardHeader className="space-y-6 pb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <Avatar className="w-32 h-32 border-4 border-primary/20">
            <AvatarImage 
              src={userIcon} 
              alt={`${user.displayName}'s avatar`}
              className="hover:scale-110 transition-transform duration-300"
            />
            <AvatarFallback className="w-32 h-32 bg-primary/10 text-3xl">
              <User className="w-16 h-16 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div>
              <CardTitle className="text-3xl sm:text-4xl">{user.displayName}</CardTitle>
              {user.username && (
                <CardDescription className="text-lg font-mono mt-1">
                  @{user.username}
                </CardDescription>
              )}
            </div>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Badge 
                variant={user.status === 'online' ? 'default' : 'secondary'}
                className={`${getStatusColor(user.status)} text-sm px-3 py-1`}
              >
                {getStatusText(user.status)}
              </Badge>
              {user.platform && (
                <Badge variant="outline" className="text-sm px-3 py-1 flex items-center gap-1">
                  {user.platform === 'standalonewindows' ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                  {user.platform}
                </Badge>
              )}
              {user.ageVerificationStatus && (
                <Badge variant="secondary" className="text-sm px-3 py-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Age Verified
                </Badge>
              )}
              {user.allowAvatarCopying && (
                <Badge variant="outline" className="text-sm px-3 py-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Avatar Copying
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {user.bio && (
          <div className="animate-slideIn">
            <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              {t("bio")}
            </h3>
            <Card className="p-4 bg-muted/50">
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {user.bio}
              </p>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {user.statusDescription && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t("status")}</h3>
                  <p className="text-muted-foreground">{user.statusDescription}</p>
                </div>
              </div>
            )}

            {user.location && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t("location")}</h3>
                  <p className="text-muted-foreground">{user.location}</p>
                </div>
              </div>
            )}

            {user.dateJoined && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t("joinDate")}</h3>
                  <p className="text-muted-foreground">{formatDate(user.dateJoined)}</p>
                </div>
              </div>
            )}

            {user.last_login && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t("lastLogin")}</h3>
                  <p className="text-muted-foreground">{formatDate(user.last_login)}</p>
                </div>
              </div>
            )}

            {user.pronouns && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Pronouns</h3>
                  <p className="text-muted-foreground">{user.pronouns}</p>
                </div>
              </div>
            )}

            {user.bioLinks && user.bioLinks.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ExternalLink className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Links</h3>
                  <div className="space-y-2">
                    {user.bioLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 transition-colors group"
                      >
                        <FaviconIcon url={link} className="w-4 h-4" />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground truncate">
                          {link}
                        </span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {user.tags && user.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {t("trustLevel")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.tags.map((tag, index) => {
                    const getTrustRankColor = (tag: string) => {
                      if (tag.includes('system_trust_veteran')) return 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                      if (tag.includes('system_trust_trusted')) return 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                      if (tag.includes('system_trust_known')) return 'bg-green-500/20 text-green-300 border-green-500/50'
                      if (tag.includes('system_trust_basic')) return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                      return 'bg-secondary text-secondary-foreground'
                    }
                    return (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className={`text-sm ${getTrustRankColor(tag)}`}
                      >
                        {tag.replace('system_trust_', '').replace('_', ' ')}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}

            {user.badges && user.badges.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Badges
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {user.badges.map((badge, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        badge.showcased 
                          ? 'bg-primary/10 border border-primary/20 hover:bg-primary/15' 
                          : 'bg-secondary/50 hover:bg-secondary/70'
                      }`}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage 
                          src={badge.badgeImageUrl} 
                          alt={badge.badgeDescription}
                          draggable={false}
                        />
                        <AvatarFallback className="bg-primary/10">
                          <Award className="w-5 h-5 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <span className="text-sm font-medium">{badge.badgeDescription}</span>
                        {badge.showcased && (
                          <div className="flex items-center gap-1 mt-1">
                            <CheckCircle className="w-3 h-3 text-primary" />
                            <span className="text-xs text-primary">Showcased</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {(user.publicWorlds && user.publicWorlds.length > 0) || (user.groups && user.groups.length > 0) ? (
          <>
            <Separator />
            <div className="space-y-8">
              {user.publicWorlds && user.publicWorlds.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4 text-xl flex items-center gap-2">
                    <Globe className="w-6 h-6" />
                    {t("publicWorlds")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.publicWorlds.slice(0, 4).map((world, index) => (
                      <Link
                        key={index}
                        href={`/world/${world.id}`}
                        className="group block"
                      >
                        <Card className="p-4 hover:shadow-md transition-all duration-300 group-hover:border-primary/50">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12 rounded-lg">
                              <AvatarImage 
                                src={world.thumbnailImageUrl} 
                                alt={world.name} 
                                className="object-cover" 
                                draggable={false}
                              />
                              <AvatarFallback className="bg-primary/10 rounded-lg">
                                <Globe className="w-6 h-6 text-primary" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate group-hover:text-primary transition-colors">{world.name}</h4>
                              {world.visitCount && (
                                <p className="text-sm text-muted-foreground">
                                  {t("visits")}: {world.visitCount.toLocaleString()}
                                </p>
                              )}
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {user.groups && user.groups.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4 text-xl flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    {t("publicGroups")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.groups.slice(0, 4).map((group, index) => (
                      <Link
                        key={index}
                        href={`/group/${group.groupId}`}
                        className="group block"
                      >
                        <Card className="p-4 hover:shadow-md transition-all duration-300 group-hover:border-primary/50">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12 rounded-lg">
                              <AvatarImage 
                                src={group.iconUrl} 
                                alt={group.name} 
                                className="object-cover" 
                                draggable={false}
                              />
                              <AvatarFallback className="bg-primary/10 rounded-lg">
                                <Users className="w-6 h-6 text-primary" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate group-hover:text-primary transition-colors">{group.name}</h4>
                              {group.memberCount && (
                                <p className="text-sm text-muted-foreground">
                                  {t("memberCount")}: {group.memberCount.toLocaleString()}
                                </p>
                              )}
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};
