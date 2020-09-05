import { html, render } from "https://unpkg.com/htm/preact/index.mjs?module";
import {
  useState,
  useEffect,
} from "https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module";

var styleNode = document.createElement("style");
styleNode.type = "text/css";
document.getElementsByTagName("head")[0].appendChild(styleNode);
updateFont(`"Volkhov", serif`);

function updateFont(fontName) {
  if (!!(window.attachEvent && !window.opera)) {
    styleNode.styleSheet.cssText = `.a4-print { font-family: ${fontName}; }`;
  } else {
    var styleText = document.createTextNode(
      `.a4-print { font-family: ${fontName}; } `
    );
    styleNode.appendChild(styleText);
  }
}

function getIdVal(id) {
  return document.querySelector(`#${id}`).value;
}
const initCardData = {
  height: 6.7,
  width: 5.82,
  padding: 0.12,
  color: "#000000",
  fontSize: 15,
  imgHeight: 32,
  fontName: `"Volkhov", serif`,
};
// Adjusted for browser print margins in cm
const A4Width = 29.2;
const A4Height = 20.3;
function maxCardNum(h, w) {
  const heightMax = Math.floor(A4Height / h);
  const widthmax = Math.floor(A4Width / w);
  return widthmax * heightMax;
}

function App() {
  const [cardBasis, setCardBasis] = useState(initCardData);
  const [cardNum, setCardNum] = useState(
    maxCardNum(initCardData.height, initCardData.width)
  );
  useEffect(() => {
    document.querySelector("#loading-spinner").remove();
  }, []);
  function onAdjustBasis(h, w, padding, color, fontSize, imgHeight, fontName) {
    setCardBasis({
      height: h,
      width: w,
      padding,
      color,
      fontSize,
      imgHeight,
      fontName,
    });
    setCardNum(maxCardNum(h, w));
    updateFont(fontName);
  }
  function customFontAdd(url, name) {
    var linkNode = document.createElement("link");
    linkNode.rel = "stylesheet";
    linkNode.href = url;
    document.getElementsByTagName("head")[0].appendChild(linkNode);
    updateFont(name);
  }
  return html`<div>
    <${Header}
      cardBasis=${cardBasis}
      onAdjustBasis=${onAdjustBasis}
      customFontAdd=${customFontAdd}
    /><${Print} cardBasis=${cardBasis} cardNum=${cardNum} />
  </div>`;
}

const heightInputId = "cheight";
const widthInputId = "cwidth";
const paddingInputId = "cpad";
const colorInputId = "ccolor";
const fontInputId = "cfonsize";
const imgsizeInputId = "cimgsize";
const fontNameInputId = "cfontname";

const customFontURL = "customfURLId";
const customFontName = "customfNameId";

