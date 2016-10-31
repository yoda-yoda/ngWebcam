(function webcamIIFE(angular){
    'use strict';

    const deps = [];
    angular
    .module('ngWebcam.webcam', deps)

    .component('angularWebcam', {
        bindings: {
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
         * @name _throwIfError
         *
         * @access private
         *
         * @description Throw an error if some of the necesarry methods are not
         * provided(Via bindings)
         *
         * @return {[type]} [description]
         */
        function _throwIfError(err) {
            throw new Error(err);
        }

        function isFunction(fxn) {
            return typeof fxn === 'function';
        }

        function checkBindings() {
            if (!self.onError || !self.onStream) {
                const bindings = ['onError', 'onStream'];
                const msg = 'Please make sure you provide all the required bindings';
                const bindingsMsg = `. The required bindings are ${bindings.join(',')}`;
                return _throwIfError(msg + bindingsMsg);
            }
            return true;
        }

        /**
         * @access private
         *
         * @name _hasUserMedia
         *
         * @description Check browsers supports web RTC protocols
         *
         * @return {Boolean} True if a browser supports otherwise false
         */
        function _hasUserMedia() {
            return navigator.getUserMedia ? true : false;
        }

        /**
         * @name _successCallback
         *
         * @description - A Success callback handler. This method is fired up when
         * a browser successfully opens a media stream.
         *
         * @param  {Object} stream - Video Stream
         *
         * @return {Function} An active video stream
         */
        function _successCallback(stream) {
            if(isFunction(self.onStream)) {
                const videoID = 'angular-webcam-stream';
                localStream = stream;
                const video = document.getElementById(videoID);
                video.src = window.URL.createObjectURL(stream);

                // Give the user access to the stream
                return self.onStream(localStream);
            }
            const msg = 'Please make sure the "onStream" binding is a function';
            return _throwIfError(msg);
        }

        /**
         * @name _errorCallback
         *
         * @description - An error callback handler that is executed whenever
         *
         * @param  {Object} err - An object containing the error
         *
         * @return {Function}
         */
        function _errorCallback(err) {
            if (isFunction(self.onError)) {
                return self.onError(err);
            }
            const msg = 'Please make sure the "onError" binding is a function';
            return _throwIfError(msg);
        }

        /**
         * @name _startVideoStream
         *
         * @description Start a video stream using the getUserMedia navigator fxn
         *
         * @return {Function || Undefined}
         */
        function _startVideoStream() {
            checkBindings();
            if (_hasUserMedia()) {
                const constraints = {
                    'video': true,
                    'audio': self.audio || false,
                };
                return navigator.getUserMedia(constraints, _successCallback, _errorCallback);
            }
            return undefined;
        }

        return _startVideoStream();
    }

}(window.angular));
