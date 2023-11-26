import { withUt } from "uploadthing/tw";
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default withUt({
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
}) satisfies Config;
