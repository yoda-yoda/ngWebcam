(function (angular) {
    'use strict';

    /**
     * @ngdoc overview
     * @name ngWebcam
     * @module ngWebcam
     *
     * @description
     * Parent module to wrap all `ngWebcam.*` modules
     *
     */
    const deps = ['ngWebcam.webcam'];
    angular.module('ngWebcam', deps);

})(window.angular);
