import { html, render } from "https://unpkg.com/htm/preact/index.mjs?module";
import { useState } from "https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module";

function getIdVal(id) {
  return document.querySelector(`#${id}`).value;
}
const initCardData = {
  height: 6.7,
  width: 5.82,
  padding: 5,
  color: "#000000",
  fontSize: 15,
  imgHeight: 32,
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
  function onAdjustBasis(h, w, pad = 8) {
    setCardBasis({
      height: h,
      width: w,
      pad: 8,
    });
    setCardNum(maxCardNum(h, w));
  }
  return html`<div>
    <${Header} cardBasis=${cardBasis} onAdjustBasis=${onAdjustBasis} /><${Print}
      cardBasis=${cardBasis}
      cardNum=${cardNum}
    />
  </div>`;
}

const heightInputId = "cheight";
const widthInputId = "cwidth";

function Header(props) {
  const cb = props.cardBasis;
  function adjustbasis() {
    const h = getIdVal(heightInputId);
    const w = getIdVal(widthInputId);
    props.onAdjustBasis(h, w);
  }

  return html`<div class="no-print header">
    <${Title} />
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
      <button class="ml-8" onClick=${adjustbasis}>Adjust</button>
    </div>
  </div> `;
}

function Title() {
  return html`
    <div>
      <h2>Welcome to The Simple Online Card Editor</h2>
      <h4>A basic tool for quickly creating card prototypes</h4>
    </div>
  `;
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
    }
    reader.readAsDataURL(e.srcElement.files[0]);
  }
  const cb = props.cardBasis;
  return html`<div
    class="card"
    style="height:${cb.height}cm;width:${cb.width}cm;padding:${cb.padding}px;color:${cb.color};font-size:${cb.fontSize}px"
  >
    <input class="c-header" value="Header" />
    <input class="c-subheader" value="subheader" />
    <div class="img-wrap" style="height:${cb.imgHeight}%">
      <img class="c-image" alt="img" src="${cardImg}" />
      <div class="addImgBtn">
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

render(html`<${App} />`, document.body);
