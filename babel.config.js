module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './src',
            '@assets': './assets',
            '#/models': './src/models',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
