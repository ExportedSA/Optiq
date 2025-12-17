export { AlertDispatcher, alertDispatcher } from "./dispatcher";
export type { DispatchOptions, DispatchResult } from "./dispatcher";

export { EmailChannelHandler, emailChannelHandler } from "./email";
export { 
  InAppChannelHandler, 
  inAppChannelHandler,
  getUnreadNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getNotificationCount,
} from "./in-app";

export {
  priorityToNumber,
  severityToPriority,
} from "./types";

export type {
  NotificationChannel,
  NotificationStatus,
  NotificationPriority,
  NotificationPayload,
  InAppNotification,
  EmailNotification,
  NotificationResult,
  NotificationChannelHandler,
} from "./types";
