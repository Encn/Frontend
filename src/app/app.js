import config from 'app-config';
import { isEmpty } from 'lodash';
import Raven from 'raven-js';
import RavenAngularPlugin from 'raven-js/plugins/angular';
import moment from 'moment';
import routeConfig from './app.route';
import {module as aboutPage} from './pages/about';

import '../scss/app.scss';

// Only technically needed for tests, normally the global 'angular'
// object is created by default and this require statement triggers a
// 'loading angular twice' warning.
if (window && !window.angular) {
  require('angular');
}

var modules = [], release = 'development';

if (typeof __BUILD_STATS__ !== 'undefined') {
  console.log(
    'Built on ' + __BUILD_STATS__.host +
      ' at ' + moment(__BUILD_STATS__.time).format('LLLL ZZ') +
      ' from hash ' + __BUILD_STATS__.gitCommit.hash +
      ' on branch ' + __BUILD_STATS__.gitCommit.branch
  );
  release = __BUILD_STATS__.gitCommit.hash;
}

if (!isEmpty(config.sentryDSN)) {
  Raven
    .config(config.sentryDSN, { release })
    .addPlugin(RavenAngularPlugin)
    .install();
  modules.push('ngRaven');

  // TODO: Remove once prod setup is verified
  console.log('Logging to ' + config.sentryDSN);
}

/** @ngInject */
function disableDebug($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}

import { allowMumbleHref, safeApply } from './util';

angular.module('tf2stadium', [
  aboutPage.name,
  'tf2stadium.directives',
  'tf2stadium.controllers',
  'tf2stadium.services',
  'tf2stadium.filters',
  'ngAnimate',
  require('ngreact').name,
  'ui.router',
  'ui.validate',
  'ngMaterial',
  'md.data.table',
  require('./scrollglue').name,
  'pasvaz.bindonce',
  'ngMedia',
].concat(modules))
  .config(disableDebug)
  .factory('safeApply', safeApply)
  .config(routeConfig)
  .config(allowMumbleHref);

// app-config is a webpack resolve.alias pointing to the preferred
// configuration file.
//
// Old-style config files (which we still support), when require()'d,
// will register themselves as tf2stadium.constant('Config', ...), but
// new style configs just return a value. This supports both, because
// module.constant(...) is actually constant (aka, won't be
// overwritten by a second .constant call).
angular.module('tf2stadium')
  .constant('Config', require('app-config'));

angular.module('tf2stadium.controllers', []);
angular.module('tf2stadium.filters', []);
angular.module('tf2stadium.services', []);

require('./shared/comment-box/comment-box.controller');
require('./shared/notifications/ready-up.controller');
require('./shared/notifications/toast.controller');
require('./shared/lobby-create-button.controller');
require('./shared/current-lobby.controller');
require('./pages/settings/settings.controller');
require('./pages/lobby/page/header.controller');
require('./pages/lobby/page/spectators.controller');
require('./pages/lobby/page/lobby-page.controller');
require('./pages/lobby/create/header.controller');
require('./pages/lobby/create/lobby-create.controller');
require('./pages/lobby/create/wizard-steps.controller');
require('./pages/lobby/list/lobby-list.controller');
require('./pages/lobby/list/sub-list.controller');
require('./pages/user-profile/user-profile.controller');

require('./app.notifications');
require('./shared/websocket.factory');
require('./shared/user.factory');
require('./shared/comment-box/chat.service');
require('./pages/lobby/lobby.factory');
require('./pages/lobby/create/lobby-create.provider');
require('./pages/lobby/create/lobby-create.filter');

import { WhitelistDirective, AutofocusDirective } from './app.directive';

angular
  .module('tf2stadium.directives', ['tf2stadium.filters'])
  .directive('whitelist', WhitelistDirective)
  .directive('autofocus', AutofocusDirective);

require('./shared/video.directive');
require('./app.filter');
require('./pages/lobby/list/lobby-list.filter');

require('./app.icons');
require('./pages/settings/settings.provider');
require('./pages/lobby/list/header.controller');
require('./pages/rules/rules.controller');
require('./pages/rules/rules.provider');
require('./app.preloading');
require('./app.theme');
require('./app.settings');

require('./app.run');
