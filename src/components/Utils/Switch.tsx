const switchBg = (toggled: string) => {
  if (toggled === "dark") return "bg-tangerine-yellow";
  return "bg-dark-charcoal";
};
import { useTheme } from "next-themes";

const Switch: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = () => {
  const { theme, setTheme } = useTheme();
  return (
    <button
      className={`relative inline-flex items-center h-5 w-10 rounded-full duration-150 group ${switchBg(
        theme!
      )}`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <div
        className={`duration-150 inline-block aspect-square h-5 bg-white transform group-hover:shadow-5xl rounded-full ${
          theme === "dark" ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default Switch;
