import { ChakraProvider } from "@chakra-ui/react";
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "@/components/ui/color-mode";
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  globalCss: {
    "#markdown p": {
      display: "block",
      marginBlockStart: "1em",
      marginBlockEnd: "1em",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
      lineHeight: "200%",
    },
    "#markdown li": {
      display: "list-item",
      textAlign: "-webkit-match-parent",
    },
    "#markdown ul": {
      display: "block",
      listStyleType: "disc",
      marginBlockStart: "1em",
      marginBlockEnd: "1em",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
      paddingInlineStart: "40px",
    },
    "#markdown ol": {
      display: "block",
      listStyleType: "decimal",
      marginBlockStart: "1em",
      marginBlockEnd: "1em",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
      paddingInlineStart: "40px",
    },
    "#markdown h1": {
      display: "block",
      fontSize: "2em",
      marginBlockStart: "0.67em",
      marginBlockEnd: "0.67em",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
      fontWeight: "bold",
    },
    "#markdown h2": {
      display: "block",
      fontSize: "1.5em",
      marginBlockStart: "0.83em",
      marginBlockEnd: "0.83em",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
      fontWeight: "bold",
    },
    "#markdown h3": {
      display: "block",
      fontSize: "1.17em",
      marginBlockStart: "1em",
      marginBlockEnd: "1em",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
      fontWeight: "bold",
    },
    "#markdown h4": {
      display: "block",
      fontSize: "1em",
      marginBlockStart: "1.33em",
      marginBlockEnd: "1.33em",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
      fontWeight: "bold",
    },
    "#markdown h5": {
      display: "block",
      fontSize: "0.83em",
      marginBlockStart: "1.67em",
      marginBlockEnd: "1.67em",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
      fontWeight: "bold",
    },
    "#markdown h6": {
      display: "block",
      fontSize: "0.83em",
      marginBlockStart: "1.67em",
      marginBlockEnd: "1.67em",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
      fontWeight: "bold",
      color: "gray.400",
    },
    "#markdown a": {
      color: "teal.400",
    },
    "#markdown pre": {
      display: "block",
      fontFamily: "monospace",
      whiteSpace: "pre",
      margin: "1em 0",
    },
    "#markdown strong": {
      fontWeight: "bold",
    },
    "#markdown em": { fontStyle: "italic" },
    "#markdown blockquote": {
      display: "block",
      marginBlockStart: "1em",
      marginBlockEnd: "1em",
      marginInlineStart: "40px",
      marginInlineEnd: "40px",

      borderLeft: "5px solid #ccc",
      margin: "1.5em 10px",
      padding: "0.5em 10px 0.5em 10px",
    },
    "#markdown code": { fontFamily: "monospace" },
    "#markdown table": {
      borderSpacing: "0",
      borderCollapse: "collapse",
      display: "block",
      marginTop: "0",
      marginBottom: "16px",
      width: "max-content",
      maxWidth: "100%",
      overflow: "auto",
    },
    "#markdown tr": {
      borderTopWidth: "3px",
    },
    "#markdown tr:nth-child(2n)": {
      backgroundColor: "gray.800",
    },
    "#markdown td, #markdown th": {
      padding: "6px 13px",
      borderTopWidth: "3px",
    },
    "#markdown th": {
      fontWeight: "600",
    },
    "#markdown table img": {
      backgroundColor: "transparent",
    },
    "#markdown .footnotes": {
      fontSize: "smaller",
      color: "#8b949e",
      borderTop: "1px solid #30363d",
    },
    "#markdown .sr-only": {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      wordWrap: "normal",
      border: "0",
    },
    "#markdown [data-footnote-ref]::before": {
      content: `" ["`,
    },
    "#markdown [data-footnote-ref]::after": {
      content: `"]"`,
    },
  },
});

const mainTheme = createSystem(defaultConfig, customConfig);

export function MainProvider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={mainTheme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
