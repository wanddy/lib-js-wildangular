var app = angular.module('tictactoe', ['wilddog']);
app.controller('TicTacToeCtrl', function Chat($scope, $wilddogObject) {
  // Get a reference to the Wilddog
  var boardRef = new Wilddog('https://wild-angular.wilddogio.com/tictactoe');

  // If the query string contains a push ID, use that as the child for data storage;
  // otherwise, generate a new random push ID
  var pushId;
  if (window.location && window.location.search) {
    pushId = window.location.search.substr(1).split('=')[1];
  }
  if (pushId) {
    boardRef = boardRef.child(pushId);
  } else {
    boardRef = boardRef.push();
  }

  // Put the random push ID into the DOM so that the test suite can grab it
  document.getElementById('pushId').innerHTML = boardRef.key();

  // Get the board as an wild-angular object
  $scope.boardObject = $wilddogObject(boardRef);

  // Create a 3-way binding to Wilddog
  $scope.boardObject.$bindTo($scope, 'board');

  // Verify that $inst() works
  verify($scope.boardObject.$ref() === boardRef, 'Something is wrong with $wilddogObject.$ref().');

  // Initialize $scope variables
  $scope.whoseTurn = 'X';

  /* Resets the tictactoe Wilddog reference */
  $scope.resetRef = function () {
    ["x0", "x1", "x2"].forEach(function (xCoord) {
      $scope.board[xCoord] = {
        y0: "",
        y1: "",
        y2: ""
      };
    });
  };


  /* Makes a move at the current cell */
  $scope.makeMove = function(rowId, columnId) {
    // Only make a move if the current cell is not already taken
    if ($scope.board[rowId][columnId] === "") {
      // Update the board
      $scope.board[rowId][columnId] = $scope.whoseTurn;

      // Change whose turn it is
      $scope.whoseTurn = ($scope.whoseTurn === 'X') ? 'O' : 'X';
    }
  };

  /* Destroys all wild-angular bindings */
  $scope.destroy = function() {
    $scope.boardObject.$destroy();
  };

  /* Logs a message and throws an error if the inputted expression is false */
  function verify(expression, message) {
    if (!expression) {
      console.log(message);
      throw new Error(message);
    }
  }
});
