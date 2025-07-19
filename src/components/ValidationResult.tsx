"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface ValidationResultProps {
  type: "username" | "email";
  value: string;
  exists: boolean | null;
  available: boolean | null;
  message: string;
  error?: string | null;
  isLoading?: boolean;
}

export const ValidationResult: React.FC<ValidationResultProps> = ({
  type,
  value,
  exists,
  available,
  message,
  error,
  isLoading = false,
}) => {
  const { t } = useLanguage();

  const getTitle = () => {
    return `${t("availabilityCheck")}`;
  };

  const getTranslatedMessage = () => {
    if (error) return error;
    if (isLoading) return t("checkingAvailability");

    // Translate the API response message
    if (type === "username") {
      if (available === true) return t("usernameAvailable");
      if (available === false) return t("usernameUnavailable");
    } else if (type === "email") {
      if (available === true) return t("emailAvailable");
      if (available === false) return t("emailUnavailable");
    }

    return message;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fadeIn">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{getTitle()}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
              {type === "username" ? t("searchUsername") : t("searchEmail")}
            </p>
            <p className="text-xl font-mono font-semibold break-all">{value}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">{t("validationResult")}</h3>
            <p
              className={`text-lg ${
                error
                  ? "text-red-600"
                  : available === true
                  ? "text-green-600"
                  : available === false
                  ? "text-red-600"
                  : "text-muted-foreground"
              }`}
            >
              {getTranslatedMessage()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">{t("status")}</p>
            <p className="font-semibold">
              {isLoading
                ? t("checking")
                : exists === true
                ? t("exists")
                : exists === false
                ? t("notFound")
                : t("unknown")}
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">
              {t("availability")}
            </p>
            <p className="font-semibold">
              {isLoading
                ? t("checking")
                : available === true
                ? t("available")
                : available === false
                ? t("taken")
                : t("unknown")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
