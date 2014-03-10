(function() {
  angular.module('ngEvented.controllers').controller('mainCtrl', [
    '$scope', '$location', '$http', '$evented', function($scope, $location, $http, $evented) {
      var Todo;
      Todo = $evented.Collection("Todo");
      Todo.attach("todos", $scope);
      $evented.attach("user", "user", Todo.refresh)($scope);
      $scope.username = "Aitor";
      $scope.password = "raiden400";
      $scope.checkTask = function() {
        var done, id, todo;
        todo = this.todo;
        id = todo._id;
        done = todo.done;
        return Todo.update({
          _id: id
        }, {
          done: done
        });
      };
      $scope.insertTask = function() {
        var todo, userId;
        userId = Evented.user()._id;
        todo = $scope.task.trim();
        if (typeof todo === "string" && todo !== "") {
          Todo.insert({
            title: todo,
            done: false,
            user_id: userId
          });
          return $scope.task = null;
        }
      };
      $scope.removeTask = function(id) {
        return Todo.remove({
          _id: id
        });
      };
      $scope.loginBtn = function() {
        return $http.post("" + $evented.url + "/v1/login", {
          user: {
            username: $scope.username,
            password: $scope.password
          }
        }).success(function() {
          return $evented.emit("user");
        });
      };
      $scope.logoutBtn = function() {
        return $http.get("" + $evented.url + "/v1/logout").success(function() {
          return $evented.emit("user");
        });
      };
    }
  ]);

}).call(this);
