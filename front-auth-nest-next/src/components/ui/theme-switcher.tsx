import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  const changeTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <div>
      <input
        type="checkbox"
        name="switcher"
        id="switcher"
        className="input-switcher"
        checked={theme === "dark"}
        onKeyDown={changeTheme}
        onDragEnter={changeTheme}
        onChange={changeTheme}
      />
      <label
        className={cn("label-switcher", " bg-foreground/10 text-primary dark:text-primary")}
        htmlFor="switcher"
      >
        <MoonIcon size={16} />
        <span className="toggler-switcher"></span>
        <SunIcon size={16} />
      </label>
    </div>
  )
}
