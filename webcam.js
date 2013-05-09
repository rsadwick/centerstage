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
         * @classDescription: provides access to webcam.
         * @param {event} e: the user event
         * @param {boolean} toggle: on or off
         */

        ToggleCamera : function(e, toggle)
        {
            switch(toggle)
            {
                case true:
                    e.target.disabled = true;
                    this.disabled = false;

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
                        scope.video.width = 320;
                        scope.video.height = 240;
                        // Canvas is 1/2 for performance. Otherwise, getImageData() readback is
                        // awful 100ms+ as 640x480.
                        scope.canvas.width = scope.video.width;
                        scope.canvas.height = scope.video.height;
                    }, 1000);

                    break;

                case false:
                    $('#webcam-vid').stop();
                    $('#webcam-vid').pause();
                    $('#webcam-vid').src="";
                    break;

                default:
                    //default behavior
            }
        },

        Record : function()
        {
            var ctx = this.canvas.getContext('2d');
            var CANVAS_HEIGHT = this.canvas.height;
            var CANVAS_WIDTH = this.canvas.width;

            this.frames = []; // clear existing frames;
            this.startTime = Date.now();

            //todo: get rid of this nub shit:
            function toggleActivateRecordButton() {
                //var b = $('#record-me');
             // b.textContent = b.disabled ? 'Record' : 'Recording...';
             // b.classList.toggle('recording');
             // b.disabled = !b.disabled;
            }

           // toggleActivateRecordButton();
            $('#stop-me').disabled = false;

            function drawVideoFrame_(time) {
                scope.rafId = requestAnimationFrame(drawVideoFrame_);

                ctx.drawImage(scope.video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

                document.title = 'Recording...' + Math.round((Date.now() - scope.startTime) / 1000) + 's';

                // Read back canvas as webp.
                //console.time('canvas.dataURL() took');
                var url = scope.canvas.toDataURL('image/webp', 1); // image/jpeg is way faster :(
                //console.timeEnd('canvas.dataURL() took');
                scope.frames.push(url);

                // UInt8ClampedArray (for Worker).
                //frames.push(ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data);

                // ImageData
                //frames.push(ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT));
            };

            this.rafId = requestAnimationFrame(drawVideoFrame_);
        },

        Stop : function()
        {
            cancelAnimationFrame(this.rafId);
            endTime = Date.now();
            $('#stop-me').disabled = true;
            document.title = this.ORIGINAL_DOC_TITLE;

            //toggleActivateRecordButton();

            console.log('frames captured: ' + this.frames.length + ' => ' +
                  ((endTime - this.startTime) / 1000) + 's video');

            //todo convert this crap into jquery:
            //preview video:
            var url =  null;
            //var video = $('#video-preview video') || null;
            var downloadLink = $('#video-preview a[download]') || null;

            //if (!video) {
                video = document.createElement('video');
                video.autoplay = true;
                video.controls = true;
                video.loop = true;
                //video.style.position = 'absolute';
                //video.style.top = '70px';
                //video.style.left = '10px';
                video.style.width = this.canvas.width + 'px';
                video.style.height = this.canvas.height + 'px';
                $('#video-preview').append(video);
                console.log($('#video-preview'))

                downloadLink = document.createElement('a');
                downloadLink.download = 'capture.webm';
                downloadLink.textContent = '[ download video ]';
                downloadLink.title = 'Download your .webm video';

                $('#video-preview').append(downloadLink);

          //  }
           // else
           // {
           //     window.URL.revokeObjectURL(video.src);
           // }

            // https://github.com/antimatter15/whammy
            // var encoder = new Whammy.Video(1000/60);
            // frames.forEach(function(dataURL, i) {
            //   encoder.add(dataURL);
            // });
            // var webmBlob = encoder.compile();

            if (!url) {
                var webmBlob = Whammy.fromImageArray(scope.frames, 1000 / 60);
                url = window.URL.createObjectURL(webmBlob);
            }

            video.src = url;
            downloadLink.href = url;
            //scope.ToggleCamera(null, false);

             $('#webcam-vid').stop();
             $('#webcam-vid')[0].pause();
             $('#webcam-vid')[0].src="";
        }
    };
})(jQuery);