import { ANNOUNCEMENTS } from "@/lib/site";
import { Marquee } from "@/components/ui/marquee";

export function AnnouncementBar() {
  return (
    <div className="bg-ink py-2 text-[0.58rem] uppercase tracking-[0.24em] text-paper/75">
      <div className="container-luxe">
        <Marquee items={ANNOUNCEMENTS} />
      </div>
    </div>
  );
}
