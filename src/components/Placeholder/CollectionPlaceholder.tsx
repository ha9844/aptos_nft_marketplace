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
    <div className="p-8 dark:bg-[#121212] dark:text-gray-200  pt-16">
      <div className="flex  gap-6">
        <div>
          <Skeleton
            width={144}
            height={144}
            baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
            highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
          />
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center w-full">
              <div className="text-3xl font-bold">
                <Skeleton
                  width={200}
                  height={36}
                  baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
                  highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 text-xs py-2">
            <Skeleton
              width={300}
              height={16}
              baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
              highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
            />
          </div>
          <Skeleton
            height={50}
            baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
            highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-8 mt-8 border-t-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            height={400}
            baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
            highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
            key={i}
          />
        ))}
      </div>
    </div>
  );
};

export default CollectionPlaceholder;
