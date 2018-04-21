/* global firebase, document */
/* eslint-disable object-curly-newline, no-undef, array-callback-return */
angular.module('mean.system')
  .controller(
    'ChatController',
    ['$scope', '$sce', 'game', '$firebaseArray',
      ($scope, $sce, game, $firebaseArray) => {
        $('#chat-input').emojioneArea();
        const chatBox = document.querySelector('#chatbox');
        const audio = new Audio('/audio/beep.mp3');
        audio.load();

        $scope.openChat = (e) => {
          e.preventDefault();
          const openChatBox = document.querySelector('#openChatbox');
          openChatBox.style.right = '-230px';
          openChatBox.style.display = 'none';
          chatBox.style.display = 'block';
        };

        $scope.closeChat = (e) => {
          e.preventDefault();
          const openChatBox = document.querySelector('#openChatbox');
          openChatBox.style.display = 'block';
          openChatBox.style.right = '0px';
          chatBox.style.display = 'none';
        };

        // watch chat response from firebase real-time database
        $scope.$watch('game.gameID', () => {
          $scope.chatContent = '';
          $scope.chatLenght = 0;
          $scope.playBeep = true;
          if (game.gameID) {
            const { username } = game.players[game.playerIndex];
            const ref = firebase.database().ref().child('chat')
              .child(`${game.players[0].socketID}`);
            const chats = $firebaseArray(ref);

            chats.$loaded().then(() => {
              $scope.chats = chats;
            });

            $('.emojionearea-editor').on('keyup', (e) => {
              if (e.keyCode === 13) {
                $scope.chatContent = $('.emojionearea-editor').html();
                $scope.sendMessage($scope.chatContent);
              }
            });

            $scope.sendMessage = (message) => {
              if (message) {
                chats.$add({ username, message });
                $scope.chatContent = '';
                $('.emojionearea-editor').html('');
                $scope.mapChat(chats, username);
              }
            };

            let currentChatLength = chats.length;
            $scope.newChatLength = 0;
            chats.$watch(() => {
              $scope.newChatLength += chats.length - currentChatLength;
              currentChatLength = chats.length;
              $scope.mapChat(chats, username);
              $scope.chats = chats;
              if ($('#chatbox').css('display') === 'block') {
                $scope.newChatLength = 0;
              } else if ($scope.playBeep) audio.play();
              $('#chat-messages').animate({ scrollTop: 9999 }, 'slow');
            });
          }
        });

        $scope.mapChat = (chats, username) => {
          chats.map((chat, index) => {
            chats[index].message = $sce.trustAsHtml(String(chat.message));
            if (chat.username === username) {
              chats[index].align = 'right';
              $scope.playBeep = false;
            } else {
              $scope.playBeep = true;
            }
          });
        };
      }]
  );
