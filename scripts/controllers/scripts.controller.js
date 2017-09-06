postmanExecutorApp.controller('scriptsController',function scriptsController($scope, $timeout, $stateParams, dataProvider, postmanService){

	var projectIndex=$stateParams.projectIndex;
	var process = require('child_process');
	console.log(projectIndex);
	$timeout(function() {
		$scope.project=dataProvider.getProjectsById(projectIndex);
	});
	
	/*gotoScriptController=function(projectIndex){
		$state.go('tab.scripts',{projectIndex:projectIndex});
	}*/

	$scope.prepareScripts= function(){
		param={
		'package' :$scope.package,
		'project' : $scope.project.name,
	 	'scripts' : []
		};
		
		$scope.project.scripts.forEach(function(script){
			if(script.checked){
				param.scripts.push(script.name);
			}
		});


		postmanService.run(param);

		

	}

	var executeScript= function(){

	}
	
});