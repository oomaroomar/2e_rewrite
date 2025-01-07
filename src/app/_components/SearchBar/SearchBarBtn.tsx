interface BtnProps {
  onClick: () => void;
  text?: string;
  text2?: string;
  textsize?: "xs" | "sm" | "base" | "lg" | "2xl";
  children?: React.ReactNode;
}

export function BorderedSearchBarBtn({
  onClick,
  text,
  text2,
  children,
}: BtnProps) {
  return (
    <button
      onClick={onClick}
      className="hidden items-center rounded-md py-1.5 pl-2 pr-3 text-sm leading-6 text-zinc-400 shadow-sm ring-1 ring-pink-400/30 hover:ring-pink-400 lg:flex"
    >
      {children ? children : text}
      <span className="ml-auto flex-none pl-3 text-xs font-semibold text-zinc-400">
        {text2 ? text2 : ""}
      </span>
    </button>
  );
}

export function SearchBarBtn({
  onClick,
  text,
  text2,
  textsize = "base",
  children,
}: BtnProps) {
  return (
    <button
      onClick={onClick}
      className={`hidden items-center lg:flex text-${textsize} rounded-md py-1.5 pl-2 pr-3 leading-6 text-black hover:text-pink-600`}
    >
      {children ? children : text}
      <span className="ml-auto flex-none pl-3 text-sm font-semibold">
        {text2 ? text2 : ""}
      </span>
    </button>
  );
}
