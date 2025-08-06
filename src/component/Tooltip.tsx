type TooltipProps = {
  text: string,
  show?: boolean,
  children: React.ReactNode
}

export default function Tooltip({ text, show = true, children }: TooltipProps) {
  return (
    <div className="relative group inline-block">
      { children }
      {show && <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-500 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
        { text }
      </div>}
    </div>
  );
}
  