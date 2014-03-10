module.exports = function(config) {
  config.set({
    files : [
      'test/lib/socket.io.js',
      'node_modules/evented.io-client/evented.js',
      'test/unit/**/*.js',
    ],
    basePath: '../',
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['Chrome'],
    autoWatch: false,
    singleRun: true,
    colors: true
  });
};
