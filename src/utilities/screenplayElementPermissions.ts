export interface ScreenplayElementAccess {
  userId?: string | null;
  supervisorAtAuthorTime?: boolean | null;
}

export interface ScreenplayActorAccess {
  currentUserId?: string | null;
  canManageScreenplay?: boolean;
  isScreenplaySupervisor?: boolean;
}

export function canModerateScreenplayElement(
  element: ScreenplayElementAccess,
  actor: ScreenplayActorAccess
): boolean {
  if (!actor.currentUserId) return false;
  if (element.userId === actor.currentUserId) return true;

  if (element.supervisorAtAuthorTime === true) {
    return actor.isScreenplaySupervisor === true;
  }

  return actor.canManageScreenplay === true || actor.isScreenplaySupervisor === true;
}

export function canResolveScreenplayElement(
  element: ScreenplayElementAccess,
  actor: ScreenplayActorAccess
): boolean {
  if (canModerateScreenplayElement(element, actor)) return true;

  return element.supervisorAtAuthorTime === true &&
    actor.canManageScreenplay === true;
}
