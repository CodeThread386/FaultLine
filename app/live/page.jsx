import LiveScheduleView from "@/components/participant/LiveScheduleView";

export default function PublicLivePage() {
  return (
    <div className="relative w-[100vw] min-h-screen -ml-[50vw] left-1/2 bg-[#0A0A0A] text-[#F5F5F0]">
      <LiveScheduleView />
    </div>
  );
}