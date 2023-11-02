$(document).ready(function(){
    let video = $("#myVideo")[0];
    let rangeInput = $("#rangeInput");
    let canvasVideo = $("#myCanvas")[0];
    let playOrStopVideo = $("#playOrStopVideo");
    let detectedObjectsRanking = $("#detected_objects_ranking")
    let detectedObjectsPanel = $("#detected_objects_panel")
    let ctxVideo = canvasVideo.getContext("2d");
    // get video source from div
    let videosToDetect = $("#videos_to_detect").find("div");

    playOrStopVideo.click(function() {
        if (video.paused) {
            video.play();
        }else {
            video.pause();
        };
    });

    // Add click event to all videos for detection
    videosToDetect.on("click", function() {
        video.src = $(this).find("source").attr("src");
        addDetections($(this).find("span").text());
    });

    function addDetections(idVideo) {
        $.getJSON(`static/media_saved/json/detected_${idVideo}.json`, function(data) {
            // Get fps from detected video
            let fps = data[0];
            data = data.slice(1);

            video.ontimeupdate = function() {
                let currentTime = video.currentTime;
                let currentFrame = Math.floor(currentTime * fps);
    
                let detections = data[currentFrame];
                if (detections) {
                    showAmountLabels(detections, idVideo)
                    drawObjects(detections);                
                }
    
                // Update the progress bar
                let value = (100 / video.duration) * video.currentTime;
                rangeInput.val(value);
            };
        });
    }

    rangeInput.on('input', function() {
        let time = video.duration * (rangeInput.val() / 100);
        video.currentTime = time;
    });

    function drawObjects(detections) {
        // Clear the canvas and div panel
        ctxVideo.clearRect(0, 0, canvasVideo.width, canvasVideo.height);
        detectedObjectsPanel.empty();

        detections.forEach((detection) => {
            drawObjectDetected(detection);
        });
    }

    function drawObjectDetected(detection){
        let videoWidth = video.videoWidth;
        let videoHeight = video.videoHeight;
        let canvasWidth = canvasVideo.width;
        let canvasHeight = canvasVideo.height;

        let className = detection[0];
        let x = (detection[1] * canvasWidth) / videoWidth;
        let y = (detection[2] * canvasHeight) / videoHeight;
        let boxWidth = (detection[3] - detection[1]) * canvasWidth / videoWidth;
        let boxHeight = (detection[4] - detection[2]) * canvasHeight / videoHeight;

        // Draw bounding box
        ctxVideo.beginPath();
        ctxVideo.lineWidth = "2";
        ctxVideo.strokeStyle = "red";
        ctxVideo.rect(x, y, boxWidth, boxHeight);
        ctxVideo.stroke();

        // Draw label
        ctxVideo.fillStyle = "white";
        ctxVideo.font = "20px Arial";
        ctxVideo.fillText(className, x, y - 5);

        drawObjectsInPanel(detection, boxWidth, boxHeight);
    }

    function drawObjectsInPanel(detection, boxWidth, boxHeight) {
        let canvasImage = document.createElement("canvas");
        canvasImage.width = boxWidth;
        canvasImage.height = boxHeight;

        // Get the context of the new canvas element
        let ctxImage = canvasImage.getContext("2d");

        imgWidth = detection[3] - detection[1];
        imgHeight = detection[4] - detection[2]; 

        // Copy the image data from the video canvas to the new canvas element
        ctxImage.drawImage(video, detection[1], detection[2], imgWidth, imgHeight, 0, 0, imgWidth/2, imgHeight/2);

        // Convert the new canvas element to an image
        let image = canvasImage.toDataURL("image/png");

        // Display the image
        document.querySelector("#detected_objects_panel").innerHTML += `<img src="${image}">`;
    }

    function showAmountLabels(detections, idVideo) {
        let listLabels = detections.map((detection) => detection[0]);

        // Count the number of labels
        let counts = {};
        listLabels.forEach(x => counts[x] = (counts[x] || 0) + 1);

        // Transform the labels into an array
        let countedElements = Object.keys(counts).map((key) => [key, counts[key]]);

        // Sort the elements by the number of occurrences
        countedElements.sort((a, b) => b[1] - a[1]);

        detectedObjectsRanking.empty();
        countedElements.forEach((element) => {
            detectedObjectsRanking.append(`<li>${element[0]}: ${element[1]}</li>`);
        });
    }

});