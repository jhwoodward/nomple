require('angular');
require('angular-animate');
require('angular-messages');
require('angular-sanitize');
require('@uirouter/angularjs');
require('angular-aria');
require('angular-material');
require('angular-electron');
require('angular-drag-and-drop-lists');
window.CodeMirror = require('./codemirror/lib/codemirror');
require('./codemirror/addon/edit/matchbrackets');
require('./codemirror/addon/edit/closebrackets');
require('./codemirror/addon/fold/brace-fold');
require('./codemirror/track-script');
require('./codemirror/master-track-script');
require('angular-ui-codemirror');
require('angular-material/angular-material.css');
require('./style/all.scss');



let main = angular.module('mainModule', []);
require('./main/main.controller')(main);
require('./main/edit-song')(main);
require('./main/options')(main);

let electron = angular.module('electronModule', []);
require('./electron/context-menu')(electron);
require('./electron/app-menu')(electron);

let viz = angular.module('vizModule', []);
require('./viz/piano-keys')(viz);
require('./viz/piano-roll')(viz);
require('./viz/info-log')(viz);

let track = angular.module('trackModule', []);
require('./track/track')(track);
require('./track/master-track')(track);
require('./track/edit-track')(track);

let seq = angular.module('seqModule', []);
require('./seq/midi-web')(seq);
require('./seq/timer-desktop')(seq);


let user = angular.module('userModule', []);
require('./user/user.service')(user);
require('./user/signup.controller')(user);
require('./user/login.controller')(user);

let store = angular.module('storeModule', []);
require('./store/store.service')(store);
require('./store/store')(store);
require('./store/song-list')(store);

let tutorial = angular.module('tutorialModule', []);
require('./tutorial/notation.controller')(tutorial);

let shared = angular.module('sharedModule', []);
require('./shared/padZeros.filter')(shared);
require('./shared/unload')(shared);
require('./shared/draggable')(shared);

let app = angular.module('app', ['ngAnimate', 'ngMessages', 'ngSanitize', 'ngMaterial', 'dndLists', 'ui.router', 'ui.codemirror', 'angular-electron', 'vizModule', 'trackModule', 'seqModule', 'sharedModule', 'storeModule', 'tutorialModule', 'userModule', 'electronModule', 'mainModule']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$mdThemingProvider', '$mdInkRippleProvider', 'remoteProvider',
  function ($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider, $mdInkRippleProvider, remoteProvider) {

    remoteProvider.register('NanoTimer');
    $mdInkRippleProvider.disableInkRipple();

    var blueGrey2 = $mdThemingProvider.extendPalette('blue-grey', {
      'contrastDefaultColor': 'light'
    });

    $mdThemingProvider.definePalette('blue-grey2', blueGrey2);

    $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('blue-grey2');

    $locationProvider.html5Mode(true);

    $stateProvider
      .state('root', {
        url: '',
        abstract: true,
        resolve: {
          midi: function (midiService) {
            return midiService.enable();
          }
        }
      })
      .state('root.splash', {
        url: '/',
        views: {
          'app@': {
            template: '',
            controller: ['$state', 'songService', function ($state, songService) {
              var lastLoad = songService.getLastLoad();
              if (lastLoad) {
                $state.go('root.main', { key: lastLoad.key, owner: lastLoad.owner });
              } else {
                $state.go('root.new');
              }
            }],
            controllerAs: 'vm',
          }
        }
      })
      .state('root.new', {
        url: '/new',
        views: {
          'app@': {
            template: require('./main/main-desktop.html'),
            controller: 'mainController',
            controllerAs: 'vm',
          }
        },
        resolve: {
          song: function (songService, $stateParams) {
            return songService.new();
          }
        }
      })
      .state('root.main', {
        url: '/:owner/:key',
        views: {
          'app@': {
            template: require('./main/main-desktop.html'),
            controller: 'mainController',
            controllerAs: 'vm',
          }
        },
        resolve: {
          song: function (songService, $stateParams) {
            return songService.getOne($stateParams.key, $stateParams.owner);
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  }]);



module.exports = app;