import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
const CollectionPlaceholder = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className="max-w-[1024px] mx-auto pb-24 pt-8 sm:px-8 lg:px-0">
      <div className="flex justify-between gap-24">
        <div className="w-1/2">
          <Skeleton
            height={460}
            baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
            highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
          />
        </div>
        <div className="w-1/2 flex flex-col justify-between">
          <Skeleton
            height={35}
            baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
            highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
          />
          <div className="my-4">
            <Skeleton
              height={35}
              width={150}
              baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
              highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
            />
            <Skeleton
              height={35}
              baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
              highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
            />
          </div>
          <div className="my-4">
            <Skeleton
              height={35}
              width={150}
              baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
              highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
            />
            <Skeleton
              height={35}
              baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
              highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
            />
          </div>
          <div className="my-4">
            <Skeleton
              height={35}
              width={150}
              baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
              highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
            />
            <Skeleton
              height={35}
              baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
              highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
            />
          </div>
          <div className="my-8">
            <Skeleton
              height={50}
              width={200}
              baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
              highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPlaceholder;
