// ====================
// 🔐 LOGIN ADMIN
// ====================
const loginSection = document.getElementById("login-section");
const adminDashboard = document.getElementById("admin-dashboard");
const loginBtn = document.getElementById("login-btn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const user = document.getElementById("admin-username").value.trim();
    const pass = document.getElementById("admin-password").value.trim();

    if (user === "admin" && pass === "kaylakay2025") {
      localStorage.setItem("adminLogged", "true");
      loginSection.classList.remove("active");
      adminDashboard.classList.add("active");
    } else {
      alert("❌ Non itilizatè oswa modpas la pa kòrèk.");
    }
  });
}

// ✅ Si admin deja konekte
if (localStorage.getItem("adminLogged") === "true") {
  if (loginSection) loginSection.classList.remove("active");
  if (adminDashboard) adminDashboard.classList.add("active");
}

// 🚪 Dekoneksyon
function logoutAdmin() {
  localStorage.removeItem("adminLogged");
  window.location.reload();
}
// ====================
//  APP.JS - KayLakay
// ==========================

// ------------------- NAVIGATION -------------------
if (document.querySelector(".tab")) {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });
}

// =====================================
// 1️⃣ --- AFFICHE ANONS POU TOUT KATEGORI ---  
// ================================
function afficheAnonsIndex() {
  const annonces = JSON.parse(localStorage.getItem("annonces")) || [];

  const sections = {
    kay: document.getElementById("accueil"),
    Tè: document.getElementById("terres"),
    Sèvis: document.getElementById("services"),
  };

  // Efase tout kat ki deja la
  Object.values(sections).forEach(sec => {
    sec.querySelectorAll(".property-card").forEach(e => e.remove());
  });

  // Afiche chak anons
  annonces.forEach(a => {
    if (!sections[a.categorie]) return;

    const div = document.createElement("div");
    div.className = "property-card";
    div.innerHTML = `
      <img src="${a.imageUrl || 'image/*'}" alt="${a.titre}" class="property-img">
      <div class="property-info">
        <h3>${a.titre}</h3>
        <p><strong>Pri:</strong> ${a.prix}</p>
        <p><strong>Adrès:</strong> ${a.adresse}</p>
        <p><strong>Deskripsyon:</strong> ${a.description}</p>
        <button class="details-btn">Gade detay</button>
      </div>
    `;
        sections[a.categorie].appendChild(div);

    // --- Bouton "Gade detay" ---
    const btn = div.querySelector(".details-btn");
    btn.addEventListener("click", () => {
      montrePopup(a);
    });
  });
}
document.addEventListener("DOMContentLoaded", afficheAnonsIndex);

// =================================
// 3️⃣ --- SAVE DEMANN NAN ADMIN ---
// ================================
const saveWhatsApp = document.getElementById("saveWhatsApp");
if (saveWhatsApp) {
  saveWhatsApp.addEventListener("click", () => {
    const link = document.getElementById("whatsappLink").value.trim();
    if (link.startsWith("https://wa.me/")) {
      localStorage.setItem("adminWhatsApp", link);
      document.getElementById("whatsappSaved").innerText = "✅ Lyen sove avèk siksè.";
    } else {
      alert("Tanpri mete yon lyen WhatsApp valab (ex: https://wa.me/509XXXXXXXX).");
    }
  });
}

// ====================
// 🏠 AJOUTE ANONS
// ====================
const ajouterBtn = document.getElementById("ajouterAnons");
if (ajouterBtn) {
ajouterBtn.addEventListener("click", () => {
const categorie = document.getElementById("categorie").value;
const titre = document.getElementById("titre").value;
const prix = document.getElementById("prix").value;
const adresse = document.getElementById("adresse").value;
const description = document.getElementById("description").value;
const imageUrl = selectedImageData || "image/default.jpg";
if (!titre || !prix || !adresse || !description) {  
  alert("Tanpri ranpli tout chan yo.");  
  return;  
}  

const annonce = { categorie, titre, prix, adresse, description, imageUrl };  
let annonces = JSON.parse(localStorage.getItem("annonces")) || [];  
annonces.push(annonce);  
localStorage.setItem("annonces", JSON.stringify(annonces));  

document.getElementById("ajouteSuccess").innerText = "✅ Anons ajoute avèk siksè!";  
setTimeout(() => window.location.reload(), 800);

});
}

