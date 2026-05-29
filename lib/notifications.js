/** Delete a notification and its read receipts. */
export async function deleteNotificationById(db, notificationId) {
  await db.from("notification_reads").delete().eq("notification_id", notificationId);

  const { error } = await db.from("notifications").delete().eq("id", notificationId);
  if (error) throw error;
}

/** Delete every notification (and read receipts). Returns count removed. */
export async function deleteAllNotifications(db) {
  const { data: rows, error: listErr } = await db.from("notifications").select("id");
  if (listErr) throw listErr;

  const ids = (rows || []).map((r) => r.id);
  if (!ids.length) return 0;

  await db.from("notification_reads").delete().in("notification_id", ids);
  const { error } = await db.from("notifications").delete().in("id", ids);
  if (error) throw error;

  return ids.length;
}
