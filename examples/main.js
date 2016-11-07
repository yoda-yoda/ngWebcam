(function exampleIIFE(angular){
    angular.module('ngWebcamExample', [

        'ui.router',
        'ngWebcam'
    ])
    .config(['$urlRouterProvider', '$stateProvider', '$httpProvider',
    function($urlRouterProvider, $stateProvider, $http) {
        $http.defaults.headers.common.Authorization = 'Bearer M1gcXxjgdeNGig35lEzRql3qth5XxK';

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('webcam', {
                url: '/home',
                templateUrl: 'index.html'
            })
    }])
    .component('webcamExample', {
        controllerAs: 'webcam',
        controller: AngularWebcamController,
        templateUrl: 'tpls/webcam.tpl.html'
    });

    function AngularWebcamController() {
        const self = this;
        self.onError = onError;
        self.onStream = onStream;
        self.toggleCamera = toggleCamera;
        self.btnText = 'Start';

        function onError(err) {
            console.log('Err', err);
        }

        function onStream(stream) {
            console.log('stream', stream);
            self.stream = stream;
            return self.stream;
        }

        function switchOffWebcam() {
            if (self.stream) {
                console.log(self.stream);
            }
            return false;
        }

        function toggleCamera() {
            self.showStream = !self.showStream;
            self.btnText = self.showStream ? 'Stop' : 'Start';

            if (!self.showStream) {
                // Destroy the video stream
                switchOffWebcam();
            }

            return {
                streaming: self.showStream,
                btnText: self.btnText
            };
        }
    }

}(window.angular));