// ====================
// 📜 AFICHE LIS ANONS NAN ADMIN
// ====================
const anonsList = document.getElementById("anonsList");
if (anonsList) {
  const annonces = JSON.parse(localStorage.getItem("annonces")) || [];
  if (annonces.length === 0) {
    anonsList.innerHTML = "<p>Pa gen okenn anons anrejistre pou kounya.</p>";
  } else {
    anonsList.innerHTML = annonces.map((a, i) => `
      <div class="anons-item">
        <div>
          <strong>${a.titre}</strong> - ${a.prix}<br>
          <small>${a.adresse}</small>
        </div>
        <button class="remove-btn" onclick="supprimerAnons(${i})">🗑️</button>
      </div>
    `).join("");
  }
}

// 🗑️ Efase anons
function supprimerAnons(index) {
  let annonces = JSON.parse(localStorage.getItem("annonces")) || [];
  annonces.splice(index, 1);
  localStorage.setItem("annonces", JSON.stringify(annonces));
  window.location.reload();
}

        // Ouvri WhatsApp admin nan
        const adminLink = localStorage.getItem("adminWhatsApp");
        if (adminLink) {
          window.open(adminLink, "_blank");
        } else {
          alert("⚠️ Pa gen lyen WhatsApp admin nan anrejistre.");
        }
        
// ====================
// 📩 DEMANDES KLIYAN NAN ADMIN PANEL
// ====================
document.addEventListener("DOMContentLoaded", () => {
  afficheDemandesAdmin();
});

// ✅ Fonksyon pou afiche lis demann yo
function afficheDemandesAdmin() {
  const container = document.getElementById("demandListContainer");
  if (!container) return;

  const demandes = JSON.parse(localStorage.getItem("demandes") || "[]");
  container.innerHTML = "";

  if (demandes.length === 0) {
    container.innerHTML = "<p>Akenn demann pou kounya.</p>";
    return;
  }

  demandes.forEach((d) => {
    const div = document.createElement("div");
    div.className = "demand-card";
    div.innerHTML = `
      <h3>${d.titre}</h3>
      <p><strong>Demann pa:</strong> ${d.nom}</p>
      <p><strong>Pri:</strong> ${d.prix}</p>
      <p><strong>Dat demann:</strong> ${d.date}</p>
      <button class="accept-btn" data-whatsapp="${d.whatsapp}">✅ Asepte antant</button>
      <div class="whatsapp-link hidden">
        <a href="#" target="_blank" class="whatsapp-btn">💬 Ale sou WhatsApp</a>
      </div>
    `;
    container.appendChild(div);
  });

  // Bouton pou aksepte antant
  document.querySelectorAll(".accept-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const num = btn.dataset.whatsapp;
      const linkDiv = btn.nextElementSibling;
      const a = linkDiv.querySelector("a");
      a.href = num;
      linkDiv.classList.remove("hidden");
      a.click();

      // Efase demann lan apre akseptasyon
      const titre = btn.parentElement.querySelector("h3").innerText.trim();
      let demandes = JSON.parse(localStorage.getItem("demandes")) || [];
      demandes = demandes.filter((d) => d.titre !== titre);
      localStorage.setItem("demandes", JSON.stringify(demandes));
      btn.parentElement.remove();
    });
  });
}

