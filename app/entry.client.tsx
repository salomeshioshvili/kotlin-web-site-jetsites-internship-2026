import { startTransition } from "react";
import React from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

startTransition(() => {
  hydrateRoot(
    document,
    React.createElement(HydratedRouter, null),
  );
  // `common.js` mutates `<html>` classes (OS / UA). Running it before hydration
  // mismatches server HTML and causes React hydration to fail on the client.
  queueMicrotask(() => {
    void import("../static/js/page/common.js");
  });
});

