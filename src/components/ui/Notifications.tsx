import { NotificationType, SystemNotification, useGlobalContext } from "../../context/GlobalContext";
import { Alert, AlertColor, AlertTitle, Container } from "@mui/material";
import { useEffect } from "react";

const severityMap = new Map([
  [NotificationType.ERROR, "error"],
  [NotificationType.WARNING, "warning"],
  [NotificationType.INFO, "info"],
  [NotificationType.SUCCESS, "success"],
]);

function capitalize(s: string): string {
  return s && s[0].toUpperCase() + s.slice(1);
}

const Notification = ({ notification }: { notification: SystemNotification }) => {
  const { closeNotification } = useGlobalContext();
  useEffect(() => {
    if (notification.id && !notification.keepOpen) {
      const timeout = setTimeout(() => {
        closeNotification(notification.id);
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [notification.id]);

  return (
    <Alert
      severity={severityMap.get(notification.type) as AlertColor}
      key={notification.id}
      onClose={() => closeNotification(notification.id)}
      sx={{ mb: 1 }}
    >
      <AlertTitle>{notification.header || capitalize(severityMap.get(notification.type)!)}</AlertTitle>
      {notification.message}
    </Alert>
  );
};

export const Notifications = () => {
  const { notifications } = useGlobalContext();
  if (notifications.length === 0) {
    return null;
  }
  return (
    <Container sx={{ py: 1 }}>
      {notifications.map((notification: SystemNotification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </Container>
  );
};
