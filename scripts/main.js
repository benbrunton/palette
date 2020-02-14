import { getCanvas } from './golden-ratio-canvas.js';
import { hexToHSL, HSLToHex, generateColourList } from './colours.js';
import { addPicker, getColoursFromPickers } from './controls.js';

const canvasHolder = document.getElementById("canvas");
const addColours = document.getElementById("add-colour-pickers");
const removeColours = document.getElementById("remove-colour-pickers");
const colourPickers = document.getElementById("colour-pickers");
const derivePalette = document.getElementById(
    "derive-palette"
);

addColours.addEventListener("click", () => {
    addPicker(colourPickers, applyColours);
    applyColours();
});

removeColours.addEventListener("click", () => {
    let lastPicker = colourPickers.lastChild;
    if(!lastPicker){
        return;
    }

    colourPickers.removeChild(lastPicker);
    applyColours();
});

derivePalette.addEventListener("click", () => {
    const n = colourPickers.childNodes.length;
    const colourList = generateColourList(n);
    reorderColours(colourList);
});


function applyColours(){
    let colours = getColoursFromPickers(colourPickers);

    let colourPerms = findEveryPermutation(colours);
    applyFavicon(colourPerms[0]); 

    canvasHolder.innerHTML = "";
    colourPerms.forEach(colourList => {
        let canvas = getCanvas(colourList);
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

function getColoursFromQueryString(cols) {
    let urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has("col")){
        cols = urlParams.get("col").split(",");
    }
    return cols;
}

function applyFavicon(colours) {
    let canvas = getCanvas(colours);
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

const defaultPalette = ["#ffffff", "#FF0000", "#000000"];
const cols = getColoursFromQueryString(defaultPalette);
cols.forEach(() => {addPicker(colourPickers, applyColours)});
reorderColours(cols);
applyColours();

