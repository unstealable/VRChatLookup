export interface VRChatUser {
  pronouns: string;
  ageVerificationStatus: boolean;
  ageVerified?: string;
  id: string;
  displayName: string;
  username?: string;
  bio?: string;
  bioLinks?: string[];
  profilePicOverride?: string;
  profilePicOverrideThumbnail?: string;
  currentAvatarImageUrl?: string;
  currentAvatarThumbnailImageUrl?: string;
  status?: "online" | "offline" | "busy" | "ask me" | "join me" | "private";
  statusDescription?: string;
  location?: string;
  worldId?: string;
  instanceId?: string;
  tags?: string[];
  developerType?: string;
  last_login?: string;
  last_platform?: string;
  allowAvatarCopying?: boolean;
  dateJoined?: string;
  friendKey?: string;
  isFriend?: boolean;
  state?: string;
  note?: string;
  userIcon?: string;
  badges?: Badge[];
  trustRank?: string;
  platform?: string;
  groups?: VRChatGroup[];
  publicWorlds?: VRChatWorld[];
  publicAvatars?: VRChatAvatar[];
}

export interface VRChatWorld {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  thumbnailImageUrl?: string;
  authorId?: string;
  authorName?: string;
  capacity?: number;
  visitCount?: number;
  favorites?: number;
  publicationDate?: string;
  releaseStatus?: string;
  tags?: string[];
  occupants?: number;
  instances?: WorldInstance[];
  featured?: boolean;
  heat?: number;
  popularity?: number;
  created_at?: string;
  updated_at?: string;
}

export interface VRChatGroup {
  groupId: string;
  id: string;
  name: string;
  shortCode?: string;
  description?: string;
  iconUrl?: string;
  bannerUrl?: string;
  memberCount?: number;
  ownerId?: string;
  ownerDisplayName?: string;
  tags?: string[];
  languages?: string[];
  links?: string[];
  rules?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VRChatAvatar {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  thumbnailImageUrl?: string;
  authorId?: string;
  authorName?: string;
  tags?: string[];
  releaseStatus?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WorldInstance {
  id: string;
  location?: string;
  instanceId?: string;
  name?: string;
  worldId?: string;
  type?: string;
  ownerId?: string;
  tags?: string[];
  active?: boolean;
  full?: boolean;
  userCount?: number;
  capacity?: number;
  platforms?: {
    android?: number;
    standalonewindows?: number;
  };
}

export interface Badge {
  badgeId: string;
  badgeImageUrl: string;
  badgeDescription: string;
  showcased: boolean;
}

export interface SearchResponse {
  users?: VRChatUser[];
  worlds?: VRChatWorld[];
  groups?: VRChatGroup[];
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  status?: number;
}

export type SearchType = "users" | "worlds" | "groups" | "availability";
export type SearchMethod = "name" | "id" | "username" | "email";