// ✅ Fonksyon pou sove demann kliyan
function ajouteDemann(anons, numClient) {
  
  const demandes = JSON.parse(localStorage.getItem("demandes")) || [];
  
  const nouvoDemann = {
    id: Date.now(),
    titre: anons.titre,
    prix: anons.prix,
    nom: anons.nom || "Kliyan",
    whatsapp: `https://wa.me/${numClient}`,
    date: new Date().toLocaleDateString(),
  };
  
  demandes.push(nouvoDemann);
  localStorage.setItem("demandes", JSON.stringify(demandes));
  
  alert("✅ Demann ou an voye avèk siksè!");
  
  // ============================
  // ➕ ADD THIS PART ↓↓↓
  // >>> voye mesaj tou sou WhatsApp admin
localStorage.setItem("admin_whatsapp", "50948404585");
  const adminNumber = localStorage.getItem("admin_whatsapp") || "";
  if (adminNumber !== "") {
    const text = encodeURIComponent(`Nouvo demann pou: ${anons.titre} | Kliyan: ${numClient}`);
    window.open(`https://wa.me/${adminNumber}?text=${text}`, "_blank");
  }
}
// ✅ Popup pou voye demann
function montrePopup(anons) {
  let popup = document.getElementById("popupDemann");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popupDemann";
    popup.innerHTML = `
      <div class="popup-overlay"></div>
      <div class="popup-content">
        <h3>💬 Enterese ak: ${anons.titre}</h3>
        <p>Mete nimewo WhatsApp ou pou kontakte admin lan:</p>
        <input type="text" id="clientNumber" placeholder="Ex: 50944556677">
        <button id="envoyeDemann">📩 Voye demann</button>
        <button id="fèmenPopup">❌ Fèmen</button>
      </div>
    `;
    document.body.appendChild(popup);
  }

  popup.style.display = "block";
  popup.querySelector(".popup-overlay").onclick = () => popup.remove();
  popup.querySelector("#fèmenPopup").onclick = () => popup.remove();

  popup.querySelector("#envoyeDemann").onclick = () => {
    const num = document.getElementById("clientNumber").value.trim();
    if (!num) return alert("Tanpri mete nimewo ou!");
    ajouteDemann(anons, num);
    popup.remove();
  };
}

// ==================================================
// Opsyon foto pou admin - preview sèlman
// ==================================================
(function() {  // IIFE pou pa deranje lòt kòd
  let selectedImageData = "";

  const inputFile = document.getElementById("paymentFile");
  if (!inputFile) return;

  inputFile.addEventListener("change", () => {
      const file = inputFile.files[0];
      if(!file) return;

      const reader = new FileReader();
      reader.onload = function(e){
          selectedImageData = e.target.result;
          const preview = document.getElementById("previewImg");
          if(preview) preview.src = selectedImageData;
      };
      reader.readAsDataURL(file);
  });

  // Ranplase imageUrl nan bouton Ajouter Anons san modifye lòt bagay
  const ajouterBtn = document.getElementById("ajouterAnons");
  if(ajouterBtn){
    ajouterBtn.addEventListener("click", (e)=>{
      e.preventDefault(); // anpeche reload si form la gen submit

      const categorie = document.getElementById("categorie").value;
      const titre = document.getElementById("titre").value;
      const prix = document.getElementById("prix").value;
      const adresse = document.getElementById("adresse").value;
      const description = document.getElementById("description").value;

      const imageUrl = selectedImageData || "image/default.jpg";

      if(!titre || !prix || !adresse || !description){
          alert("Tanpri ranpli tout chan yo.");
          return;
      }

      const annonce = {categorie, titre, prix, adresse, description, imageUrl};
      let annonces = JSON.parse(localStorage.getItem("annonces")) || [];
      annonces.push(annonce);
      localStorage.setItem("annonces", JSON.stringify(annonces));

      document.getElementById("ajouteSuccess").innerText = "✅ Anons ajoute avèk siksè!";
      setTimeout(()=> window.location.reload(), 800);
    });
  }

})();
