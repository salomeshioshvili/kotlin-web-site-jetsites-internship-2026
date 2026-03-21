import { startTransition } from "react";
import React from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

// Run the legacy initialization script that detects OS/browser and sets classes on the HTML element
import "../static/js/page/common.js";

startTransition(() => {
  hydrateRoot(
    document,
    React.createElement(HydratedRouter, null),
  );
});

