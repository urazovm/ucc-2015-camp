module.exports.libs = [
  'logdown',
  'axios',
  'crossroads',
  'ractive',
  'hasher',
  'lodash',
  'signals',
  'rsvp',
  'bootstrap',
  'store',
  'parsleyjs',
  'socket.io-client'
];

module.exports.paths = {
  js: {
    src: './src/js/app.es6',
    dest: './cordova/www/js/',
    watch: ['./src/**/*.es6', './src/**/*.ract']
  },
  html: {
    src: './src/index.html',
    dest: './cordova/www/'
  },
  fonts: {
    src: ['./node_modules/bootstrap/dist/fonts/*'],
    dest: './cordova/www/fonts/'
  },
  images: {
    src: ['./src/img/*'],
    dest: './cordova/www/img/'
  },
  less: {
    src: './src/css/styles.less',
    dest: './cordova/www/css/',
    watch: ['./src/**/*.less']
  },
  test: {
    watch: ['./src/**/*.es6', './src/**/*.ract', './test/unit/**/*.es6']
  }
};