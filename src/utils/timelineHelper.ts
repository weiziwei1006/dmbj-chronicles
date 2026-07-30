import type { TimelineEvent, EventWithPerspective } from '../types/data';

/**
 * 按时间顺序排序事件
 */
export function sortTimelineByOrder(events: TimelineEvent[]): TimelineEvent[] {
  return [...events].sort((a, b) => a.order - b.order);
}

/**
 * 筛选指定角色参与的事件
 */
export function filterEventsByCharacter(
  events: TimelineEvent[],
  characterId: string
): TimelineEvent[] {
  return events.filter((e) => e.characterIds.includes(characterId));
}

/**
 * 根据 ID 查找时间线事件
 */
export function findTimelineEvent(
  events: TimelineEvent[],
  eventId: string
): TimelineEvent | undefined {
  return events.find((e) => e.id === eventId);
}

/**
 * 获取事件在角色时间线中的索引
 */
export function getEventIndex(
  events: EventWithPerspective[],
  eventId: string
): number {
  return events.findIndex((e) => e.id === eventId);
}

/**
 * 获取下一个事件
 */
export function getNextEvent(
  events: EventWithPerspective[],
  currentEventId: string
): EventWithPerspective | null {
  const index = getEventIndex(events, currentEventId);
  if (index === -1 || index >= events.length - 1) return null;
  return events[index + 1];
}

/**
 * 获取上一个事件
 */
export function getPrevEvent(
  events: EventWithPerspective[],
  currentEventId: string
): EventWithPerspective | null {
  const index = getEventIndex(events, currentEventId);
  if (index <= 0) return null;
  return events[index - 1];
}
