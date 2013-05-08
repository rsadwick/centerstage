;(function ($) {
    /**
     * Webcam
     * @classDescription: creates a number stepper with events
     * @param {array} Questions    array of questions & answers
     */

    //webcam browser features:
    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

    Webcam = function (config) {

        config = (config = config || {});

        var ORIGINAL_DOC_TITLE = document.title;
        this.video = $('video').get(0);
        this.canvas = document.createElement('canvas'); // offscreen canvas.
        this.rafId = null;
        this.startTime = null;
        this.endTime = null;
        this.frames = [];
        scope = this;
    };

    Webcam.prototype = {
        /**
         * ToggleCamera
         * @classDescription: performs validation based on min/max and increases by step.
         * @param {enum} type   enumeration based on the type of validation to perform (up/down)
         */

        ToggleCamera : function(e, toggle)
        {
            switch(toggle)
            {
                case true:
                    e.target.disabled = true;
                    this.disabled = false;

                   // scope.video.controls = false;

                    navigator.getUserMedia({video: true, audio: true}, function(stream) {
                        scope.video.src = window.URL.createObjectURL(stream);
                    },
                    function(e) {
                        alert('Fine, you get a movie instead of your beautiful face ;)');
                        scope.video.src = 'Chrome_ImF.mp4';
                    });

                    // Note: video.onloadedmetadata doesn't fire in Chrome when using getUserMedia so
                    // we have to use setTimeout. See crbug.com/110938.
                    setTimeout(function() {
                        scope.video.width = 320;//video.clientWidth;
                        scope.video.height = 240;// video.clientHeight;
                        // Canvas is 1/2 for performance. Otherwise, getImageData() readback is
                        // awful 100ms+ as 640x480.
                        scope.canvas.width = scope.video.width;
                        scope.canvas.height = scope.video.height;
                    }, 1000);

                    break;

                case false:
                    //turn off
                    break;

                default:
                    //default behavior
            }
        },

        Record : function()
        {
            var elapsedTime = $('#elasped-time');
            var ctx = canvas.getContext('2d');
            var CANVAS_HEIGHT = canvas.height;
            var CANVAS_WIDTH = canvas.width;

            this.frames = []; // clear existing frames;
            this.startTime = Date.now();

            //toggleActivateRecordButton();
            $('#stop-me').disabled = false;

            function drawVideoFrame_(time) {
                this.rafId = requestAnimationFrame(drawVideoFrame_);

                ctx.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

                document.title = 'Recording...' + Math.round((Date.now() - startTime) / 1000) + 's';

                // Read back canvas as webp.
                //console.time('canvas.dataURL() took');
                var url = canvas.toDataURL('image/webp', 1); // image/jpeg is way faster :(
                //console.timeEnd('canvas.dataURL() took');
                frames.push(url);

                // UInt8ClampedArray (for Worker).
                //frames.push(ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data);

                // ImageData
                //frames.push(ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT));
            };

            this.rafId = requestAnimationFrame(drawVideoFrame_);
        }
    };
})(jQuery);