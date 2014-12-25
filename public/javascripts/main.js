var mainApp = angular.module('mainApp', []);

mainApp.controller('index', function ($scope) {

    //Define Objects
    $scope.index = {
        twitter: {}
    };
    $scope.index.twitter.messageSend = '';
    $scope.index.twitter.talkNameSend = '';
    var primus = Primus.connect();

    //Define Methods
    primus.on("open", function () {
        console.log("Connected!")
    });

    function defaultStreamHTML(id, twit) {
        var div = '<li class="media">' +
            '<div class="media-body">' +
            '<div class="media">' +
            '<a class="pull-left" ng-href="twit.source">' +
            '<img class="media-object img-circle " src=' + twit.user.profile_image_url + '/>' +
            '</a>' +
            '<div class="media-body">' + twit.text +
            '<br/>' +
            '"<small class="text-muted">' + twit.user.name + ' | ' + twit.created_at + '</small>' +
            '<hr/>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</li>';

        jQuery(id).append(div);

    }

    $scope.sendTwit = function () {
        primus.write({action: 'sendTwit', message: $scope.index.twitter.messageSend});
        $scope.index.twitter.messageSend = '';
    };

    $scope.sendTalkNameTwit = function () {
        primus.write({action: 'retweetStream', message: $scope.index.twitter.talkNameSend});
        $scope.index.twitter.talkNameSend = '';
    };


    primus.on("data", function (data) {
        console.log(data);
        switch (data.action) {
            case 'defaultStream':
                defaultStreamHTML('#defaultStream', data);
                break;
            case 'retweetStream':
                defaultStreamHTML('#retweetStream', data);
                break;
            default :
                console.log('default area');
                break;
        }
    })

});