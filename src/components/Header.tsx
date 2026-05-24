import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="px-4 h-14 flex items-center" style={{ background: "#F5F0EA", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
      <Link href="/" className="flex items-center gap-2">
        <Image src="/icon.png" alt="SmileTrack" width={30} height={30} className="rounded-lg" />
        <span style={{ fontFamily: "Georgia, serif", fontSize: "15px", color: "#2C2C2A", letterSpacing: "0.04em" }}>SmileTrack</span>
      </Link>
    </header>
  );
}
