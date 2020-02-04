Package.describe({
  name: 'goodideal:flow-router-extra-breadcrumb',
  version: '0.3.0',
  // Brief, one-line summary of the package.
  summary: 'Breadcrumb For Flow Router extra',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/goodideal/flow-router-breadcrumb.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');
  api.use([
    'ecmascript', 'templating', 'underscore',
    'ostrio:flow-router-extra@3.6.0',
  ], 'client');

  api.addFiles('flow-router-breadcrumb.js', 'client');
  api.addFiles('flow-router-breadcrumb.html', 'client');
});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('theara:flow-router-breadcrumb');
  api.addFiles('flow-router-breadcrumb-tests.js');
});
