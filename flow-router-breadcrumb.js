import {FlowRouter} from "meteor/ostrio:flow-router-extra";

const Breadcrumb = {};
let dataArray = [];

// Register
const data = {};
Breadcrumb.register = function (route) {
  const _route = {};
  Object.assign(_route, route);
  if (!_route.options.breadcrumb.title) {
    _route.options.breadcrumb.title = 'No Title';
  }
  data[route.name] = _route;
};

// Generate param and query
const genParamAndQuery = (breadcrumb) => {
  const _breadcrumb = {};
  Object.assign(_breadcrumb, breadcrumb);

  // Check is array
  _breadcrumb.params = _.isArray(_breadcrumb.params) ?
    _breadcrumb.params : [_breadcrumb.params];
  _breadcrumb.queryParams = _.isArray(_breadcrumb.queryParams) ?
    _breadcrumb.queryParams : [_breadcrumb.queryParams];

  const params = {};
  _.each(_breadcrumb.params, function (o) {
    params[o] = FlowRouter.getParam(o);
  });
  const queryParams = {};
  _.each(_breadcrumb.queryParams, function (o) {
    queryParams[o] = FlowRouter.getQueryParam(o);
  });

  return {
    params: params,
    queryParams: queryParams,
  };
};

// Get parent router
const getParent = (route) => {
  const getRouter = data[route];

  // Gen route url
  const paramAndQuery = genParamAndQuery(getRouter.options.breadcrumb);
  const url = FlowRouter.path(route, paramAndQuery.params,
    paramAndQuery.queryParams);

  // Push data
  dataArray.push({
    url: url,
    title: getRouter.options.breadcrumb.title,
    activeClass: '',
  });

  // Check parent parent
  if (getRouter.options.breadcrumb.parent) {
    getParent(getRouter.options.breadcrumb.parent);
  }

  return false;
};

// Compute url
const computeUrl = () => {
  dataArray = []; // Clear data array for the first time

  const routeName = FlowRouter.getRouteName();
  const getRouter = data[routeName];

  if (!getRouter) {
    return;
  }

  // Gen route url
  const paramAndQuery = genParamAndQuery(getRouter.options.breadcrumb);
  const url = FlowRouter.path(routeName, paramAndQuery.params,
    paramAndQuery.queryParams);

  // Push data
  dataArray.push({
    url: url,
    title: getRouter.options.breadcrumb.title,
    activeClass: 'active',
  });

  // Check parent
  if (getRouter.options.breadcrumb.parent) {
    getParent(getRouter.options.breadcrumb.parent);
  }
};

// Render
Breadcrumb.render = function (routeName) {
  computeUrl(routeName);
  return dataArray.reverse();
};


/**
 * Register to flow router
 */
FlowRouter.onRouteRegister(function (route) {
  if (route.options.breadcrumb) {
    Breadcrumb.register(route);
  }
});

/**
 * get all Breadcrumbs
 */
window.getBreadcrumbs = function (routeName) {
  return Breadcrumb.render(routeName);
};

/**
 * Template helper
 */
Template.registerHelper('breadcrumb', function () {
  return Breadcrumb.render();
});
