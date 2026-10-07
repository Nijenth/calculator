# Advanced Calculator

A beautiful, feature-rich web-based calculator built with HTML, CSS, and JavaScript.

## Features

- **Standard & Scientific Operations:** Supports basic arithmetic operations along with advanced mathematical functions like `sin`, `cos`, `tan`, `log`, `ln`, `sqrt`, exponents, `π`, and `e`.
- **Expression Evaluation:** Powered by [Math.js](https://mathjs.org/) for robust and accurate mathematical expression evaluation, including automatic parenthesis closing.
- **Calculation History:** Keeps track of your past calculations. The history is saved locally in your browser (`localStorage`), so it persists across sessions. You can view, clear, or click on a previous history item to load its result.
- **Theme Switcher:** Includes a built-in toggle for Light and Dark modes. Your preference is remembered for future visits.
- **Audio Feedback:** Features a Web Audio API synthesizer that provides satisfying click sounds for a more tactile user experience.
- **Keyboard Support:** Fully supports keyboard input for typing numbers, operators, `Enter` (calculate), `Backspace` (delete), and `Escape` (clear).
- **Responsive Design:** A clean, modern UI (using the *Inter* font) with dynamic hover/click ripple effects. The layout adapts smoothly to both desktop and mobile screens.

## Technologies Used

- **HTML5:** Structure and semantics.
- **CSS3:** Styling, variables for theme management, flexbox/grid layouts, and animations.
- **JavaScript (ES6):** DOM manipulation, event handling, history management, and Web Audio API integration.
- **Math.js:** External library for evaluating mathematical expressions securely and accurately.

## Getting Started

Since this is a static web application, no build steps or server configurations are required.

1. Clone or download the repository to your local machine.
2. Open `index.html` in any modern web browser.
3. Start calculating!

## Usage

- **Clicking:** Use your mouse or touch screen to interact with the keypad.
- **Typing:** Use your physical keyboard to enter expressions.
- **History:** Click the history icon (clock-like SVG in the top bar) to open the history sidebar. Click any history item to reuse its result.
- **Theme:** Click the sun/moon toggle switch to change the appearance.

## License

This project is open-source and free to use or modify.
