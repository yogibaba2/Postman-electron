var postmanExecutorApp = angular.module('postmanExecutorApp', ['ui.router']);

postmanExecutorApp.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/dashboard");
    //
    // Now set up the states
    $stateProvider
      .state('dashboard', {
        url: "/dashboard",
		templateUrl: "views/dashboard.template.html",
		controller: "dashboardController"
         
      })
      .state('scripts', {
        url: "/scripts",
        params: {projectIndex : null},
        templateUrl: "views/scripts.template.html",
    	controller: "scriptsController"
      })
});