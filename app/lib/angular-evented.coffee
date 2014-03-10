'use strict'

define 'angular-evented', [
  # socket.io
  'script!../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io',
  # Evented-client
  '../../node_modules/evented.io-client/lib/evented.js'
  # Angular.js own build
  'script!../assets/angular.build'
], (io, Evented) ->

  angular.module('ngEvented.controllers', [])
  angular.module('ngEvented.directives', [])
  angular.module('ngEvented.services', [])

  angular.module('ngEvented', ['ngEvented.controllers', 'ngEvented.directives', 'ngEvented.services', 'ngRoute'])

  angular.element(document).ready ->
    angular.bootstrap document.documentElement, ['ngEvented']

  evented = angular.module('ngEvented')

  # This module gives provides angular, functionality
  # to communicate syncronously between the server
  # and the $scope

  evented.provider '$evented', [() ->

    provider = this

    @serverURL = null

    @connect = (url) ->
      @serverURL = url
      Evented(url)

    @$get = () ->

      events = []

      return {

        url: provider.serverURL

        emit: (event, data) ->
          Evented.io.emit(event, data)

        attach: (attached_event, scoped_name, returnFn) ->

          event = attached_event
          name = scoped_name
          returnFn = returnFn

          return ($scope) ->

            # Attach registers an @event
            # @name may be an string in case a $scope is specified
            #   or it can be directly a variable to attach in,
            #   usually its use is gonna be $scope[name]

            if not event? then return null
            if not name? then return null
            if not $scope? then return null

            events.push {event: event, name: name, scope: $scope}

            Evented.io.on event, (data) ->
              $scope.$apply ->
                $scope[name] = data
                if returnFn? then returnFn()
              
            return null

        refresh: (event) ->
          if event? then Event.io.emit(event)
          else 
            for event in events
              Evented.io.emit(event.event)
          return null

        Collection: (collection) ->
          collec = new Evented.Collection(collection)
          #Evented.subscribe(collection)
          collec.attach = (name , $scope) ->
            Evented.io.on "subscribe:#{collection}", () ->
              $scope.$apply( ->
                $scope[name] = collec.data
              )
            Evented.io.on "inserted:#{collection}", () ->
              # $scope.$apply( ->
              #   $scope[name] = collec.data
              # )
              # This needs to be fixed in a nearly future, and we should calculate the diff
              collec.refresh()

            Evented.io.on "updated:#{collection}", () ->
              $scope.$apply()

            Evented.io.on "removed:#{collection}", () ->
              $scope.$apply()

          collec.refresh = ->
            Evented.subscribe(collection)
            return null

          return collec

        getEvents: ->
          return events
      }
    return
  ]

  return angular


