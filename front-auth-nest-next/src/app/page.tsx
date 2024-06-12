"use client"
import { useLogoutMutation } from "@/api/mutations/useLogoutMutation"

export default function Home() {
  const { mutate } = useLogoutMutation()

  return (
    <main className="container flex flex-col items-center justify-center gap-3 p-24">
      <a
        href="/profile"
        className="group rounded-lg border border-transparent px-8 py-4 transition-colors hover:border-foreground/15 hover:bg-foreground/5 "
        rel="noopener noreferrer"
      >
        <h2 className={`mb-3 text-2xl font-semibold`}>
          My Profile{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
          if you are logged in, you will receive information about your profile.
        </p>
      </a>

      <button
        onClick={mutate}
        className="group rounded-lg border border-transparent px-8 py-4 text-start transition-colors hover:border-red-500/15 hover:bg-red-500/10"
      >
        <h2 className={`mb-3 text-2xl font-semibold`}>
          Logout{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
          The button is intended to log out of the system{" "}
        </p>
      </button>
    </main>
  )
}
