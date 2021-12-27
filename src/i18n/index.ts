import app from "@/constants/app";
import { IObject } from "@/types/interface";
import { getCache } from "@/utils/cache";
import elEn from "element-plus/lib/locale/lang/en";
import elZh from "element-plus/lib/locale/lang/zh-cn";
import { createI18n } from "vue-i18n";
import { CacheLang } from "../constants/cacheKey";
import en_us from "./lang/en-US";
import zh_cn from "./lang/zh-CN";

//自动索引page文件夹下的语言文件，支持按业务文件夹处理
const dynamicPageLangs: IObject<IObject<string>> = {};
const files: IObject = import.meta.globEager("./page/**/*.ts");
Object.keys(files).forEach((x: string) => {
  const keys = x.split("/");
  const lang = keys[keys.length - 1].replace(".ts", "");
  const ls = dynamicPageLangs[lang] || {};
  dynamicPageLangs[lang] = { ...ls, ...files[x].default };
});

/**
 * 索引语言字段 src/i18n/lang 为框架语言 src/i18n/page 为业务界面语言
 */
export const supportLangs: IObject = {
  "zh-CN": {
    langName: "简体中文",
    el: elZh.el,
    ...zh_cn,
    ...dynamicPageLangs["zh-CN"]
  },
  "en-US": {
    langName: "English",
    el: elEn.el,
    ...en_us,
    ...dynamicPageLangs["en-US"]
  }
};

/**
 * 取语言名称
 * @param lang
 * @returns
 */
export const getLangName = (lang: string): string => {
  return supportLangs[lang]?.langName;
};

/**
 * 取默认语言
 * @returns
 */
export const getLocaleLang = (): string => {
  const lang = getCache(CacheLang, { isParse: false }, app.defaultLang);
  return lang;
};

export const initI18n = createI18n({
  locale: getLocaleLang(),
  fallbackLocale: app.defaultLang,
  messages: supportLangs
});
