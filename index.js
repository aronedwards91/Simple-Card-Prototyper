import { html, render } from "https://unpkg.com/htm/preact/index.mjs?module";
import { useState } from "https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module";

function getIdVal(id) {
  return document.querySelector(`#${id}`).value;
}
const initCardData = {
  height: 4.2,
  width: 5.5,
};
// Adjusted for browser print margins in cm
const A4Width = 29.2;
const A4Height = 20.5;
function maxCardNum(h, w) {
  const widthmax = Math.floor(A4Width / w);
  const heightMax = Math.floor(A4Height / h);
  return widthmax * heightMax;
}

function App() {
  const [cardBasis, setCardBasis] = useState(initCardData);
  const [cardNum, setCardNum] = useState(
    maxCardNum(initCardData.height, initCardData.width)
  );
  function onAdjustBasis(h, w) {
    setCardBasis({
      height: h,
      width: w,
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
    console.log("wh", h + "  - " + w);
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
      <div>width (cm):</div>
      <input
        type="number"
        id=${widthInputId}
        name="height"
        min="1"
        max="10"
        step="0.01"
        value=${cb.width}
      />
      <button onClick=${adjustbasis}>Adjust</button>
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
    CardArr.push(html`<${Card} cardBasis=${props.cardBasis} />`);
  }
  return html`
    <div class="a4-print"><div class="flex-wrap">${CardArr}</div></div>
  `;
}
function Card(props) {
  console.log("props.cardBasis", props.cardBasis);
  const cb = props.cardBasis;
  return html`<div
    class="card"
    style="height:${cb.height}cm;width:${cb.width}cm;"
  >
    <h4>Card header</h4>
  </div>`;
}

render(html`<${App} />`, document.body);
