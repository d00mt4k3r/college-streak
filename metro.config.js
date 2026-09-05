// Нужен, чтобы можно было импортировать .svg файлы как обычные React-компоненты
// (например, для пользовательских SVG-иконок).
//
// Специально обёрнуто в try/catch: если react-native-svg-transformer почему-то
// не установился (например, npm install прервался или запускался до того, как
// пакет попал в package.json), проект всё равно запустится на обычном Metro —
// просто импорт .svg работать не будет, пока пакет не установится. Так одна
// отсутствующая зависимость не может полностью заблокировать запуск приложения.
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

try {
  const svgTransformerPath = require.resolve("react-native-svg-transformer");
  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: svgTransformerPath,
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };
} catch (e) {
  console.warn(
    "[metro.config.js] react-native-svg-transformer не найден — SVG-иконки работать не будут, " +
    "пока не выполнишь: npm install react-native-svg-transformer --save-dev\n" +
    "PNG-иконки при этом продолжат работать как обычно."
  );
}

module.exports = config;
