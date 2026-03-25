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
      terminalTitlebarBorderBottomColor: "rgb(var(--cc-border) / 0.78)",
      terminalTitlebarDotsForeground: "rgb(var(--cc-text))",
      terminalTitlebarDotsOpacity: "1",
      terminalTitlebarForeground: "rgb(var(--cc-text) / 0.96)",
      inlineButtonForeground: "rgb(var(--cc-text))",
      inlineButtonBackgroundIdleOpacity: "0.34",
      inlineButtonBackgroundHoverOrFocusOpacity: "0.5",
      inlineButtonBackgroundActiveOpacity: "0.62",
      inlineButtonBorderOpacity: "0.42",
    },
    lineNumbers: {
      foreground: "rgb(var(--cc-muted) / 0.88)",
      highlightForeground: "rgb(var(--cc-text) / 0.98)",
    },
  },
};