function Header(props) {
  const cb = props.cardBasis;
  function adjustbasis() {
    const h = getIdVal(heightInputId);
    const w = getIdVal(widthInputId);
    const p = getIdVal(paddingInputId);
    const col = getIdVal(colorInputId);
    const fs = getIdVal(fontInputId);
    const is = getIdVal(imgsizeInputId);
    const font = getIdVal(fontNameInputId);
    props.onAdjustBasis(h, w, p, col, fs, is, font);
  }
  function customFontAdd() {
    const url = getIdVal(customFontName);
    const name = getIdVal(customFontURL);
    props.customFontAdd(url, name);
  }

  return html`<div class="header">
    <div class="flex-line">
      <div>Card Setup | Height (cm) :</div>
      <input
        type="number"
        id=${heightInputId}
        name="height"
        min="1"
        max="10"
        step="0.01"
        value=${cb.height}
      />
      <div class="ml-8">width (cm):</div>
      <input
        type="number"
        id=${widthInputId}
        name="height"
        min="1"
        max="10"
        step="0.01"
        value=${cb.width}
      />
    </div>
    <div class="flex-line">
      <div>Padding (cm):</div>
      <input
        type="number"
        id=${paddingInputId}
        name="padding"
        min="0"
        max="10"
        step="0.01"
        value=${cb.padding}
      />
      <div class="ml-8">Color:</div>
      <input type="color" id=${colorInputId} name="color" value=${cb.color} />
    </div>
    <div class="flex-line">
      <div>Font Size (px):</div>
      <input
        type="number"
        id=${fontInputId}
        name="font size"
        min="1"
        max="40"
        step="0.01"
        value=${cb.fontSize}
      />
      <div class="ml-8">Image Height (% of Card):</div>
      <input
        type="number"
        id=${imgsizeInputId}
        name="Image Height"
        min="1"
        max="90"
        step="0.1"
        value=${cb.imgHeight}
      />
    </div>
    <div class="flex-line">
      <div>Font:</div>
      <select class="ml-8" name="Fonts" id=${fontNameInputId}>
        <option style="font-family:'Volkhov'" value="${`"Volkhov", serif`}">
          Volkhov
        </option>
        <option
          style="font-family:'Arial'"
          value="“Arial”, Helvetica, sans-serif"
        >
          Arial
        </option>
        <option style="font-family:'Verdana'" value="Verdana, sans-serif">
          Verdana
        </option>
        <option
          style="font-family:'Trebuchet MS'"
          value="'Trebuchet MS', sans-serif"
        >
          Trebuchet MS
        </option>
        <option style="font-family:'Didot'" value="'Didot', sans-serif">
          Didot
        </option>
        <option
          style="font-family:'American Typewriter'"
          value="'American Typewriter', sans-serif"
        >
          American Typewriter
        </option>
        <option style="font-family:Courier'" value="'Courier', sans-serif">
          Courier
        </option>
        <option style="font-family:Luminari'" value="'Luminari', sans-serif">
          Luminari
        </option>
      </select>
      <button class="ml-8" onClick=${adjustbasis}>Adjust</button>
    </div>
    <p>
      To add a custom font you need the link & the font's name, google fonts is
      a very rich source; eg
      "https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap"
    </p>
    <div class="flex-line">
      <div>Font URL:</div>
      <input type="text" id=${customFontName} />
      <div class="ml-8">Font Name:</div>
      <input type="text" id=${customFontURL} />
      <button class="ml-8" onClick=${customFontAdd}>Add Custom Font</button>
    </div>
  </div>`;
}

function Print(props) {
  let CardArr = [];
  for (let i = 0; i < props.cardNum; i++) {
    CardArr.push(
      html`<${Card}
        cardBasis=${props.cardBasis}
        id="card-body-${i}"
        idVal="${i}"
      />`
    );
  }
  return html`
    <div class="a4-print"><div class="flex-wrap">${CardArr}</div></div>
  `;
}
function Card(props) {
  const [cardImg, setCardImg] = useState(null);
  function thisFileUpload() {
    document.getElementById(`file-${props.idVal}`).click();
  }
  function imgInputTrigger(e) {
    var reader = new FileReader();
    reader.onload = function (e) {
      setCardImg(e.target.result);
    };
    reader.readAsDataURL(e.srcElement.files[0]);
  }
  const cb = props.cardBasis;
  return html`<div
    class="card"
    style="height:${cb.height}cm;width:${cb.width}cm;padding:${cb.padding}cm;color:${cb.color};font-size:${cb.fontSize}px"
  >
    <input class="c-header" value="Header" />
    <input class="c-subheader" value="subheader" />
    <div class="img-wrap" style="height:${cb.imgHeight}%">
      <img class="c-image" alt="img" src="${cardImg}" />
      <div class="addImgBtn no-print">
        <input
          type="file"
          id="file-${props.idVal}"
          onchange=${imgInputTrigger}
          style="display:none;"
        />
        <div onClick=${thisFileUpload}>[+]</div>
      </div>
    </div>
    <textarea class="c-text" value="text" rows="2" />
    <input class="c-footer" value="footer" />
  </div>`;
}

render(html`<${App} />`, document.querySelector("#preact-app"));
