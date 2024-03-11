export default function Home() {
  return (
    <main className="flex min-h-[90vh] flex-col items-center justify-between p-24">
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
    </main>
  )
}
