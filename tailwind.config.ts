import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@shadcn/ui/**/*.js',
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      height: {
        '47': '90vh',
        "46": "80vh",
        "45": "70vh",
      },
      width: {
        "9/10": '90%',
        "8.5/10": "85%",
        "8/10": "80%",
      },
      colors: {
        'my-purple': '#2D2233',
      },
    },
  },
  plugins: [],
};
export default config;
