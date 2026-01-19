let allData = [];

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const attrFilter = document.getElementById("attrFilter");
const levelFilter = document.getElementById("levelFilter");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");

fetch("data.json")
  .then(r => r.json())
  .then(data => {
    allData = data;
    initFilters();
    render();
  });

function initFilters() {
  [...new Set(allData.map(d => d.attribute))].forEach(a => {
    attrFilter.innerHTML += `<option value="${a}">${a}</option>`;
  });
  [...new Set(allData.map(d => d.level))].forEach(l => {
    levelFilter.innerHTML += `<option value="${l}">${l}</option>`;
  });
}

function render() {
  grid.innerHTML = "";
  const keyword = search.value;
  const attr = attrFilter.value;
  const level = levelFilter.value;

  allData
    .filter(d =>
      (!keyword || d.name.includes(keyword)) &&
      (!attr || d.attribute === attr) &&
      (!level || d.level === level)
    )
    .forEach(d => {
      const imgSrc = d.image;  // ✅ 改成直接用 data.json 的完整路徑

      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <img src="${imgSrc}">
        <div>${d.name}</div>
        <small>${d.attribute} / ${d.level}</small>
      `;

      div.onclick = () => {
        modal.style.display = "flex";
        modalImg.src = imgSrc;
      };

      grid.appendChild(div);
    });
}

search.oninput = render;
attrFilter.onchange = render;
levelFilter.onchange = render;

