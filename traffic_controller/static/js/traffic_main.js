$(document).ready(function () {
    // Get the canvas and necessary buttons
    let canvas = document.getElementById("canvasToDraw");
    let ctxVideo = canvas.getContext("2d");
    let clearCanvasButton = document.getElementById("clearCanvas");
    let videosDetected = $("#VideosDetectedContainer").find("div");

    // Create a Stage using the EaselJS library for canvas manipulation
    let stage = new createjs.Stage(canvas);

    // Arrays to store drawing objects and their coordinates
    let allObjectsDraws = [];
    let allObjectsCoordsDraws = [];
    let markingLine = [];

    // Set the stage bounds based on the canvas dimensions
    stage.setBounds(0, 0, canvas.width, canvas.height);

    // CLEAR THE CANVAS

    // Add a click event to the button to clear the canvas
    clearCanvasButton.addEventListener("click", clearCanvas);

    // Function to clear the canvas
    function clearCanvas(event) {
        // Remove all objects stored in allObjectsDraws from the stage
        allObjectsDraws.forEach(element => {
            stage.removeChild(element);
        });

        allObjectsDraws = [];
        stage.clear();
    }

    // DRAWING IN THE CANVAS

    // Add a click event to the canvas to handle mouse clicks
    canvas.addEventListener("click", drawMarkingLine);

    // Function to handle mouse clicks on the canvas
    function drawMarkingLine(event) {
        // Get the coordinates of the click relative to the canvas
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        // Convert the click coordinates to stage coordinates
        let point = stage.globalToLocal(x, y);

        if (markingLine == 0) {
            markingLine.push(point.x, point.y);
        } else {
            // Retrieve starting coordinates
            xFrom = markingLine[0];
            yFrom = markingLine[1];

            // Create a line object and define its style
            let line = new createjs.Shape();
            let graphics = line.graphics;
            graphics.setStrokeStyle(9);
            graphics.beginStroke(createjs.Graphics.getRGB(124, 250, 226, 0.5));
            graphics.moveTo(xFrom, yFrom);
            graphics.lineTo(x, y);

            // Add the line to the stage and update it
            stage.addChild(line);
            stage.update();

            // Store the line and its coordinates in arrays
            allObjectsDraws.push(line);
            allObjectsCoordsDraws.push([[xFrom, yFrom], [x, y]]);
            markingLine = [];
        }
    }

    // WEBSOCKETS CONFIGURATION

    // Add click event to all videos for detection
    videosDetected.on("click", function () {
        // Create a WebSocket connection to the server
        let socket = new WebSocket("ws://" + window.location.host + "/ws/video/");

        // Get the video ID from the clicked element
        videoSrc = $(this).find("source").attr("src");

        // Send the video ID and video source to the server when the WebSocket connection is opened
        addSocketsMethods(socket, videoSrc);

        // Define WebSocket event handling methods
        function addSocketsMethods(socket, videoSrc) {
            socket.onopen = function (event) {
                socket.send(JSON.stringify({ 'videoSrc': videoSrc }));
            };

            // Handle server responses (received frames)
            socket.onmessage = function (event) {
                let data = JSON.parse(event.data);
                document.getElementById('video-frame').src = 'data:image/jpeg;base64,' + data.frame;
            };

            // Handle unexpected WebSocket closure
            socket.onclose = function (event) {
                console.error("WebSocket closed unexpectedly", event);
            };
        }
    });
});
