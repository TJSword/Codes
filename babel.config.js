const parodPlugins = []
if (process.env.NODE_ENV === 'prod') {
  parodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins:[
    ...parodPlugins
  ]
}
