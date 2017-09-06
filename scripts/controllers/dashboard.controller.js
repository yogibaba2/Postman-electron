postmanExecutorApp.controller('dashboardController',function dashboardController($scope, $state, $timeout, dataProvider){

	$timeout(function() {
		$scope.projects = dataProvider.getProjects();
	});
	
	$scope.gotoScriptController=function(projectIndex){
		console.log(projectIndex);
		$state.go('scripts',{projectIndex:projectIndex});
	}
	console.log(100+62+228+84);
});