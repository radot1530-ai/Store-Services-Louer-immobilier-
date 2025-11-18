// ====================
// 🔧 FIREBASE SETUP
// ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// ⚡ Ajoute Firebase config ou isit la
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

// ====================
// 🔐 LOGIN ADMIN
// ====================
const loginSection = document.getElementById("login-section");
const adminDashboard = document.getElementById("admin-dashboard");
const loginBtn = document.getElementById("login-btn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("admin-username").value.trim();
    const pass = document.getElementById("admin-password").value.trim();
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      loginSection.classList.remove("active");
      adminDashboard.classList.add("active");
    } catch (error) {
      alert("❌ Non itilizatè oswa modpas la pa kòrèk.");
    }
  });
}

// ✅ Si admin deja konekte
onAuthStateChanged(auth, user => {
  if (user) {
    loginSection.classList.remove("active");
    adminDashboard.classList.add("active");
  } else {
    loginSection.classList.add("active");
    adminDashboard.classList.remove("active");
  }
});

// 🚪 Dekoneksyon
function logoutAdmin() {
  signOut(auth);
}

// ====================
//  NAVIGATION
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

// ====================
//  AJOUTE ANONS
// ====================
let selectedImageData = "";

const inputFile = document.getElementById("paymentFile");
if (inputFile) {
  inputFile.addEventListener("change", async () => {
    const file = inputFile.files[0];
    if (!file) return;

    const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    selectedImageData = await getDownloadURL(storageRef);

    const preview = document.getElementById("previewImg");
    if (preview) preview.src = selectedImageData;
  });
}

const ajouterBtn = document.getElementById("ajouterAnons");
if (ajouterBtn) {
  ajouterBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const categorie = document.getElementById("categorie").value;
    const titre = document.getElementById("titre").value;
    const prix = document.getElementById("prix").value;
    const adresse = document.getElementById("adresse").value;
    const description = document.getElementById("description").value;

    if (!titre || !prix || !adresse || !description) {
      return alert("Tanpri ranpli tout chan yo.");
    }

    try {
      await addDoc(collection(db, "annonces"), {
        categorie,
        titre,
        prix,
        adresse,
        description,
        imageUrl: selectedImageData || "image/default.jpg",
        createdAt: new Date()
      });
      document.getElementById("ajouteSuccess").innerText = "✅ Anons ajoute avèk siksè!";
      setTimeout(() => window.location.reload(), 800);
    } catch (error) {
      alert("❌ Erè pandan ajoute anons: " + error.message);
    }
  });
}

// ====================
//  AFICHE ANONS
// ====================
async function afficheAnonsIndex() {
  const annonces = [];
  const querySnapshot = await getDocs(collection(db, "annonces"));
  querySnapshot.forEach(doc => annonces.push({ id: doc.id, ...doc.data() }));

  const sections = {
    kay: document.getElementById("accueil"),
    Tè: document.getElementById("terres"),
    Sèvis: document.getElementById("services"),
  };

  Object.values(sections).forEach(sec => {
    sec.querySelectorAll(".property-card").forEach(e => e.remove());
  });

  annonces.forEach(a => {
    if (!sections[a.categorie]) return;

    const div = document.createElement("div");
    div.className = "property-card";
    div.innerHTML = `
      <img src="${a.imageUrl}" alt="${a.titre}" class="property-img">
      <div class="property-info">
        <h3>${a.titre}</h3>
        <p><strong>Pri:</strong> ${a.prix}</p>
        <p><strong>Adrès:</strong> ${a.adresse}</p>
        <p><strong>Deskripsyon:</strong> ${a.description}</p>
        <button class="details-btn">Gade detay</button>
      </div>
    `;
    sections[a.categorie].appendChild(div);

    const btn = div.querySelector(".details-btn");
    btn.addEventListener("click", () => montrePopup(a));
  });
}
document.addEventListener("DOMContentLoaded", afficheAnonsIndex);

// ====================
//  DEMANDES KLIYAN
// ====================
async function ajouteDemann(anons, numClient) {
  try {
    await addDoc(collection(db, "demandes"), {
      titre: anons.titre,
      prix: anons.prix,
      nom: anons.nom || "Kliyan",
      whatsapp: `https://wa.me/${numClient}`,
      date: new Date().toLocaleDateString()
    });

    alert("✅ Demann ou an voye avèk siksè!");
    // Notifikasyon admin via WhatsApp
    const adminNumber = "50948404585";
    const text = encodeURIComponent(`Nouvo demann pou: ${anons.titre} | Kliyan: ${numClient}`);
    window.open(`https://wa.me/${adminNumber}?text=${text}`, "_blank");
  } catch (error) {
    alert("❌ Erè pandan voye demann: " + error.message);
  }
}

// Popup pou voye demann
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
