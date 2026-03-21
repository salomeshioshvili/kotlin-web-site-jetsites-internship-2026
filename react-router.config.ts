import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "app",
  ssr: true,
  prerender: ["/"],
  serverModuleFormat: "esm",
} satisfies Config;

