const PHI = (1+ Math.sqrt(5))/2;
const DEFAULT_COLOUR = "#FFFFFF";

export function generateColourList(count) {
    let colourList = [];
    let latestColour = hexToHSL(DEFAULT_COLOUR);
    for(let i = 0; i < count; i++ ) {

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
        let multiplyer = Math.max(1, Math.floor(Math.random() * 3));
        if(n == 0){
            let newL = latestColour.l * PHI * multiplyer;
            while(newL > 100) {
                newL -= 100;
            }
            latestColour.l = newL;
        } else if (n == 1) {
            let newS = latestColour.s / PHI / multiplyer; 
            latestColour.s = newS;
        } else {

            let newH = latestColour.h * PHI * multiplyer; 
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

    return colourList;
}

export function hexToHSL(H) {
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


export function HSLToHex(h,s,l) {
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

export function findEveryPermutation(list) {
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

