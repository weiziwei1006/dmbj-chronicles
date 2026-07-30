export interface TimelineEvent {
  id: string;
  order: number;
  title: string;
  timeLabel: string;
  location: string;
  characterIds: string[];
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  location: string;
}

export interface EventCommon {
  id: string;
  summary: string;
  publicDescription?: string;
  sceneVisuals: {
    mainScene: string;
    visualCues: string;
    colorPalette: string[];
    atmosphere: string;
    bgm?: string;
    ambient?: string;
  };
  relatedItems: string[];
  relatedCharacters: string[];
  scenes: Scene[];
}

/** 从时间线中获取的元信息 */
export interface TimelineMeta {
  title: string;
  timeLabel: string;
  location: string;
  order: number;
}

export interface CharacterProfile {
  id: string;
  name: string;
  alias: string;
  avatar: string;
  themeColor: string;
  themeClass: string;
  bio: string;
  defaultBgm?: string;
}

export interface NarrativeParagraph {
  paragraph: string;
  innerThought?: string;
}

export interface Perspective {
  eventId: string;
  narrative: NarrativeParagraph[];
  keyQuotes: string[];
  emotion: string;
}

/** 事件详情（含时间线元信息 + 角色视角） */
export interface EventDetail extends EventCommon, TimelineMeta {
  perspective: Perspective;
}

/** 角色事件列表项（含时间线元信息 + 角色视角） */
export interface EventWithPerspective extends EventCommon, TimelineMeta {
  perspective: Perspective;
}

export interface Character {
  profile: CharacterProfile;
  events: EventWithPerspective[];
}

export interface WorldData {
  families: string[];
  factions: string[];
  keyItems: Record<string, string>;
}

export interface SiteSettings {
  defaultCharacter: string;
  audioEnabled: boolean;
  siteTitle: string;
}
