const PHI = (1+ Math.sqrt(5))/2;
const canvasHolder = document.getElementById("canvas");
const addColours = document.getElementById("add-colour-pickers");
const removeColours = document.getElementById("remove-colour-pickers");
const colourPickers = document.getElementById("colour-pickers");
const derivePalette = document.getElementById(
    "derive-palette"
);

addColours.addEventListener("click", () => {
    addPicker();
    applyColours();
});

removeColours.addEventListener("click", () => {
    let lastPicker = colourPickers.childNodes[
        colourPickers.childNodes.length - 1
    ];
    if(!lastPicker){
        return;
    }

    colourPickers.removeChild(lastPicker);
    applyColours();
});

derivePalette.addEventListener("click", () => {
    let firstCol = colourPickers.firstChild.value;
    let colourList = [firstCol];
    let latestColour = hexToHSL(firstCol);
    for(let i = 1; i < colourPickers.childNodes.length; i++ ) {

    if(latestColour.s == 0 || latestColour.l == 0){
        latestColour.h = Math.floor(
            Math.random() * 360
        );
        latestColour.s = Math.floor(
            Math.random() * 100
        );
        latestColour.l = Math.floor(
            Math.random() * 100
        );
    }

    if(latestColour.s < 10) {
        latestColour.s *= PHI * PHI;
    }

    if(latestColour.l < 15) {
        latestColour.l *= PHI * PHI;
    }


        let n = Math.floor(Math.random() * 3);
        if(n == 0){
            let newL = latestColour.l * PHI;
            while(newL > 100) {
                newL -= 100;
            }
            latestColour.l = newL;
        } else if (n == 1) {
            let newS = latestColour.s / PHI; 
            latestColour.s = newS;
        } else {

            let newH = latestColour.h * PHI; 
            while(newH > 360) {
                newH -= 360;
            }
            latestColour.h = newH;
        }
        colourList.push(HSLToHex(
            latestColour.h,
            latestColour.s,
            latestColour.l
        ));
    }
    reorderColours(colourList);
});

function addPicker () {
    const input = document.createElement("input");
    input.type = "color";
    input.addEventListener("change", applyColours);

    colourPickers.appendChild(input);
}

function applyColours(){

    let pickers = [].slice.call(
        colourPickers.childNodes
    );
    let colours = pickers.map(picker => {
        return picker.value
    });

    let colourPerms = findEveryPermutation(colours);
    applyFavicon(colourPerms[0]); 

    canvasHolder.innerHTML = "";
    colourPerms.forEach(colourList => {
        let canvas = getGoldenRatioCanvas(colourList);
        canvas.addEventListener("click", () => {
            reorderColours(colourList);
        });
        canvasHolder.appendChild(canvas);
    });

    history.pushState(
        null, "", "?col=" + colours
            .map(encodeURIComponent).join(",")
    );

}

function reorderColours(colourList) {
    for(let i = 0; i < colourPickers.childNodes.length; i++ ) {
        colourPickers.childNodes[i].value = colourList[i];
    }
    applyColours();
}

function getGoldenRatioCanvas(colours) {

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

function findEveryPermutation(list) {
    let result = [];

    const permute = (arr, m = []) => {
      if (arr.length === 0) {
        result.push(m)
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next))
       }
     }
   } 

   permute(list)

   return result;

}

function getColoursFromQueryString() {
    let urlParams = new URLSearchParams(window.location.search);
    let cols = ["#ffffff", "#FF0000", "#000000"];
    if(urlParams.has("col")){
        cols = urlParams.get("col").split(",");
    }
    cols.forEach(addPicker);
    reorderColours(cols);
}

function applyFavicon(colours) {
    let canvas = getGoldenRatioCanvas(colours);
    let link = document.createElement('link');
    link.id = "favicon";
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL("image/x-icon");
    try {
        document.getElementsByTagName('head')[0]
            .removeChild(
                document.getElementById("favicon")
        );
    } catch (err) { }
    document.getElementsByTagName('head')[0].appendChild(link);


}

getColoursFromQueryString();
applyColours();

function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  if (delta == 0)
    h = 0;
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  else if (cmax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0)
    h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s,  l };
}


function HSLToHex(h,s,l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}

