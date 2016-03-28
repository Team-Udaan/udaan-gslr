var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var through = require('through2');
var cleanCSS = require('gulp-clean-css');
var fs = require('fs');

var vendor = {
  scripts: [
    'bower_components/angular/angular.min.js',
    'bower_components/angular-route/angular-route.min.js',
    'bower_components/angular-animate/angular-animate.min.js',
    'bower_components/angular-aria/angular-aria.min.js',
    'bower_components/angular-material/angular-material.min.js'
  ],
  styles: [
    'bower_components/angular-material/angular-material.min.css'
  ]
};

function removeDev(config) {
  return through.obj(function (file, enc, cb) {
    var fileContents = file.contents.toString(enc);
    file.contents = new Buffer(fileContents.replace(/\s*<!-- begin:dev -->[^]*<!-- end:dev -->\s*/g, ''));
    cb(null, file);
  });
}

function uncommentProd(config) {
  return through.obj(function (file, enc, cb) {
    var fileContents = file.contents.toString(enc);
    var commentedProd = fileContents.match(/<!-- begin:prod -->[^]*<!-- end:prod -->/g)[0];
    var uncommentedProd = commentedProd
      .replace(/<!-- begin:prod -->/, '\n')
      .replace(/\s*<!-- end:prod -->\s*/, '')
      .replace(/(<!--|-->)/g, '');
    file.contents = new Buffer(fileContents.replace(commentedProd, uncommentedProd));
    cb(null, file);
  });
}

function insertTemplates(config) {
  return through.obj(function (file, enc, cb) {
    var fileContents = file.contents.toString(enc), templates, templateString = '';
    if (fs.existsSync('src/templates')) {
      templates = fs.readdirSync('src/templates');
      templateString = templates.reduce(function (templateStr, template) {
        return templateStr.concat(
          '<script type="text/ng-template" id="' + template + '">\n' + fs.readFileSync('src/templates/' + template) + '\n</script>\n'
        );
      }, '');
      file.contents = new Buffer(fileContents.replace(/<!-- insert:templates -->/, templateString));
    }
    cb(null, file);
  });
}

// Index
gulp.task('index', function () {
  return gulp.src('src/index.html')
    .pipe(removeDev())
    .pipe(uncommentProd())
    .pipe(insertTemplates())
    .pipe(gulp.dest('dist'));
});

// Scripts
gulp.task('scripts', function () {
  return gulp.src('src/scripts/**/*.js')
    .pipe(concat('scripts.min.js'))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(gulp.dest('dist'));
});

// Style
gulp.task('styles', function () {
  return gulp.src('src/styles/*.css')
    .pipe(concat('styles.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts:vendor', function () {
  return gulp.src(vendor.scripts)
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('styles:vendor', function () {
  return gulp.src(vendor.styles)
    .pipe(concat('vendor.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
});

// Build
gulp.task('build', ['index', 'scripts', 'styles']);

// Build Vendor
gulp.task('build:vendor', ['scripts:vendor', 'styles:vendor']);

// Build All
gulp.task('build:all', ['build:vendor', 'build']);

// Watch
gulp.task('watch', function () {
  gulp.watch('src/index.html', ['index']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/styles.css', ['styles']);
});

// Default
gulp.task('default', ['build']);