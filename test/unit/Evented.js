describe('Evented.js', function() {
  
  var Todo;
  Evented('http://localhost:5000');
  
  beforeEach(function(){
    // Log in
    var logged;
    var ajax = new XMLHttpRequest;
    ajax.withCredentials = true;
    ajax.open('get','http://localhost:5000/v1/login?username=Aitor&password=raiden400');
    ajax.send();
    ajax.onload = function(){
      logged = true;
      Evented.io.emit('user')
    };

    Todo = new Evented.Collection('Todo')
  })

  it('It tan instantiate', function() {
    expect(Todo != null).toBe(true);
  });
  
  xit('can run async test', function() {

    var done = false;
    var asynchronousTask = function() {
      setTimeout(function(){
        done = true;
      }, 3000);
    }
    asynchronousTask();

    waitsFor(function() {
      return done;
    }, "the asynchronic task.", 5000);

    runs(function(){
      expect(done).toBe(true);
    });

  });

  it('should recieve the user on startup', function() {
    waitsFor(function() {
      return Evented.user()
    });

    runs(function(){
      expect(Evented.user().username == "Aitor");
    });

  });

  it('should recieve some data on Todo', function() {
    
    waitsFor(function() {
      return Todo.data.length > 0;
    });

    runs(function() {
      expect(Todo.data.length).toBeGreaterThan(0);
    });

  });
  
});
