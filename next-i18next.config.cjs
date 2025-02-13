/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "es",
    localeDetection: true
  },
  localePath: "./public/locales",
  reactStrictMode: true,
};
