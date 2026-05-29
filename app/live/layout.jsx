import { EventSyncProvider } from "@/components/providers/EventSyncProvider";

export default function LiveLayout({ children }) {
  return <EventSyncProvider publicMode>{children}</EventSyncProvider>;
}
