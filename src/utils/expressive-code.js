import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

export const expressiveCodeOptions = {
  themes: ["github-dark"],
  plugins: [pluginLineNumbers()],
  frames: {
    showCopyToClipboardButton: true,
  },
  defaultProps: {
    frame: "terminal",
    showLineNumbers: true,
  },
  styleOverrides: {
    frames: {
      terminalTitlebarBackground: "rgb(15 23 42 / 0.9)",
      terminalTitlebarBorderBottomColor: "rgb(148 163 184 / 0.26)",
      terminalTitlebarDotsForeground: "rgb(var(--cc-text))",
      terminalTitlebarDotsOpacity: "1",
      terminalTitlebarForeground: "rgb(226 232 240 / 0.96)",
      inlineButtonForeground: "rgb(15 23 42)",
      inlineButtonBackgroundIdleOpacity: "0.12",
      inlineButtonBackgroundHoverOrFocusOpacity: "0.18",
      inlineButtonBackgroundActiveOpacity: "0.24",
      inlineButtonBorderOpacity: "0.24",
    },
    lineNumbers: {
      foreground: "rgb(148 163 184 / 0.9)",
      highlightForeground: "rgb(226 232 240 / 0.98)",
    },
  },
};
