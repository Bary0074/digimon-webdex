const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const levelFilter = document.getElementById("levelFilter");
const attrFilter = document.getElementById("attrFilter");
const typeFilter = document.getElementById("typeFilter");

const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");

const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalLevel = document.getElementById("modalLevel");
const modalAttr = document.getElementById("modalAttr");
const modalType = document.getElementById("modalType");
const modalSkills = document.getElementById("modalSkills");

let allData = [];

/* ===== 別名對照（可自行擴充） ===== */
const aliasMap = {
  "怪蛙皇": ["殿鮫軍曹獸"],
  "殿鮫軍曹獸": ["怪蛙皇"]
};

fetch("data_updated.json")
  .then(res => res.json())
  .then(data => {
    allData = data;
    initFilters(data);
    render(data);
  });

function initFilters(data) {
  const levels = new Set();
  const attrs = new Set();
  const types = new Set();

  data.forEach(d => {
    if (d.level) levels.add(d.level);
    if (d.attribute) attrs.add(d.attribute);
    (d.type || []).forEach(t => types.add(t));
  });

  fillSelect(levelFilter, levels);
  fillSelect(attrFilter, attrs);
  fillSelect(typeFilter, types);
}

function fillSelect(select, values) {
  [...values].sort().forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    select.appendChild(opt);
  });
}

function render(data) {
  grid.innerHTML = "";

  data.forEach(d => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${d.image}" alt="${d.name}">
      <h3>${d.name}</h3>
      <p class="level">${d.level}</p>
    `;

    card.onclick = () => openModal(d);
    grid.appendChild(card);
  });
}

/* ===== Modal ===== */
function openModal(d) {
  modalImg.src = d.image;
  modalName.textContent = d.name;
  modalLevel.textContent = d.level || "-";
  modalAttr.textContent = d.attribute || "-";
  modalType.textContent = (d.type || []).join("、") || "-";

  modalSkills.innerHTML = "";
  (d.skills || []).forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    modalSkills.appendChild(li);
  });

  modal.classList.remove("hidden");
}

closeBtn.onclick = () => modal.classList.add("hidden");
modal.onclick = () => modal.classList.add("hidden");

/* ===== 搜尋 & 篩選 ===== */
function applyFilter() {
  const keyword = searchInput.value.trim();
  const lv = levelFilter.value;
  const attr = attrFilter.value;
  const type = typeFilter.value;

  const result = allData.filter(d => {
    // 名稱 + 別名搜尋
    let nameMatch = d.name.includes(keyword);
    if (!nameMatch && aliasMap[keyword]) {
      nameMatch = aliasMap[keyword].includes(d.name);
    }

    const lvMatch = !lv || d.level === lv;
    const attrMatch = !attr || d.attribute === attr;
    const typeMatch = !type || (d.type || []).includes(type);

    return nameMatch && lvMatch && attrMatch && typeMatch;
  });

  render(result);
}

[searchInput, levelFilter, attrFilter, typeFilter]
  .forEach(el => el.addEventListener("input", applyFilter));
