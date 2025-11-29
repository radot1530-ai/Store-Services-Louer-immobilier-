//====================
// 🔐 LOGIN ADMIN
// ====================
const loginSection = document.getElementById("login-section");
const admin/Dashboard = document.getElementById("admin-dashboard");
const loginBtn = document.getElementById("login-btn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const user = document.getElementById("admin-username").value.trim();
    const pass = document.getElementById("admin-password").value.trim();

    if (user === "admin" && pass === "=") {
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
// NAVIGATION
// ====================
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
async function afficheAnonsIndex() {
  try {
    const response = await fetch("/api/annonces");
    const annonces = await response.json();

    const sections = {
      kay: document.getElementById("accueil"),
      Tè: document.getElementById("terres"),
      Sèvis: document.getElementById("services"),
    };

    // Efase tout kat ki deja la
    Object.values(sections).forEach(sec => {
      if (sec) sec.querySelectorAll(".property-card").forEach(e => e.remove());
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
  } catch (error) {
    console.error("Error loading annonces:", error);
  }
}

document.addEventListener("DOMContentLoaded", afficheAnonsIndex);

// =================================
// 3️⃣ --- SAVE DEMANN NAN ADMIN ---
// ================================
const saveWhatsApp = document.getElementById("saveWhatsApp");
if (saveWhatsApp) {
  saveWhatsApp.addEventListener("click", async () => {
    const link = document.getElementById("whatsappLink").value.trim();
    if (link.startsWith("https://wa.me/")) {
      try {
        await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "adminWhatsApp", value: link })
        });
        document.getElementById("whatsappSaved").innerText = "✅ Lyen sove avèk siksè.";
      } catch (error) {
        console.error("Error saving WhatsApp:", error);
        alert("Erè pandan sove lyen an.");
      }
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
  ajouterBtn.addEventListener("click", async () => {
    const categorie = document.getElementById("categorie").value;
    const titre = document.getElementById("titre").value;
    const prix = document.getElementById("prix").value;
    const adresse = document.getElementById("adresse").value;
    const description = document.getElementById("description").value;
    const imageUrl = window.selectedImageData || "image/default.jpg";

    if (!titre || !prix || !adresse || !description) {  
      alert("Tanpri ranpli tout chan yo.");  
      return;  
    }  

    try {
      const response = await fetch("/api/annonces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categorie, titre, prix, adresse, description, imageUrl })
      });

      if (response.ok) {
        document.getElementById("ajouteSuccess").innerText = "✅ Anons ajoute avèk siksè!";  
        setTimeout(() => window.location.reload(), 800);
      } else {
        alert("Erè pandan ajoute anons lan.");
      }
    } catch (error) {
      console.error("Error adding annonce:", error);
      alert("Erè pandan ajoute anons lan.");
    }
  });
}

// ====================
// 📜 AFICHE LIS ANONS NAN ADMIN
// ====================
const anonsList = document.getElementById("anonsList");
if (anonsList) {
  (async () => {
    try {
      const response = await fetch("/api/annonces");
      const annonces = await response.json();

      if (annonces.length === 0) {
        anonsList.innerHTML = "<p>Pa gen okenn anons anrejistre pou kounya.</p>";
      } else {
        anonsList.innerHTML = annonces.map(a => `
          <div class="anons-item">
            <div>
              <strong>${a.titre}</strong> - ${a.prix}<br>
              <small>${a.adresse}</small>
            </div>
            <button class="remove-btn" onclick="supprimerAnons(${a.id})">🗑️</button>
          </div>
        `).join("");
      }
    } catch (error) {
      console.error("Error loading annonces:", error);
      anonsList.innerHTML = "<p>Erè pandan chaje anons yo.</p>";
    }
  })();
}

// 🗑️ Efase anons
async function supprimerAnons(id) {
  try {
    const response = await fetch(`/api/annonces/${id}`, { method: "DELETE" });
    if (response.ok) {
      window.location.reload();
    } else {
      alert("Erè pandan efase anons lan.");
    }
  } catch (error) {
    console.error("Error deleting annonce:", error);
    alert("Erè pandan efase anons lan.");
  }
}

// ====================
// 📩 DEMANDES KLIYAN NAN ADMIN PANEL
// ====================
document.addEventListener("DOMContentLoaded", () => {
  afficheDemandesAdmin();
});

// ✅ Fonksyon pou afiche lis demann yo
async function afficheDemandesAdmin() {
  const container = document.getElementById("demandListContainer");
  if (!container) return;

  try {
    const response = await fetch("/api/demandes");
    const demandes = await response.json();

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
        <button class="accept-btn" data-whatsapp="${d.whatsapp}" data-id="${d.id}">✅ Asepte antant</button>
        <div class="whatsapp-link hidden">
          <a href="#" target="_blank" class="whatsapp-btn">💬 Ale sou WhatsApp</a>
        </div>
      `;
      container.appendChild(div);
    });

    // Bouton pou aksepte antant
    document.querySelectorAll(".accept-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const num = btn.dataset.whatsapp;
        const id = btn.dataset.id;
        const linkDiv = btn.nextElementSibling;
        const a = linkDiv.querySelector("a");
        a.href = num;
        linkDiv.classList.remove("hidden");
        a.click();

        // Efase demann lan apre akseptasyon
        try {
          await fetch(`/api/demandes/${id}`, { method: "DELETE" });
          btn.parentElement.remove();
        } catch (error) {
          console.error("Error deleting demande:", error);
        }
      });
    });
  } catch (error) {
    console.error("Error loading demandes:", error);
    container.innerHTML = "<p>Erè pandan chaje demann yo.</p>";
  }
}

// ✅ Fonksyon pou sove demann kliyan
async function ajouteDemann(anons, numClient) {
  try {
    const response = await fetch("/api/demandes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titre: anons.titre,
        prix: anons.prix,
        nom: anons.nom || "Kliyan",
        whatsapp: `https://wa.me/${numClient}`,
        date: new Date().toLocaleDateString()
      })
    });

    if (response.ok) {
      alert("✅ Demann ou an voye avèk siksè!");

      // Voye mesaj sou WhatsApp admin
      const settingsResponse = await fetch("/api/settings/adminWhatsApp");
      if (settingsResponse.ok) {
        const setting = await settingsResponse.json();
        const adminNumber = setting.value.replace("https://wa.me/", "");
        const text = encodeURIComponent(`Nouvo demann pou: ${anons.titre} | Kliyan: ${numClient}`);
        window.open(`https://wa.me/${adminNumber}?text=${text}`, "_blank");
      }
    } else {
      alert("Erè pandan voye demann lan.");
    }
  } catch (error) {
    console.error("Error creating demande:", error);
    alert("Erè pandan voye demann lan.");
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
(function() {
  window.selectedImageData = "";

  const inputFile = document.getElementById("paymentFile");
  if (!inputFile) return;

  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      window.selectedImageData = e.target.result;
      const preview = document.getElementById("previewImg");
      if (preview) preview.src = window.selectedImageData;
    };
    reader.readAsDataURL(file);
  });
})();
