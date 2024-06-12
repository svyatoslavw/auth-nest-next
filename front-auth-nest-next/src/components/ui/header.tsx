"use client"

import { ChromeIcon } from "../icons/ChromeIcon"
import { ThemeSwitcher } from "./theme-switcher"
import Image from "next/image"

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4">
      <a href="/">
        {/*<ChromeIcon className=" text-gray-900 dark:text-gray-100" />*/}
        <Image alt="Logo" src={"/logo.png"} width={48} height={48} className="invert-0 dark:invert" />
      </a>
      <div>
        <ThemeSwitcher />
      </div>
    </header>
  )
}

export default Header
