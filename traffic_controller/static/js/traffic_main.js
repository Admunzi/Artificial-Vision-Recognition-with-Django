$(document).ready(function () {
    // Get the canvas and necessary buttons
    let canvas = document.getElementById("demoCanvas");
    let clearCanvasButton = document.getElementById("clearCanvas");

    let stage = new createjs.Stage(canvas);
    let allObjectsDraws = [];
    let allObjectsCoordsDraws = [];
    let markingLine = []

    // Set the stage bounds based on the canvas dimensions
    stage.setBounds(0, 0, canvas.width, canvas.height);

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

        if (markingLine == 0){
            markingLine.push(point.x, point.y);
        } else {
            // Retrieve starting coordinates
            xFrom = markingLine[0]
            yFrom = markingLine[1]

            let line = new createjs.Shape();

            let graphics = line.graphics;
            graphics.setStrokeStyle(9);
            graphics.beginStroke(createjs.Graphics.getRGB(124, 250, 226, 0.5));
            graphics.moveTo(xFrom, yFrom);
            graphics.lineTo(x, y);

            stage.addChild(line);
            stage.update();

            // Store the line and its coordinates in arrays
            allObjectsDraws.push(line);
            allObjectsCoordsDraws.push([[xFrom, yFrom], [x,y]]);
            markingLine= [];
        }
    }
});
