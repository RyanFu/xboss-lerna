module.exports = {
  presets: [
    [
      '@xboss/cli/preset',
      {
        loose: process.env.BUILD_TARGET === 'package',
        enableObjectSlots: false,
      },
    ],
  ],
};
