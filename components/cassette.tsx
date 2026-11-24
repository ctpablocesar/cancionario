import { cn } from "@/lib/utils"

const MAX_TITLE_LENGTH = 24

function truncateTitle(title: string) {
  if (title.length <= MAX_TITLE_LENGTH) return title
  return `${title.slice(0, MAX_TITLE_LENGTH - 1).trimEnd()}…`
}

function Reel({
  cx,
  radius,
  spinning,
}: {
  cx: number
  radius: number
  spinning: boolean
}) {
  const cy = 132

  return (
    <g>
      <circle cx={cx} cy={cy} r={radius} fill="var(--tape)" />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="var(--ink)"
        strokeOpacity="0.25"
      />
      <g className={cn("reel", spinning && "reel-spinning")}>
        <circle
          cx={cx}
          cy={cy}
          r={12.5}
          fill="var(--label)"
          stroke="var(--ink)"
          strokeOpacity="0.4"
        />
        {Array.from({ length: 6 }).map((_, index) => (
          <rect
            key={index}
            x={cx - 1.6}
            y={cy - 11}
            width={3.2}
            height={7}
            rx={1.6}
            fill="var(--ink)"
            opacity="0.45"
            transform={`rotate(${index * 60} ${cx} ${cy})`}
          />
        ))}
        <circle cx={cx} cy={cy} r={3.4} fill="var(--ink)" opacity="0.55" />
      </g>
    </g>
  )
}

export function Cassette({
  title = "tu nombre",
  left = "cancionario",
  right = "mixtape",
  progress = 0,
  spinning = false,
  className,
}: {
  title?: string
  left?: string
  right?: string
  progress?: number
  spinning?: boolean
  className?: string
}) {
  const clamped = Math.min(1, Math.max(0, progress))
  const leftRadius = 36 - 14 * clamped
  const rightRadius = 22 + 14 * clamped

  return (
    <svg
      viewBox="0 0 400 252"
      aria-hidden="true"
      focusable="false"
      className={cn("block h-auto w-full", className)}
    >
      <rect
        x="6"
        y="16"
        width="388"
        height="220"
        rx="18"
        fill="var(--shell)"
        stroke="var(--ink)"
        strokeOpacity="0.18"
        strokeWidth="2"
      />

      <circle cx="24" cy="32" r="3" fill="var(--ink)" opacity="0.22" />
      <circle cx="376" cy="32" r="3" fill="var(--ink)" opacity="0.22" />
      <circle cx="24" cy="220" r="3" fill="var(--ink)" opacity="0.22" />
      <circle cx="376" cy="220" r="3" fill="var(--ink)" opacity="0.22" />

      <rect
        x="30"
        y="38"
        width="340"
        height="150"
        rx="3"
        fill="var(--label)"
        stroke="var(--ink)"
        strokeOpacity="0.12"
      />
      <rect x="30" y="38" width="340" height="10" fill="var(--cobalt)" />
      <rect x="30" y="48" width="340" height="4" fill="var(--amber)" />

      <text
        x="46"
        y="84"
        className="font-hand"
        fontWeight="600"
        fontSize="28"
        fill="var(--ink)"
      >
        {truncateTitle(title)}
      </text>

      <rect
        x="92"
        y="94"
        width="216"
        height="76"
        rx="8"
        fill="var(--ink)"
        opacity="0.94"
      />
      <rect
        x="92"
        y="94"
        width="216"
        height="76"
        rx="8"
        fill="none"
        stroke="var(--label)"
        strokeOpacity="0.12"
      />

      <Reel cx={138} radius={leftRadius} spinning={spinning} />
      <Reel cx={262} radius={rightRadius} spinning={spinning} />

      <text
        x="46"
        y="184"
        fontSize="12"
        letterSpacing="1.2"
        fill="var(--ink)"
        opacity="0.62"
      >
        {left}
      </text>
      <text
        x="354"
        y="184"
        textAnchor="end"
        fontSize="12"
        letterSpacing="1.2"
        fill="var(--ink)"
        opacity="0.62"
      >
        {right}
      </text>

      <rect x="118" y="202" width="164" height="34" rx="6" fill="var(--ink)" />
      <rect
        x="118"
        y="202"
        width="164"
        height="34"
        rx="6"
        fill="none"
        stroke="var(--label)"
        strokeOpacity="0.14"
      />
      <circle cx="146" cy="219" r="4" fill="var(--label)" opacity="0.35" />
      <circle cx="254" cy="219" r="4" fill="var(--label)" opacity="0.35" />
    </svg>
  )
}
