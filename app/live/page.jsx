import LiveScheduleView from "@/components/participant/LiveScheduleView";
import styles from "@/components/participant/DashboardShell.module.css";

export default function PublicLivePage() {
  return (
    <div className={`${styles.shell} relative w-[100vw] min-h-screen -ml-[50vw] left-1/2 bg-[#0A0A0A] text-[#F5F5F0]`}>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(245,245,240,0.18) 1px, transparent 1px),
            repeating-radial-gradient(
              circle at center,
              transparent 0px,
              transparent 120px,
              rgba(245,245,240,0.05) 121px,
              transparent 122px
            )
          `,
          backgroundSize: "32px 32px, 100% 100%"
        }}
      />
      <div className="relative z-10">
        <LiveScheduleView />
      </div>
    </div>
  );
}