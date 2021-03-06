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
    dest: './dist/js/',
    watch: ['./src/**/*.es6', './src/**/*.ract']
  },
  html: {
    src: './src/index.html',
    dest: './dist/'
  },
  fonts: {
    src: ['./node_modules/bootstrap/dist/fonts/*'],
    dest: './dist/fonts/'
  },
  images: {
    src: ['./src/img/*', './src/svg/*'],
    dest: './dist/img/'
  },
  less: {
    src: './src/css/styles.less',
    dest: './dist/css/',
    watch: ['./src/**/*.less']
  },
  test: {
    watch: ['./src/**/*.es6', './src/**/*.ract', './test/unit/**/*.es6']
  }
};
