

angular.module('ngEvented.controllers').controller 'mainCtrl',[
  '$scope'
  '$location'
  '$http'
  '$evented'
  ($scope, $location, $http, $evented) ->

    Todo = $evented.Collection("Todo")
    Todo.attach "todos", $scope
    
    
    $evented.attach("user", "user", Todo.refresh) $scope
    $scope.username = "Aitor"
    $scope.password = "raiden400"

    # On Todos change
    $scope.checkTask = ->
      todo = this.todo
      id = todo._id
      done = todo.done
      # Collection Update
      Todo.update {_id: id}, {done: done}

    # Insert new
    $scope.insertTask = ->
      userId = Evented.user()._id
      todo = $scope.task.trim()
      if typeof todo is "string" and todo isnt ""
        Todo.insert({title: todo, done: false, user_id: userId})
        $scope.task = null

    # Delete
    $scope.removeTask = (id) ->
      Todo.remove({_id: id})

    $scope.loginBtn = ->
      $http.post("#{$evented.url}/v1/login",
        user:
          username: $scope.username
          password: $scope.password
      ).success ->
        $evented.emit "user"

    $scope.logoutBtn = ->
      $http.get("#{$evented.url}/v1/logout").success ->
        $evented.emit "user"

    return
]