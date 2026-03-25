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
      terminalTitlebarBackground: "transparent",
      terminalTitlebarBorderBottomColor: "rgb(var(--cc-border) / 0.85)",
      terminalTitlebarDotsForeground: "rgb(var(--cc-text))",
      terminalTitlebarDotsOpacity: "1",
      terminalTitlebarForeground: "rgb(var(--cc-muted))",
      inlineButtonForeground: "rgb(var(--cc-text))",
      inlineButtonBackgroundIdleOpacity: "0.22",
      inlineButtonBackgroundHoverOrFocusOpacity: "0.32",
      inlineButtonBackgroundActiveOpacity: "0.4",
      inlineButtonBorderOpacity: "0.28",
    },
    lineNumbers: {
      foreground: "rgb(var(--cc-muted) / 0.72)",
      highlightForeground: "rgb(var(--cc-text) / 0.88)",
    },
  },
};
