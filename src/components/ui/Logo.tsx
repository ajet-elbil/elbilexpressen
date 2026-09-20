// Elbilexpressen wordmark. The "Elbil" line uses the brand green; "EXPRESSEN" keeps the brand red.

export function Logo({ className = 'logo-mark' }: { className?: string }) {
  return (
    <svg
      className={className}
      /* Cropped to the artwork; the original 0 0 800 300 canvas is mostly empty space. */
      viewBox="250 94 355 170"
      role="img"
      aria-label="Elbilexpressen"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="400"
        y="210"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="132"
        fontWeight="900"
        fill="#4CAF50"
        letterSpacing="-5"
      >
        Elbil
      </text>
      <text
        x="556"
        y="132"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="26"
        fontWeight="700"
        fill="#4CAF50"
        letterSpacing="0"
      >
        ™
      </text>
      <g transform="translate(538, 243) skewX(-8) translate(-538, -243)">
        <text
          x="538"
          y="243"
          textAnchor="end"
          textLength="235"
          lengthAdjust="spacingAndGlyphs"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="38"
          fontWeight="900"
          fill="#E30613"
          stroke="#E30613"
          strokeWidth="0.8"
          letterSpacing="-1"
        >
          EXPRESSEN
        </text>
      </g>
    </svg>
  )
}
