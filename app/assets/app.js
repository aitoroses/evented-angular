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
      $scope.insertTask = function(ev) {
        var todo, userId;
        if (event.which === 13) {
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
      $scope.uncompleted = function() {
        var task, uncompleted, _i, _len, _ref;
        uncompleted = 0;
        _ref = $scope.todos;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          task = _ref[_i];
          if (task.done === false) {
            uncompleted++;
          }
        }
        if (uncompleted === 0) {
          return false;
        } else {
          return uncompleted;
        }
      };
    }
  ]);

}).call(this);
;(function() {
  'use strict';
  var app;

  app = angular.module("ngEvented");

  app.config([
    '$routeProvider', '$locationProvider', '$httpProvider', '$eventedProvider', function($routeProvider, $locationProvider, $httpProvider, $eventedProvider) {
      $routeProvider.when("/", {
        templateUrl: "templates/main.html",
        controller: 'mainCtrl as main'
      }).otherwise("/");
      $locationProvider.html5Mode(true);
      $httpProvider.defaults.useXDomain = true;
      $httpProvider.defaults.withCredentials = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      return $eventedProvider.connect('http://localhost:5000');
    }
  ]);

  return;

}).call(this);
