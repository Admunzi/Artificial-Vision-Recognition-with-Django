$(document).ready(function(){
    let video = $("#myVideo")[0];
    let rangeInput = $("#rangeInput");
    let canvas = $("#myCanvas")[0];
    let playOrStopVideo = $("#playOrStopVideo");
    let ctx = canvas.getContext("2d");
    let frameRate = 20.12;
    let detected_objects = $("#detected_objects")

    playOrStopVideo.click(function() {
        if (video.paused) {
            video.play();
        }else {
            video.pause();
        };
    });

    $.getJSON("static/media_saved/json/detected_21.json", function(data) {
        video.ontimeupdate = function() {
            let currentTime = video.currentTime;
            let currentFrame = Math.floor(currentTime * frameRate);

            let detections = data[currentFrame];
            if (detections) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                show_amount_labels(detections)
                draw_objects(detections, ctx);                
            }

            // Update the progress bar
            let value = (100 / video.duration) * video.currentTime;
            rangeInput.val(value);
        };
    });

    rangeInput.on('input', function() {
        let time = video.duration * (rangeInput.val() / 100);
        video.currentTime = time;
    });

    function draw_objects(detections, ctx) {
        detections.forEach((detection) => {
            let videoWidth = video.videoWidth;
            let videoHeight = video.videoHeight;
            let canvasWidth = canvas.width;
            let canvasHeight = canvas.height;

            let className = detection[0];
            let x = (detection[1] * canvasWidth) / videoWidth;
            let y = (detection[2] * canvasHeight) / videoHeight;
            let width = (detection[3] - detection[1]) * canvasWidth / videoWidth;
            let height = (detection[4] - detection[2]) * canvasHeight / videoHeight;

            // Draw bounding box
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = "red";
            ctx.rect(x, y, width, height);
            ctx.stroke();

            // Draw label
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.fillText(className, x, y - 10);
        });
    }

    function show_amount_labels(detections) {
        let list_labels = detections.map((detection) => detection[0]);

        // Count the number of labels
        let counts = {};
        list_labels.forEach(x => counts[x] = (counts[x] || 0) + 1);

        // Transform the labels into an array
        let counted_elements = Object.keys(counts).map((key) => [key, counts[key]]);

        // Sort the elements by the number of occurrences
        counted_elements.sort((a, b) => b[1] - a[1]);

        detected_objects.empty();
        counted_elements.forEach((element) => {
            detected_objects.append(`<li>${element[0]}: ${element[1]}</li>`);
        });
    }

});