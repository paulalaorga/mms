/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "es",
    localeDetection: true
  },
  localePath: "public/locales", // Asegura que se usen los archivos en public/locales
};
