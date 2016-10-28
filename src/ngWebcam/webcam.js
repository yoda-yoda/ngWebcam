(function webcamIIFE(angular){
    'use strict';

    const deps = [];
    angular
    .module('ngWebcam.webcam', deps)

    .component('angularWebcam', {
        bindings: {
            'onSuccess': '&',
            'onError': '&',
            'onStream': '&',
            'audio': '@?'
        },
        controllerAs: 'webcam',
        controller: NgWebcamCtrl,
        template: ['<div class="angular-webcam-container">',
            '<video id="angular-webcam-stream" width="500px" autoplay></video>',
            '</div>'].join(' ')
    });

    function NgWebcamCtrl() {
        const self = this;

        // Normalize the various vendor prefixed versions of getUserMedia.
        navigator.getUserMedia = (
            navigator.getUserMedia ||
            navigator.msGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.webkitGetUserMedia
        );

        /**
         * @name [hasUserMedia]
         *
         * @description [Check where a browser supports web RTC protocols]
         * @return {Boolean} [description]
         */
        function hasUserMedia() {
            return navigator.getUserMedia ? true : false;
        }

        function successCallback(stream) {
            const videoID = 'angular-webcam-stream';
            localStream = stream;
            const video = document.getElementById(videoID);
            video.src = window.URL.createObjectURL(stream);

            // Give the user access to the stream
            self.onStream(localStream);
        }

        function errorCallback(err) {
            self.onError(err);
        }

        function startVideoStream() {
            if (hasUserMedia()) {
                const constraints = {
                    'video': true,
                    'audio': self.audio || false,
                };
                // Request the camera.
                navigator.getUserMedia(constraints, successCallback, errorCallback);
            }
        }

        startVideoStream();
    }

}(window.angular));
