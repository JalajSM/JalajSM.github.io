# Personal website

A simple static site with a black and light green palette, Roboto font, and white text. Client-side script is written in **TypeScript** and compiled to JavaScript.

## Structure

```
├── index.html          # Home
├── about.html          # Background / CV
├── projects.html       # Projects
├── css/
│   ├── variables.css   # Colors, spacing, font
│   └── style.css       # Layout and components
├── js/
│   ├── script.ts       # TypeScript source
│   └── script.js       # Compiled (run `npm run build` to regenerate)
├── images/             # Add images here
├── package.json
├── tsconfig.json
└── README.md
```

## Build (TypeScript)

After changing `js/script.ts`, recompile:

```bash
npm install   # once
npm run build # compiles script.ts → script.js
```

Use `npm run watch` to recompile on save.

## Run locally

Open `index.html` in a browser, or use a local server:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve
```

Then visit `http://localhost:8000`.

## Customize

- **Content:** Edit each HTML file and replace placeholder text.
- **Colors:** Change `--color-*` values in `css/variables.css`.
- **Projects:** Add more `.project-card` blocks in `projects.html` and optional images in `images/`.
