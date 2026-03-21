import React from "react";
import { Links, Meta, Outlet, ScrollRestoration, Scripts } from "react-router";

import "../static/css/styles-v2.scss";
import "../static/css/grid.scss";

export default function App() {
  return React.createElement(
    "html",
    { lang: "en", className: "page__index-new page_restyled_v2" },
    React.createElement(
      "head",
      null,
      React.createElement("meta", { charSet: "utf-8" }),
      React.createElement("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      }),
      React.createElement("title", null, "Kotlin Programming Language"),
      React.createElement("link", {
        rel: "preload",
        href: "/assets/fonts/JetBrainsMono/JetBrainsMono-Regular.woff2",
        as: "font",
      }),
      React.createElement("link", {
        rel: "preload",
        href: "/assets/fonts/JetBrainsMono/JetBrainsMono-Bold.woff2",
        as: "font",
      }),
      React.createElement("link", {
        rel: "preload",
        href: "/assets/fonts/JetBrainsMono/JetBrainsMono-Italic.woff2",
        as: "font",
      }),
      React.createElement(Meta, null),
      React.createElement(Links, null),
    ),
    React.createElement(
      "body",
      null,
      React.createElement(Outlet, null),
      React.createElement(ScrollRestoration, null),
      React.createElement(Scripts, null),
    ),
  );
}

