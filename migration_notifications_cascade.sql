-- Optional: cascade deletes from notifications → notification_reads

alter table notification_reads
  drop constraint if exists notification_reads_notification_id_fkey;

alter table notification_reads
  add constraint notification_reads_notification_id_fkey
  foreign key (notification_id) references notifications(id) on delete cascade;
