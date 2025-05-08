"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchTo = currentLocale === "zh" ? "en" : "zh";

  const handleSwitch = () => {
    const newPathname = pathname.replace(`/${currentLocale}`, `/${switchTo}`);
    router.push(newPathname);
  };

  return (
    <button onClick={handleSwitch}>
      切换到 {switchTo === "zh" ? "中文" : "English"}
    </button>
  );
}
