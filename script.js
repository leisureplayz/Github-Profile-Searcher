const searchBtn = document.getElementById("search-btn");
const usernameInput = document.getElementById("username");
const userContainer = document.getElementById("user-container");
const errorContainer = document.getElementById("error-container");
const reposContainer = document.getElementById("repos-container");

// Profile elements
const avatar = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const userLogin = document.getElementById("user-login");
const bio = document.getElementById("bio");
const locationEl = document.getElementById("location");
const joined = document.getElementById("joined");
const profileLink = document.getElementById("profile-link");
const followers = document.getElementById("followers");
const following = document.getElementById("following");
const reposCount = document.getElementById("repos-count");
const company = document.getElementById("company");
const blog = document.getElementById("blog");
const twitter = document.getElementById("twitter");

searchBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (username) fetchGitHubUser(username);
});

async function fetchGitHubUser(username) {
  userContainer.classList.add("hidden");
  errorContainer.classList.add("hidden");
  reposContainer.innerHTML = '<div class="loading-repos">Loading repositories...</div>';

  try {
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (userResponse.status === 200) {
      const data = await userResponse.json();

      avatar.src = data.avatar_url;
      nameEl.textContent = data.name || data.login;
      userLogin.textContent = `@${data.login}`;
      bio.textContent = data.bio || "No bio available";
      locationEl.textContent = data.location || "Not specified";
      joined.textContent = new Date(data.created_at).toLocaleDateString();
      profileLink.href = data.html_url;
      followers.textContent = data.followers;
      following.textContent = data.following;
      reposCount.textContent = data.public_repos;
      company.textContent = data.company || "Not specified";
      blog.textContent = data.blog || "No website";
      blog.href = data.blog || "#";
      twitter.textContent = data.twitter_username || "No Twitter";
      twitter.href = data.twitter_username ? `https://twitter.com/${data.twitter_username}` : "#";

      userContainer.classList.remove("hidden");

      // Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`);
      const reposData = await reposResponse.json();

      reposContainer.innerHTML = "";
      if (reposData.length > 0) {
        reposData.forEach((repo, index) => {
          const card = document.createElement("div");
          card.className = "repo-card";
          card.style.animation = `fadeInUp 0.5s forwards`;
          card.style.animationDelay = `${index * 0.05}s`;
          card.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <p>${repo.description || "No description"}</p>
            <p>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</p>
          `;
          reposContainer.appendChild(card);
        });
      } else {
        reposContainer.innerHTML = '<div class="loading-repos">No public repositories found.</div>';
      }

    } else {
      errorContainer.classList.remove("hidden");
    }
  } catch (err) {
    console.error(err);
    errorContainer.classList.remove("hidden");
  }
}
