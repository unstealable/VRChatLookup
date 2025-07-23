"use client";

import { Languages, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "./ThemeToggle";
import { HomeButton } from "./HomeButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLang: "fr" | "en") => {
    setLanguage(newLang);

    // Update URL with new language prefix
    let newPath = pathname;

    // Remove current language prefix if it exists
    if (pathname.match(/^\/(fr|en)(\/|$)/)) {
      newPath = pathname.replace(/^\/(fr|en)/, "");
    }

    // Add new language prefix
    const finalPath = `/${newLang}${newPath || ""}`;
    router.push(finalPath);
  };

  return (
    <nav className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <HomeButton />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Languages className="h-4 w-4" />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-36">
          <DropdownMenuItem
            onClick={() => handleLanguageChange("en")}
            className="flex items-center gap-2"
          >
            <span>🇺🇸</span>
            <span>English</span>
            {language === "en" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleLanguageChange("fr")}
            className="flex items-center gap-2"
          >
            <span>🇫🇷</span>
            <span>Français</span>
            {language === "fr" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ThemeToggle />
    </nav>
  );
}
