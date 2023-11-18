$(document).ready(function(){
    // Get references to various elements in the HTML
    let video = $("#myVideo")[0];
    let rangeInput = $("#rangeInput");
    let canvasVideo = $("#myCanvas")[0];
    let ctxVideo = canvasVideo.getContext("2d");
    let playOrStopVideo = $("#playOrStopVideo");
    let detectedObjectsRankingContainer = $("#detectedObjectsRankingContainer")
    let detectedObjectsContainer = $("#detectedObjectsContainer")
    let videosDetected = $("#VideosDetectedContainer").find("div");

    // Button for play or stop video
    playOrStopVideo.click(function() {
        // Toggle between playing and pausing the video
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        };
    });

    // Add click event to all videos for detection
    videosDetected.on("click", function() {
        // Change the video source and add detections for the selected video
        video.src = $(this).find("source").attr("src");
        addDetections($(this).find("span").text());
    });

    /*
       It collects the json containing the video detections and as the video is played,
       the bounding box of each object is painted both in the video and in the panel. 
    */
    function addDetections(idVideo) {
        // Load JSON data containing video detections
        $.getJSON(`media/json/detected_${idVideo}.json`, function(data) {
            // Get frames per second (fps) from the detected video
            let fps = data[0];
            data = data.slice(1);

            // Update the display as the video is playing
            video.ontimeupdate = function() {
                let currentTime = video.currentTime;
                let currentFrame = Math.floor(currentTime * fps);

                let detections = data[currentFrame];
                if (detections) {
                    showAmountLabels(detections)
                    drawObjects(detections);
                }

                // Update the progress bar
                let value = (100 / video.duration) * video.currentTime;
                rangeInput.val(value);
            };
        });
    }

    // Update the progress bar with the current video time
    rangeInput.on('input', function() {
        let time = video.duration * (rangeInput.val() / 100);
        video.currentTime = time;
    });

    // The detected objects are painted
    function drawObjects(detections) {
        // Clear the canvas and div panel
        ctxVideo.clearRect(0, 0, canvasVideo.width, canvasVideo.height);
        detectedObjectsContainer.empty();

        // Draw each detected object
        detections.forEach((detection) => {
            drawObjectDetected(detection);
        });
    }

    function drawObjectDetected(detection){
        // Extract information about the detected object
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

        let ctxImage = canvasImage.getContext("2d");

        imgWidth = detection[3] - detection[1];
        imgHeight = detection[4] - detection[2]; 

        // Copy the image data from the video canvas to the new canvas element
        ctxImage.drawImage(video, detection[1], detection[2], imgWidth, imgHeight, 0, 0, imgWidth/2, imgHeight/2);

        // Convert the new canvas element to an image
        let image = canvasImage.toDataURL("image/png");

        // Display the image
        document.querySelector("#detectedObjectsContainer").innerHTML += `<img src="${image}">`;
    }

    // Show the amount of labels for each object in the ranking panel
    function showAmountLabels(detections) {
        // Extract labels from detections
        let listLabels = detections.map((detection) => detection[0]);

        // Count the number of occurrences of each label
        let counts = {};
        listLabels.forEach(x => counts[x] = (counts[x] || 0) + 1);

        // Transform the labels and counts into an array
        let countedElements = Object.keys(counts).map((key) => [key, counts[key]]);

        // Sort the elements by the number of occurrences
        countedElements.sort((a, b) => b[1] - a[1]);

        // Display the labels and counts in the ranking panel
        detectedObjectsRankingContainer.empty();
        countedElements.forEach((element) => {
            detectedObjectsRankingContainer.append(`<li>${element[0]}: ${element[1]}</li>`);
        });
    }

});