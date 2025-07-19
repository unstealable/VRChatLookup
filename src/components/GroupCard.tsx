"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VRChatGroup } from "@/types/vrchat";
import { useLanguage } from "@/contexts/LanguageContext";
import { DomainLink } from "@/components/DomainLink";

interface GroupCardProps {
  group: VRChatGroup;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const { t } = useLanguage();

  const formatNumber = (num?: number) => {
    if (!num) return "0";
    return num.toLocaleString();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto animate-fadeIn hover:shadow-lg transition-all duration-300">
      <CardHeader className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {group.iconUrl && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden">
              <img
                draggable={false}
                src={group.iconUrl}
                alt={group.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <CardTitle className="text-2xl">{group.name}</CardTitle>
            {group.shortCode && (
              <CardDescription className="text-base font-mono">
                {group.shortCode}
              </CardDescription>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {group.memberCount && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">{t("memberCount")}:</span>
                  {formatNumber(group.memberCount)}
                </span>
              )}
              {group.ownerDisplayName && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">{t("owner")}:</span>
                  {group.ownerDisplayName}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {group.bannerUrl && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <img
              draggable={false}
              src={group.bannerUrl}
              alt={`${group.name} banner`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        {group.description && (
          <div className="animate-slideIn">
            <h3 className="font-semibold mb-2 text-lg">{t("description")}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {group.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {group.created_at && (
              <div>
                <h3 className="font-semibold mb-1">{t("createdAt")}</h3>
                <p className="text-muted-foreground">
                  {formatDate(group.created_at)}
                </p>
              </div>
            )}

            {group.languages && group.languages.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">{t("languages")}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.languages.map((language, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {group.tags && group.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">{t("tags")}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag, index) => (
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
          </div>

          <div className="space-y-4">
            {group.rules && (
              <div>
                <h3 className="font-semibold mb-2">{t("rules")}</h3>
                <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                  {group.rules}
                </p>
              </div>
            )}

            {group.links && group.links.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">{t("links")}</h3>
                <div className="space-y-1">
                  {group.links.map((link, index) => (
                    <DomainLink
                      key={index}
                      url={link}
                      className="bg-secondary/30 hover:bg-secondary/50"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
