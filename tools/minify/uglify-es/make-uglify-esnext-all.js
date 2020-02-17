const makeUglify = require('./make-uglify');

makeUglify('dist/global/routes.esnext.umd.js', {
  compress: {
    inline: false
  },
});
