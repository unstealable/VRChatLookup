"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ApiStatusIndicator } from "@/components/ApiStatusIndicator";
import { useVersion } from "@/hooks/useVersion";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FooterProps {
  showDisclaimer: boolean;
}

export default function Footer({ showDisclaimer }: FooterProps) {
  const { t, language } = useLanguage();
  const { version } = useVersion();
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  return (
    <footer className="mt-auto bg-background/50 backdrop-blur-sm border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-start gap-1 w-full md:w-auto">
            <div className="text-sm text-muted-foreground">
              {appName && (
                <span>
                  {currentYear} &copy; {appName} - {t("copyrightText")}
                </span>
              )}
            </div>
            {showDisclaimer && (
              <span className="mt-1 px-2 py-0.5 rounded bg-muted/60 border border-border/50 text-[10px] text-muted-foreground/80">
                {t("disclaimerFooter")}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-1 w-full md:w-auto">
            {version && (
              <div className="flex items-center gap-1 text-xs bg-muted/50 px-2 py-1 rounded border border-border/50">
                <span className="text-muted-foreground">
                  {t("version") || "Version"}:
                </span>
                <Link
                  href={`/${language}/versions`}
                  className="font-mono font-medium text-foreground/80 hover:text-foreground transition-colors text-xs"
                  title={t("viewVersions") || "View versions"}
                >
                  {version.latest}
                </Link>
              </div>
            )}
            {appUrl && (
              <span className="font-medium text-foreground/80 flex items-center gap-2 mt-1 text-xs">
                <ApiStatusIndicator />
                {appUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
