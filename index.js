import { html, render } from "https://unpkg.com/htm/preact/index.mjs?module";
import {
  useState,
  useEffect,
} from "https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module";

var styleNode = document.createElement("style");
styleNode.type = "text/css";
document.getElementsByTagName("head")[0].appendChild(styleNode);
updateFont(`"Volkhov", serif`);

const CardDefault = {
  header: "header",
  subheader: "Subheader",
  img: "",
  text: "card text",
  footer: "footer",
};

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
  height: 6.5,
  width: 5.8,
  padding: 0.12,
  color: "#000000",
  fontSize: 15,
  imgHeight: 32,
  fontName: `"Volkhov", serif`,
};
// Adjusted for browser print margins in cm
const A4Width = 29.1;
const A4Height = 19.6;

function maxCardNum(h, w) {
  const heightMax = Math.floor(A4Height / h);
  const widthmax = Math.floor(A4Width / w);
  return widthmax * heightMax;
}

function checkIsValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

function App() {
  const [isAdjusted, setIsAdjusted] = useState(false);
  const [cardBasis, setCardBasis] = useState(initCardData);
  const [cardNum, setCardNum] = useState(
    maxCardNum(initCardData.height, initCardData.width)
  );
  const [cardData, setCardData] = useState(Array(cardNum).fill(CardDefault));

  function buildCards(newNum) {
    setCardData(Array(newNum).fill(CardDefault));
  }

  function applyJSON(jsonData) {
    if (jsonData.settings) {
      onAdjustBasis(jsonData.settings);
    }

    const newNum = maxCardNum(
      jsonData.settings.height,
      jsonData.settings.width
    );
    if (jsonData.cards.length > newNum) {
      setCardData(jsonData.cards.slice(0, newNum));
    } else if (jsonData.cards.length < newNum) {
      setCardData(
        jsonData.cards.concat(
          Array(newNum - jsonData.cards.length).fill(CardDefault)
        )
      );
    }
  }

  useEffect(() => {
    document.querySelector("#loading-spinner").remove();

    if (location.search && location.search.length > 1) {
      const URLParams = new URLSearchParams(location.search);
      const url = URLParams.get("json");
      const isValidUrl = checkIsValidUrl(url);

      if (isValidUrl) {
        fetch(url).then((data) => {
          data.json().then((json) => {
            applyJSON(json)
          });
        });
      }
    }
  }, []);

  function setAdjTrue() {
    setIsAdjusted(true);
  }

  function updateSettings(data) {
    setCardBasis(data);
    updateFont(data.fontName);
    setIsAdjusted(false);
  }
  function onAdjustBasis(data) {
    setCardNum(maxCardNum(data.height, data.width));
    updateSettings(data);
  }
  function onBuildAll(data) {
    const newNum = maxCardNum(data.height, data.width);
    setCardNum(newNum);
    buildCards(newNum);
    updateSettings(data);
  }

  function customFontAdd(url, name) {
    var linkNode = document.createElement("link");
    linkNode.rel = "stylesheet";
    linkNode.href = url;
    document.getElementsByTagName("head")[0].appendChild(linkNode);
    updateFont(name);
  }

  function onImportJSON(e) {
    e.preventDefault();
    const fileInput = document.getElementById(importJSONID);

    var reader = new FileReader();

    reader.onload = function (e) {
      const jsonData = JSON.parse(e.target.result);

      applyJSON(jsonData);
    };

    if (fileInput.files[0]) reader.readAsText(fileInput.files[0]);
  }

  return html`<div>
    <${Header}
      cardBasis=${cardBasis}
      onBuildAll=${onBuildAll}
      customFontAdd=${customFontAdd}
      isAdjusted=${isAdjusted}
      setAdjTrue=${setAdjTrue}
      cardData=${cardData}
      onImportJSON=${onImportJSON}
    /><${Print}
      cardBasis=${cardBasis}
      cardNum=${cardNum}
      cardData=${cardData}
    />
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
const importJSONID = "cimportJSON";

function Header(props) {
  const cb = props.cardBasis;
  function getFormData() {
    return {
      height: getIdVal(heightInputId),
      width: getIdVal(widthInputId),
      padding: getIdVal(paddingInputId),
      color: getIdVal(colorInputId),
      fontSize: getIdVal(fontInputId),
      imgHeight: getIdVal(imgsizeInputId),
      fontName: getIdVal(fontNameInputId),
    };
  }
  function adjustSettings() {
    props.onBuildAll(getFormData());
  }
  function customFontAdd() {
    const url = getIdVal(customFontName);
    const name = getIdVal(customFontURL);
    props.customFontAdd(url, name);
  }
  function exportJSON() {
    const jsonString = JSON.stringify({
      settings: getFormData(),
      cards: props.cardData,
    });
    var file = new Blob([jsonString], {
      type: "application/json;charset=utf-8",
    });
    saveAs(file, "card-data.json");
  }

  return html`<div class="header no-print">
    <div class="flex-line" style="flex-wrap: wrap; gap: 1rem">
      <div class="flex-line">
        <div>Card Setup | Height (cm) :</div>
        <input
          onchange=${props.setAdjTrue}
          type="number"
          id=${heightInputId}
          name="height"
          min="1"
          max="10"
          step="0.01"
          value=${cb.height}
        />
      </div>
      <div class="flex-line">
        <div>width (cm):</div>
        <input
          onchange=${props.setAdjTrue}
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
          onchange=${props.setAdjTrue}
          type="number"
          id=${paddingInputId}
          name="padding"
          min="0"
          max="10"
          step="0.01"
          value=${cb.padding}
        />
      </div>
      <div class="flex-line">
        <div>Text Color:</div>
        <input
          type="color"
          onchange=${props.setAdjTrue}
          id=${colorInputId}
          name="color"
          value=${cb.color}
        />
      </div>
      <div class="flex-line">
        <div>Font Size (px):</div>
        <input
          onchange=${props.setAdjTrue}
          type="number"
          id=${fontInputId}
          name="font size"
          min="1"
          max="40"
          step="0.01"
          value=${cb.fontSize}
        />
      </div>
      <div class="flex-line">
        <div class="ml-8">Image Height (% of Card):</div>
        <input
          onchange=${props.setAdjTrue}
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
        <select
          class="ml-8"
          name="Fonts"
          id=${fontNameInputId}
          onchange=${props.setAdjTrue}
        >
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
      </div>
    </div>
    <div class="flex-line">
      <button
        class="ml-8"
        onClick=${adjustSettings}
        disabled=${!props.isAdjusted}
      >
        Adjust
      </button>
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
    <div class="flex-line">
      <form
        enctype="multipart/form-data"
        class="flex-line"
        onSubmit=${(e) => props.onImportJSON(e)}
      >
        <input id=${importJSONID} type="file" />
        <label for=${importJSONID}>Import JSON</label>
        <input type="submit" value="Upload" on />
      </form>

      <button onClick=${exportJSON}>Export Card Data</button>
    </div>
  </div>`;
}

function Print({ cardBasis, cardData }) {
  return html`
    <div class="a4-print">
      <div class="flex-wrap">
        ${cardData.map(
          (data, i) => html`<${Card}
            cardBasis=${cardBasis}
            cardData=${data}
            id="card-body-${i}"
            idVal="${i}"
          />`
        )}
      </div>
    </div>
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
    <input class="c-header" defaultValue="${props.cardData.header}" />
    <input class="c-subheader" defaultValue="${props.cardData.subheader}" />
    <div class="img-wrap" style="height:${cb.imgHeight}%">
      <img class="c-image" alt="img" src="${cardImg || props.cardData.img}" />
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
    <textarea class="c-text" defaultValue="${props.cardData.text}" rows="2" />
    <input class="c-footer" defaultValue="${props.cardData.footer}" />
  </div>`;
}

render(html`<${App} />`, document.querySelector("#preact-app"));
