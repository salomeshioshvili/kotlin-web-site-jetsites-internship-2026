import React from "react";

import GlobalHeader from "../../static/js/ktl-component/header/index.jsx";
import GlobalFooter from "../../static/js/ktl-component/footer/index.jsx";

import { OverviewPage } from "../../static/js/page/index/index.js";

const PRODUCT_WEB_URL =
  "https://github.com/JetBrains/kotlin/releases/tag/v1.6.20";

export default function IndexRoute() {
  return React.createElement(
    "div",
    { className: "global-layout" },
    React.createElement(GlobalHeader, {
      productWebUrl: PRODUCT_WEB_URL,
      hasSearch: false,
      dropdownTheme: "dark",
      currentUrl: "/",
    }),
    React.createElement(
      "div",
      { className: "g-layout global-content" },
      React.createElement(OverviewPage, null),
    ),
    React.createElement(GlobalFooter, null),
  );
}

