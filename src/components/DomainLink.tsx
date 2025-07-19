"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { FaviconIcon } from "@/components/FaviconIcon";

interface DomainLinkProps {
  url: string;
  className?: string;
}

export const DomainLink: React.FC<DomainLinkProps> = ({ url, className = "" }) => {
  // Extract domain from URL
  const getDomain = (urlString: string) => {
    try {
      // Add protocol if missing
      const fullUrl = urlString.startsWith('http') ? urlString : `https://${urlString}`;
      const urlObject = new URL(fullUrl);
      return urlObject.hostname.replace('www.', '');
    } catch {
      // If URL parsing fails, try to extract domain manually
      const cleanUrl = urlString.replace(/^https?:\/\//, '').replace(/^www\./, '');
      return cleanUrl.split('/')[0].split('?')[0];
    }
  };

  // Get clean URL for linking
  const getCleanUrl = (urlString: string) => {
    try {
      // Add protocol if missing
      return urlString.startsWith('http') ? urlString : `https://${urlString}`;
    } catch {
      return `https://${urlString}`;
    }
  };

  const domain = getDomain(url);
  const cleanUrl = getCleanUrl(url);

  return (
    <a
      href={cleanUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 transition-colors group max-w-full ${className}`}
    >
      <FaviconIcon url={cleanUrl} className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm text-muted-foreground group-hover:text-foreground truncate min-w-0">
        {domain}
      </span>
      <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
    </a>
  );
};