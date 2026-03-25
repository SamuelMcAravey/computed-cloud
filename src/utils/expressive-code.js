import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

export const expressiveCodeOptions = {
  themes: ["github-dark"],
  plugins: [pluginLineNumbers()],
  useThemedSelectionColors: true,
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
      inlineButtonForeground: "rgb(226 232 240 / 0.96)",
      inlineButtonBackgroundIdleOpacity: "0",
      inlineButtonBackgroundHoverOrFocusOpacity: "0",
      inlineButtonBackgroundActiveOpacity: "0",
      inlineButtonBorderOpacity: "0",
      codeSelectionBackground: "rgb(96 165 250 / 0.32)",
      uiSelectionBackground: "rgb(96 165 250 / 0.32)",
      uiSelectionForeground: "rgb(255 255 255)",
    },
    lineNumbers: {
      foreground: "rgb(148 163 184 / 0.9)",
      highlightForeground: "rgb(226 232 240 / 0.98)",
    },
  },
};
