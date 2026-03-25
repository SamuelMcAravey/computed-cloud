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
      terminalTitlebarBackground: "var(--ec-frm-trmBg)",
      terminalTitlebarBorderBottomColor: "transparent",
      terminalTitlebarDotsForeground: "rgb(var(--cc-text))",
      terminalTitlebarDotsOpacity: "1",
      terminalTitlebarForeground: "rgb(var(--cc-muted))",
      inlineButtonForeground: "rgb(var(--cc-text))",
      inlineButtonBackgroundIdleOpacity: "0.16",
      inlineButtonBackgroundHoverOrFocusOpacity: "0.24",
      inlineButtonBackgroundActiveOpacity: "0.3",
      inlineButtonBorderOpacity: "0.2",
    },
    lineNumbers: {
      foreground: "rgb(var(--cc-muted) / 0.5)",
      highlightForeground: "rgb(var(--cc-text) / 0.82)",
    },
  },
};
