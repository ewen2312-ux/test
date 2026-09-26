// Lire des utilisateurs en stockage local
function readUsers() {
  try {
    return JSON.parse(
      localStorage.getItem("site_demo_users") || "[]"
    );
  } catch {
    return [];
  }
}

// Enregistrer les inscriptions
function saveUsers(users) {
  localStorage.setItem(
    "site_demo_users",
    JSON.stringify(users)
  );
}

// Passer de connexion à inscription
function setMode(newMode) {
  mode = newMode;
  
  $("loginTab").classList.toggle(
    "active",
    mode === "login"
  );

  $("signupTab").classList.toggle(
    "active",
    mode === "signup"
  );
  
  $("submit").textContent =
    mode === "login"
      ? "Se connecter"
      : "Créer mon compte";
}

// Inscription
$("authForm").onsubmit = (event) => {
  event.preventDefault();

  const email = $("#email").val();
  const password = $("#password").val();

  if (password.length < 8) {
    $("msg").texte("Le mot de passe doit contenir au moins 8 caractères.");
    return;
  }

  let users = readUsers();

  let exists = users.some((user) => user.email === email);

  if (!exists && mode === "signup") {
    users.push({
      email: email,
      created: new Date().toLocaleString("fr-FR"),
      password: password
    });
    
    saveUsers(users);
    
    current = email;
    showMember();
    
    $("msg").texte("Inscription de démonstration réussie.");
  } else {
    $("msg").texte("Cette adresse possède déjà un compte.");
  }
};

// Affichage des comptes enregistrés
function renderUsers() {
  const users = readUsers();

  let container = $("#users");
  
  container.empty();
  
  if (users.length === 0) {
    const p = document.createElement("p");
    
    p.textContent = "Aucune inscription.";
    p.className = "muted";
    
    container.append(p);
  }
  
  users.forEach((user) => {
    const email = user.email;
    
    const entry = document.createElement("div");
    entry.classList.add("entry");
    
    const emailElement = document.createElement("b");
    emailElement.textContent = email;
    
    const passwordElement = document.createElement("p");
    passwordElement.textContent = `Mot de passe : ${user.password}`;
    
    entry.append(emailElement, passwordElement);
    
    container.append(entry);
  });
};

// Exporter les inscriptions
$("#export").on("click", () => {
  const users = readUsers();
  
  let safeUsers = users.map((user) => ({
      email: user.email,
      created: new Date(user.created).toLocaleString()
  }));
  
  const blob = new Blob(
    [JSON.stringify(safeUsers, null, 2)],
    { type : "application/json" }
  );
  
  const url = URL.createObjectURL(blob);
  
  let link = document.createElement("a");
  link.href = url;
  link.download = "inscriptions.json";

  link.click();

  // Révoquer le handle de l'objet blob pour nettoyer l'espace mémoire
  URL.revokeObjectURL(url);
});

// Afficher la liste des inscriptions
renderUsers();
