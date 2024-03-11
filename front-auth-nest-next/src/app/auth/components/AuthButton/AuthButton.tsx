import { getAuthURL } from "@/lib/utils"
import React from "react"

interface AuthButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  text: string
  credential: string
}

const AuthButton = React.forwardRef<HTMLAnchorElement, AuthButtonProps>(
  ({ children, text, credential }, ref) => {
    return (
      <a
        ref={ref}
        href={getAuthURL(credential)}
        className="flex w-full items-center justify-center gap-3 rounded-lg border bg-foreground px-3 py-2 font-medium text-background transition-colors hover:bg-foreground/80 dark:bg-background dark:text-foreground dark:hover:border-primary/50"
      >
        {children}
        <span className="capitalize">{text}</span>
      </a>
    )
  }
)

export { AuthButton }
