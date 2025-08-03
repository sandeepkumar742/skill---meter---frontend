 let skills = JSON.parse(localStorage.getItem("skills")) || [];

const skillInput = document.getElementById("skillInput");
const skillChips = document.getElementById("skillChips");
const analyzeBtn = document.getElementById("analyzeBtn");
const suggestionsDiv = document.getElementById("suggestions");

// Add skill on Enter
skillInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter" && skillInput.value.trim() !== "") {
    addSkill(skillInput.value.trim());
    skillInput.value = "";
  }
});

function addSkill(skill) {
  if (!skills.includes(skill.toLowerCase())) {
    skills.push(skill.toLowerCase());
    updateChips();
    localStorage.setItem("skills", JSON.stringify(skills));
  }
}

function removeSkill(skill) {
  skills = skills.filter(s => s !== skill.toLowerCase());
  updateChips();
  localStorage.setItem("skills", JSON.stringify(skills));
}

function updateChips() {
  skillChips.innerHTML = "";
  skills.forEach(skill => {
    const chip = document.createElement("div");
    chip.className = "skill-chip";

    const span = document.createElement("span");
    span.textContent = "✖";
    span.style.cursor = "pointer";
    span.addEventListener("click", () => removeSkill(skill));

    chip.textContent = skill + " ";
    chip.appendChild(span);

    skillChips.appendChild(chip);
  });
}

analyzeBtn.addEventListener("click", function () {
  suggestionsDiv.innerHTML = "";

  if (skills.length === 0) {
    suggestionsDiv.innerHTML = "<p>Please enter some skills first!</p>";
    return;
  }

  const domainSuggestions = {
    web: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    data: ["Python", "Pandas", "Numpy", "SQL", "Excel"],
    android: ["Java", "Kotlin", "Android Studio"],
    cloud: ["AWS", "Azure", "GCP"],
    ai: ["Python", "TensorFlow", "OpenCV", "Machine Learning"],
    security: ["Cybersecurity", "Linux", "Networking"],
  };

  const matchedDomains = [];

  for (let domain in domainSuggestions) {
    let score = domainSuggestions[domain].filter(skill =>
      skills.includes(skill.toLowerCase())
    ).length;

    if (score > 0) {
      matchedDomains.push({
        domain,
        score,
      });
    }
  }

  matchedDomains.sort((a, b) => b.score - a.score);

  matchedDomains.forEach(match => {
    const card = document.createElement("div");
    card.className = "suggestion-card";
    card.innerHTML = `<h3>${match.domain.toUpperCase()}</h3>
    <p>Match Score: ${match.score}</p>
    <p>💡 You can explore internships in <b>${match.domain}</b> development.</p>`;
    suggestionsDiv.appendChild(card);
  });

  if (matchedDomains.length === 0) {
    suggestionsDiv.innerHTML = "<p>No matching domain found! Try adding more skills.</p>";
  }
});

// Dark mode toggle
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Load saved chips on load
window.onload = () => updateChips();