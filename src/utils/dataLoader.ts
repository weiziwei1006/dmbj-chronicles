import type {
  EventDetail,
  CharacterProfile,
  EventWithPerspective,
  TimelineEvent,
  TimelineMeta,
  Perspective,
  WorldData,
  SiteSettings,
} from '../types/data';

/**
 * 加载站点设置
 */
export async function loadSettings(): Promise<SiteSettings> {
  const mod = await import('../data/config/settings.json');
  return mod.default as SiteSettings;
}

/**
 * 加载全局时间线
 */
export async function loadTimeline(): Promise<TimelineEvent[]> {
  const mod = await import('../data/common/timeline.json');
  return mod.default as TimelineEvent[];
}

/**
 * 加载世界观数据
 */
export async function loadWorldData(): Promise<WorldData> {
  const mod = await import('../data/common/world.json');
  return mod.default as WorldData;
}

/**
 * 加载所有角色列表
 */
export async function loadAllCharacters(): Promise<CharacterProfile[]> {
  const characterIds = ['wuxie'];
  const characters: CharacterProfile[] = [];

  for (const id of characterIds) {
    try {
      const mod = await import(`../data/characters/${id}/profile.json`);
      characters.push(mod.default as CharacterProfile);
    } catch (e) {
      console.error(`Failed to load character: ${id}`, e);
    }
  }

  return characters;
}

/**
 * 加载指定角色的所有事件（合并公共信息 + 时间线元信息 + 角色视角）
 */
export async function loadCharacterEvents(
  characterId: string
): Promise<EventWithPerspective[]> {
  const timelineMod = await import('../data/common/timeline.json');
  const timeline = timelineMod.default as TimelineEvent[];
  const events: EventWithPerspective[] = [];

  for (const item of timeline) {
    if (!item.characterIds.includes(characterId)) continue;

    try {
      const commonMod = await import(`../data/common/events/${item.id}.json`);
      const common = commonMod.default as Omit<EventWithPerspective, 'perspective' | keyof TimelineMeta>;

      const timelineMeta: TimelineMeta = {
        title: item.title,
        timeLabel: item.timeLabel,
        location: item.location,
        order: item.order,
      };

      let perspective: Perspective;
      try {
        const perspMod = await import(
          `../data/characters/${characterId}/perspectives/${item.id}.json`
        );
        perspective = perspMod.default as Perspective;
      } catch {
        perspective = {
          eventId: item.id,
          narrative: [],
          keyQuotes: [],
          emotion: '',
        };
      }

      events.push({ ...common, ...timelineMeta, perspective });
    } catch (e) {
      console.error(`Failed to load event: ${item.id}`, e);
    }
  }

  return events;
}

/**
 * 加载单个事件的完整详情（公共信息 + 时间线元信息 + 指定角色视角）
 */
export async function loadEventDetail(
  characterId: string,
  eventId: string
): Promise<EventDetail> {
  const timelineMod = await import('../data/common/timeline.json');
  const timeline = timelineMod.default as TimelineEvent[];
  const timelineItem = timeline.find((e) => e.id === eventId);

  const timelineMeta: TimelineMeta = timelineItem
    ? {
        title: timelineItem.title,
        timeLabel: timelineItem.timeLabel,
        location: timelineItem.location,
        order: timelineItem.order,
      }
    : {
        title: eventId,
        timeLabel: '',
        location: '',
        order: 0,
      };

  const commonMod = await import(`../data/common/events/${eventId}.json`);
  const common = commonMod.default as Omit<EventDetail, 'perspective' | keyof TimelineMeta>;

  let perspective: Perspective;
  try {
    const perspMod = await import(
      `../data/characters/${characterId}/perspectives/${eventId}.json`
    );
    perspective = perspMod.default as Perspective;
  } catch {
    perspective = {
      eventId,
      narrative: [],
      keyQuotes: [],
      emotion: '',
    };
  }

  return { ...common, ...timelineMeta, perspective };
}

/**
 * 获取单个角色信息
 */
export async function loadCharacterProfile(
  characterId: string
): Promise<CharacterProfile | null> {
  try {
    const mod = await import(`../data/characters/${characterId}/profile.json`);
    return mod.default as CharacterProfile;
  } catch {
    return null;
  }
}

/**
 * 获取事件在时间线中的位置信息（上一事件 / 下一事件）
 */
export async function getEventNavigation(
  characterId: string,
  currentEventId: string
): Promise<{ prev: TimelineEvent | null; next: TimelineEvent | null }> {
  const timeline = await loadTimeline();
  const characterEvents = timeline.filter((e) => e.characterIds.includes(characterId));
  const currentIndex = characterEvents.findIndex((e) => e.id === currentEventId);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? characterEvents[currentIndex - 1] : null,
    next:
      currentIndex < characterEvents.length - 1
        ? characterEvents[currentIndex + 1]
        : null,
  };
}
