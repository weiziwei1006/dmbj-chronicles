/**
 * 解析事件 ID，返回事件序号
 */
export function parseEventId(eventId: string): number | null {
  const match = eventId.match(/^event_(\d+)$/);
  if (!match) return null;
  return parseInt(match[1], 10);
}

/**
 * 生成事件详情页的路由路径
 */
export function eventRoute(characterId: string, eventId: string): string {
  return `/${characterId}/${eventId}`;
}

/**
 * 生成角色主页的路由路径
 */
export function characterRoute(characterId: string): string {
  return `/${characterId}/`;
}

/**
 * 验证角色 ID 是否有效
 */
export function isValidCharacterId(id: string): boolean {
  const validIds = ['wuxie', 'zhangqiling', 'wangpangzi'];
  return validIds.includes(id);
}

/**
 * 从 URL slug 中提取事件 ID
 */
export function extractEventIdFromSlug(slug: string[] | string | undefined): string {
  if (!slug) return '';
  if (Array.isArray(slug)) return slug[0] || '';
  return slug;
}
