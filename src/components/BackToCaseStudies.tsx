import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

type Props = { className?: string };

export function BackToCaseStudies({ className }: Props) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Only offer smart-back when there's an in-app history entry.
    setCanGoBack(
      typeof window !== "undefined" && window.history.length > 1,
    );
  }, []);

  const baseClass =
    className ??
    "inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors duration-300 ease-out";

  const handleClick = (e: React.MouseEvent) => {
    if (!canGoBack) return; // let anchor navigate
    e.preventDefault();
    router.history.back();
  };

  return (
    <a href="/#case-studies" onClick={handleClick} className={baseClass}>
      <ArrowLeft className="h-3.5 w-3.5" /> Back to Case Studies
    </a>
  );
}
