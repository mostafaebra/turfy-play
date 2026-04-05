import API from './api';

export const checkNewNotifications = async () => {
  const response = await API.get("/Turfy/IsThereNewNotificationEndpoint/Handle");
  return response.data;
};

export const fetchNotifications = async () => {
  const response = await API.get("/Turfy/GetNotificationsEndpoint/Handle");
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await API.post("/Turfy/MarkAllAsReadNotificationsEndpoint/Handle");
  return response.data;
};

export const markAsOpened = async (id) => {
  const response = await API.post(`/Turfy/MarkAsOpenedEndpoint/Handle?id=${id}`);
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await API.delete("/Turfy/DeleteNotificationEndpoint/Handle", { data: { id } });
  return response.data;
};

export const triggerTestNotification = async () => {
  const response = await API.post("/api/TestTestEndpoint/TestNotifications");
  return response.data;
};