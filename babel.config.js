module.exports = (api) => {
  api.cache(true)
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'babel-plugin-root-import',
        {
          root: __dirname,
          rootPathSuffix: 'src',
          rootPathPrefix: '~/'
        }
      ],
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true
        }
      ]
    ]
  }
}
