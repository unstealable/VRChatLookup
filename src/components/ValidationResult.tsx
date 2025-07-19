"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface ValidationResultProps {
  type: "username" | "email";
  value: string;
  userExists: boolean | null;
  message: string;
  error?: string | null;
  isLoading?: boolean;
}

export const ValidationResult: React.FC<ValidationResultProps> = ({
  type,
  value,
  userExists,
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

    // Use userExists to determine availability (false = available, true = taken)
    if (type === "username") {
      if (userExists === false) return t("usernameAvailable");
      if (userExists === true) return t("usernameUnavailable");
    } else if (type === "email") {
      if (userExists === false) return t("emailAvailable");
      if (userExists === true) return t("emailUnavailable");
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
                  : userExists === false
                  ? "text-green-600"
                  : userExists === true
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
                : userExists === true
                ? t("exists")
                : userExists === false
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
                : userExists === false
                ? t("available")
                : userExists === true
                ? t("taken")
                : t("unknown")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
