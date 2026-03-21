# QR Studio

A modern, browser-based QR code generator. No installs, no sign-ups — just open and generate.

## Features

- **5 content types** — URL, plain text, email (with subject & body), phone number, and WiFi credentials
- **Customization** — choose foreground/background colors, output size (200–500 px), and error correction level
- **Download** — save as PNG with one click
- **Copy** — copy the image directly to your clipboard
- **Dark / light mode** — auto-saved to `localStorage`
- **Fully static** — zero dependencies, zero build step, deploys anywhere

## Tech

- Vanilla HTML, CSS, and JavaScript
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) for QR generation
- Deployed via GitHub Pages

## Local development

No build tooling required. Just open `index.html` in a browser:

```bash
git clone https://github.com/sid7631/qr-code-generator.git
cd qr-code-generator
open index.html        # macOS
# or: start index.html  (Windows)
# or: xdg-open index.html (Linux)
```

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via the included Actions workflow.

## License

MIT © [Siddharth Sarkar](https://github.com/sid7631)
