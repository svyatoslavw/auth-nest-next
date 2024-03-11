"use client"

import { ChromeIcon } from "../icons/ChromeIcon"
import { ThemeSwitcher } from "./theme-switcher"

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4">
      <a href="/">
        <ChromeIcon className=" text-gray-900 dark:text-gray-100" />
      </a>
      <div>
        <ThemeSwitcher />
      </div>
    </header>
  )
}

export default Header
