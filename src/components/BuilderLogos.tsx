/** Real brand marks for the "what did you build with" onboarding step, in
 *  each brand's own color rather than forced to one shared color. Replit,
 *  v0 (Vercel's triangle), Cursor, and Claude paths are from Simple Icons
 *  (CC0), with each brand's documented color. Bolt and Windsurf are traced
 *  from their own site favicons (bolt.new/static/favicon.svg,
 *  windsurf.com/favicon.svg) to match their actual two-tone app icons.
 *  Lovable's is traced from the gradient shape in their own favicon
 *  (lovable.dev/favicon.svg). */

type LogoProps = { className?: string };

export function ReplitLogo({ className = "size-4" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="#F26207"
      aria-hidden="true"
      className={className}
    >
      <path d="M2 1.5A1.5 1.5 0 0 1 3.5 0h7A1.5 1.5 0 0 1 12 1.5V8H3.5A1.5 1.5 0 0 1 2 6.5ZM12 8h8.5A1.5 1.5 0 0 1 22 9.5v5a1.5 1.5 0 0 1-1.5 1.5H12ZM2 17.5A1.5 1.5 0 0 1 3.5 16H12v6.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 2 22.5Z" />
    </svg>
  );
}

export function LovableLogo({ className = "size-4" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <clipPath id="lovable-mask">
        <path
          clipRule="evenodd"
          d="M54.6052 0C83.9389 0 107.719 23.8424 107.719 53.2535V73.4931H125.395C154.729 73.4931 178.508 97.3355 178.508 126.747C178.508 156.158 154.729 180 125.395 180H1.4917V53.2535C1.4917 23.8424 25.2714 0 54.6052 0Z"
        />
      </clipPath>
      <g clipPath="url(#lovable-mask)">
        <rect width="180" height="180" fill="url(#lovable-g0)" />
        <rect width="180" height="180" fill="url(#lovable-g1)" />
        <rect width="180" height="180" fill="url(#lovable-g2)" />
        <rect width="180" height="180" fill="url(#lovable-g3)" />
      </g>
      <defs>
        <radialGradient
          id="lovable-g0"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(208.43464 0 0 208.43464 79.1388 96.0857)"
        >
          <stop stopColor="#4B73FF" />
          <stop offset="1" stopColor="#4B73FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="lovable-g1"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(242.07264 0 0 208.43464 92.3162 30.3281)"
        >
          <stop stopColor="#FF66F4" />
          <stop offset="1" stopColor="#FF66F4" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="lovable-g2"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(208.43464 0 0 193.84164 117.345 7.77496)"
        >
          <stop stopColor="#FF0105" />
          <stop offset="1" stopColor="#FF0105" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="lovable-g3"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(160.67114 0 0 160.67114 94.4282 30.2969)"
        >
          <stop stopColor="#FE7B02" />
          <stop offset="1" stopColor="#FE7B02" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function BoltLogo({ className = "size-4" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect width="16" height="16" rx="4" fill="black" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.64368 11.7731C7.91976 11.7731 7.20901 11.5147 6.80099 10.9591L6.65707 11.6143L4 13L4.28684 11.6143L6.22186 3H8.59103L7.9066 6.03634C8.45941 5.44199 8.97273 5.22234 9.63083 5.22234C11.0523 5.22234 12 6.1397 12 7.81938C12 9.55074 10.9076 11.7731 8.64368 11.7731ZM9.55186 8.31036C9.55186 9.11144 8.97273 9.71871 8.22249 9.71871C7.8013 9.71871 7.4196 9.56366 7.16952 9.29233L7.53806 7.70309C7.81447 7.43176 8.13036 7.27671 8.49889 7.27671C9.06486 7.27671 9.55186 7.69017 9.55186 8.31036Z"
        fill="white"
      />
    </svg>
  );
}

export function V0Logo({ className = "size-4" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="#000000"
      aria-hidden="true"
      className={className}
    >
      <path d="m12 1.608 12 20.784H0Z" />
    </svg>
  );
}

export function CursorLogo({ className = "size-4" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="#000000"
      aria-hidden="true"
      className={className}
    >
      <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
    </svg>
  );
}

export function ClaudeLogo({ className = "size-4" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="#D97757"
      aria-hidden="true"
      className={className}
    >
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  );
}

export function WindsurfLogo({ className = "size-4" }: LogoProps) {
  return (
    <svg viewBox="0 0 1024 1024" aria-hidden="true" className={className}>
      <rect width="1024" height="1024" rx="180" fill="#F9F3E9" />
      <path
        fill="#0B100F"
        d="M897.246 286.869H889.819C850.735 286.808 819.017 318.46 819.017 357.539V515.589C819.017 547.15 792.93 572.716 761.882 572.716C743.436 572.716 725.02 563.433 714.093 547.85L552.673 317.304C539.28 298.16 517.486 286.747 493.895 286.747C457.094 286.747 423.976 318.034 423.976 356.657V515.619C423.976 547.181 398.103 572.746 366.842 572.746C348.335 572.746 329.949 563.463 319.021 547.881L138.395 289.882C134.316 284.038 125.154 286.93 125.154 294.052V431.892C125.154 438.862 127.285 445.619 131.272 451.34L309.037 705.2C319.539 720.204 335.033 731.344 352.9 735.392C397.616 745.557 438.77 711.135 438.77 667.278V508.406C438.77 476.845 464.339 451.279 495.904 451.279H495.995C515.02 451.279 532.857 460.562 543.785 476.145L705.235 706.661C718.659 725.835 739.327 737.218 763.983 737.218C801.606 737.218 833.841 705.9 833.841 667.308V508.376C833.841 476.815 859.41 451.249 890.975 451.249H897.276C901.233 451.249 904.43 448.053 904.43 444.097V294.021C904.43 290.065 901.233 286.869 897.276 286.869H897.246Z"
      />
    </svg>
  );
}
