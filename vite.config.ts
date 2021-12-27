import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig, loadEnv, UserConfig, UserConfigExport } from "vite";
import eslint from "vite-plugin-eslint";
import html from "vite-plugin-html";
import tsconfigPaths from "vite-tsconfig-paths";
import viteSvgIcons from "vite-plugin-svg-icons";
const prefix = `monaco-editor/esm/vs`;

export default (config: UserConfig): UserConfigExport => {
  const mode = config.mode as string;
  return defineConfig({
    base: "./",
    optimizeDeps: {
      include: [
        `${prefix}/language/json/json.worker`,
        `${prefix}/language/css/css.worker`,
        `${prefix}/language/html/html.worker`,
        `${prefix}/language/typescript/ts.worker`,
        `${prefix}/editor/editor.worker`
      ]
    },
    plugins: [
      vue(),
      html({
        inject: {
          injectData: {
            apiURL: loadEnv(mode, process.cwd()).VITE_APP_API,
            title: ""
          }
        },
        minify: true
      }),
      tsconfigPaths(),
      eslint({
        cache: false,
        fix: false,
        include: ["src/**/*.ts", "src/**/*.vue"]
      }),
      viteSvgIcons({
        iconDirs: [resolve(__dirname, "src/assets/icons/svg")],
        symbolId: "icon-[dir]-[name]"
      })
    ],
    build: {
      chunkSizeWarningLimit: 1024,
      rollupOptions: {
        output: {
          manualChunks: {
            elmplus: ["element-plus"],
            monacoeditor: ["monaco-editor"],
            quill: ["quill"],
            lodash: ["lodash"],
            lib: ["sortablejs", "vxe-table", "xe-utils"],
            vlib: ["vue", "vue-router", "vuex", "vue-i18n"]
          }
        }
      }
    },
    resolve: {
      alias: {
        // 配置别名
        "@": resolve(__dirname, "./src")
      }
    },
    server: {
      open: true, // 自动启动浏览器
      host: "0.0.0.0", // localhost
      port: 8001, // 端口号
      https: false
    }
  });
};
