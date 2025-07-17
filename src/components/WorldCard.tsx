"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VRChatWorld } from "@/types/vrchat";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorldCardProps {
  world: VRChatWorld;
}

export const WorldCard: React.FC<WorldCardProps> = ({ world }) => {
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
          {world.thumbnailImageUrl && (
            <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden">
              <img
                draggable={false}
                src={world.thumbnailImageUrl}
                alt={world.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <CardTitle className="text-2xl">{world.name}</CardTitle>
            {world.authorName && (
              <CardDescription className="text-base">
                {t("author")}: {world.authorName}
              </CardDescription>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {world.capacity && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">{t("capacity")}:</span>
                  {formatNumber(world.capacity)}
                </span>
              )}
              {world.visitCount && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">{t("visits")}:</span>
                  {formatNumber(world.visitCount)}
                </span>
              )}
              {world.favorites && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">{t("favorites")}:</span>
                  {formatNumber(world.favorites)}
                </span>
              )}
              {world.occupants !== undefined && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">{t("occupants")}:</span>
                  {formatNumber(world.occupants)}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {world.description && (
          <div className="animate-slideIn">
            <h3 className="font-semibold mb-2 text-lg">{t("description")}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {world.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {world.releaseStatus && (
              <div>
                <h3 className="font-semibold mb-1">{t("releaseStatus")}</h3>
                <span className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded">
                  {world.releaseStatus}
                </span>
              </div>
            )}

            {world.publicationDate && (
              <div>
                <h3 className="font-semibold mb-1">{t("createdAt")}</h3>
                <p className="text-muted-foreground">
                  {formatDate(world.publicationDate)}
                </p>
              </div>
            )}

            {world.heat !== undefined && (
              <div>
                <h3 className="font-semibold mb-1">{t("heat")}</h3>
                <p className="text-muted-foreground">
                  {formatNumber(world.heat)}
                </p>
              </div>
            )}

            {world.featured && (
              <div>
                <span className="inline-block px-3 py-1 text-sm bg-primary text-primary-foreground rounded-full">
                  {t("featured")}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {world.tags && world.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">{t("tags")}</h3>
                <div className="flex flex-wrap gap-2">
                  {world.tags.map((tag, index) => (
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

            {world.instances && world.instances.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">{t("instances")}</h3>
                <div className="space-y-2">
                  {world.instances.slice(0, 3).map((instance, index) => (
                    <div
                      key={index}
                      className="p-3 bg-secondary/30 rounded-lg text-sm"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {instance.name || instance.instanceId}
                        </span>
                        <span className="text-muted-foreground">
                          {instance.userCount || 0}/{instance.capacity || 0}
                        </span>
                      </div>
                      {instance.type && (
                        <span className="text-xs text-muted-foreground">
                          {instance.type}
                        </span>
                      )}
                    </div>
                  ))}
                  {world.instances.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{world.instances.length - 3} more instances
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
