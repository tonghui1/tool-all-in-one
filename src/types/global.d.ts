declare module 'twitter-url-directv2' {
  interface TwitterVideoInfo {
    download: string;
    thumb?: string;
    text?: string;
  }
  
  function twitterGetUrl(url: string): Promise<TwitterVideoInfo>;
  export default twitterGetUrl;
} 

declare module 'twitter-video-downloader' {
  interface TwitterVideo {
    bitrate: number;
    content_type: string;
    url: string;
  }
  
  interface TwitterVideoInfo {
    videos: TwitterVideo[];
    picture?: string;
  }
  
  export function getInfo(url: string): Promise<TwitterVideoInfo>;
} 

declare module 'video-url-link' {
  interface TwitterVideo {
    bitrate: number;
    content_type: string;
    url: string;
  }
  
  interface TwitterInfo {
    videos: TwitterVideo[];
    full_text?: string;
    user?: {
      screen_name: string;
    };
  }
  
  interface Twitter {
    getInfo(url: string, callback: (error: any, info: TwitterInfo) => void): void;
  }
  
  export const twitter: Twitter;
} 