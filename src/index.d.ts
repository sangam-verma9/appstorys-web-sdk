declare module "typescript-websdk" {
  import React from "react";

  // Banner Component Props
  export interface BannerProps {
    access_token: string;
    campaigns: any[];
    user_id: string;
  }
  export const Banner: React.FC<BannerProps>;

  // Floater Component Props
  export interface FloaterProps {
    access_token: string;
    campaigns: any[];
    user_id: string;
  }
  export const Floater: React.FC<FloaterProps>;

  // Pip Component Props
  // In your library's `index.d.ts` file:
  export interface PipProps {
    access_token: string;
    campaigns: any[];
    user_id: string;
    data: {
      campaigns: any[];
      user_id: string;
    }; // Add this line
  }

  // Stories Component Props
  export interface StoriesProps {
    campaigns: any[];
    user_id: string;
  }
  export const Stories: React.FC<StoriesProps>;

  // Utilities
  export const TrackScreen: (
    app_id: string,
    screen_name: string
  ) => Promise<any[]>;
  export const TrackUser: (
    user_id: string,
    attributes: Record<string, any>
  ) => Promise<void>;
  export const UserActionTrack: (
    user_id: string,
    campaign_id: string,
    event_type: string,
    story_slide?: string
  ) => Promise<any[]>;
  export const VerifyAccount: (
    account_id: string,
    app_id: string
  ) => Promise<void>;
  export const VerifyUser: (
    user_id: string,
    campaigns: any[],
    attributes?: Record<string, any>
  ) => Promise<{ user_id: string; campaigns: any[] }>;
}
