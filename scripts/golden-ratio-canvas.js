const PHI = (1+ Math.sqrt(5))/2;

export function getCanvas(colours) {

    let startHeight = 200;
    let startWidth = 200;
    let height = startHeight;
    let width = startWidth;
    let canvasWidth = width + (width / PHI);

    let canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = height;
    let context = canvas.getContext('2d');
    let x = 0;
    let y = 0;

    colours.forEach((colour, n) => {
        context.fillStyle = colour;
        context.fillRect(x, y, width, height);
        let quad = n % 4;
        if(quad == 0) {
            x += width;
            width = width / PHI;
            height = width
        } else if (quad == 1){
            x += width - width / PHI;
            width = width / PHI;
            y += height; 
            height = width;
        } else if (quad == 2) {
            height = height / PHI;
            y += height / PHI; 
            x -= width / PHI;
            width = height;
        } else if (quad == 3) {
            width = width / PHI;
            y -= height / PHI; 
            height = height / PHI;
        }
    });
    
    return canvas;
}

