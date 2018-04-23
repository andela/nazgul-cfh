angular.module('mean.directives', [])
  .directive('player', function (){
    return{
      restrict: 'EA',
      templateUrl: '/views/player.html',
      link: function(scope, elem, attr){
        scope.colors = ['#7CE4E8', '#d90404', '#256994', '#04ae11', '#b81287', '#F7775E', '#0645f2', '#7c575e', '#f2adff', '#f0950a', '#fdd733', '#8d9241'];
      }
    };
  }).directive('answers', function() {
    return {
      restrict: 'EA',
      templateUrl: '/views/answers.html',
      link: function(scope, elem, attr) {

        scope.$watch('game.state', function() {
          if (scope.game.state === 'winner has been chosen') {
            var curQ = scope.game.curQuestion;
            var curQuestionArr = curQ.text.split('_');
            var startStyle = "<span style='color: "+scope.colors[scope.game.players[scope.game.winningCardPlayer].color]+"'>";
            var endStyle = "</span>";
            var shouldRemoveQuestionPunctuation = false;
            var removePunctuation = function(cardIndex) {
              var cardText = scope.game.table[scope.game.winningCard].card[cardIndex].text;
              if (cardText.indexOf('.',cardText.length-2) === cardText.length-1) {
                cardText = cardText.slice(0,cardText.length-1);
              } else if ((cardText.indexOf('!',cardText.length-2) === cardText.length-1 ||
                cardText.indexOf('?',cardText.length-2) === cardText.length-1) &&
                cardIndex === curQ.numAnswers-1) {
                shouldRemoveQuestionPunctuation = true;
              }
              return cardText;
            };
            if (curQuestionArr.length > 1) {
              var cardText = removePunctuation(0);
              curQuestionArr.splice(1,0,startStyle+cardText+endStyle);
              if (curQ.numAnswers === 2) {
                cardText = removePunctuation(1);
                curQuestionArr.splice(3,0,startStyle+cardText+endStyle);
              }
              curQ.text = curQuestionArr.join("");
              // Clean up the last punctuation mark in the question if there already is one in the answer
              if (shouldRemoveQuestionPunctuation) {
                if (curQ.text.indexOf('.',curQ.text.length-2) === curQ.text.length-1) {
                  curQ.text = curQ.text.slice(0,curQ.text.length-2);
                }
              }
            } else {
              const winningCardScope = scope.game.table[scope.game.winningCard].card[0].text; /* eslint-disable-line */
              curQ.text += ` ${startStyle + winningCardScope + endStyle}`;
            }
          }
        });
      }
    };
  }).directive('question', function() {
    return {
      restrict: 'EA',
      templateUrl: '/views/question.html',
      link: function(scope, elem, attr) {}
    };
  })
  .directive('scoreboard', () => ({
    restrict: 'EA',
    templateUrl: '/views/scoreboard.html',
    link: () => {}
  }))
  .directive('timer', () => ({
    restrict: 'EA',
    templateUrl: '/views/timer.html',
    link: () => {}
  }))
  .directive('landing', () => ({
    restrict: 'EA',
    link: (scope) => {
      scope.showOptions = true;
      if (window.localStorage.userData) {
        scope.showOptions = false;
      } else {
        scope.showOptions = true;
      }
    }
  }))
  .directive('chat', () => ({
    restrict: 'EA',
    templateUrl: '/views/chat-box.html',
    link: () => {}
  }));

