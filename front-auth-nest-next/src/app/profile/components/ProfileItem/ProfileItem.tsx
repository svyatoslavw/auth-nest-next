interface IProfileItem {
  name: string
  value: string
  symbol?: JSX.Element
}

const ProfileItem = ({ name, value, symbol = <>&Xi;</> }: IProfileItem) => {
  return (
    <div className="group rounded-lg border border-transparent px-6 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
      <h2 className={`mb-3 text-2xl font-semibold capitalize`}>
        {name}{" "}
        <span className="inline-block transition-transform group-hover:translate-x-2 motion-reduce:transform-none">
          {symbol}
        </span>
      </h2>
      <p className={`m-0 max-w-[30ch] truncate text-base opacity-50`}>
        {value ? value : `You don't have ${name}`}
      </p>
    </div>
  )
}

export { ProfileItem }
