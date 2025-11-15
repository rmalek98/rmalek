// ============================================
// Burger Menu Functionality
// ============================================
const burgerMenu = document.getElementById('burger-menu');
const navOverlay = document.getElementById('nav-overlay');
const navLinks = document.querySelectorAll('.nav-link');

if (burgerMenu && navOverlay) {
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    navOverlay.addEventListener('click', (e) => {
        if (e.target === navOverlay) {
            burgerMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// Typing Animation for Home Page
// ============================================
const typingText = document.getElementById('typing-text');
if (typingText) {
    const words = [
        'Software Developer',
        'Maker',
        'Designer',
        'Security Engineer',
        'Cook',
        'Software Engineer',
        'Full Stack Developer'
    ];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster when deleting
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            // Pause at end of word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Move to next word
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing animation
    type();
}

// ============================================
// Blog Filter Functionality
// ============================================
const filterButtons = document.querySelectorAll('.filter-btn');
const blogCards = document.querySelectorAll('.blog-card[data-category]');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            blogCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ============================================
// GitHub Projects Integration
// ============================================
async function fetchGitHubProjects() {
    const projectsContainer = document.getElementById('github-projects');
    const placeholderContainer = document.getElementById('placeholder-projects');
    
    if (!projectsContainer) return;
    
    // Replace with your GitHub username
    const githubUsername = 'rmalek98'; // Change this to your actual GitHub username
    
    try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch GitHub projects');
        }
        
        const repos = await response.json();
        
        if (repos.length === 0) {
            projectsContainer.innerHTML = '<div class="loading-message">No public repositories found.</div>';
            if (placeholderContainer) placeholderContainer.style.display = 'grid';
            return;
        }
        
        projectsContainer.innerHTML = '';
        
        // Fetch language data for each repo
        const reposWithLanguages = await Promise.all(
            repos.map(async (repo) => {
                try {
                    const langResponse = await fetch(repo.languages_url);
                    const languages = await langResponse.json();
                    return { ...repo, languages };
                } catch {
                    return { ...repo, languages: {} };
                }
            })
        );
        
        reposWithLanguages.forEach(repo => {
            const projectCard = createProjectCard(repo);
            projectsContainer.appendChild(projectCard);
        });
        
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        projectsContainer.innerHTML = '<div class="loading-message">Unable to load projects. Please check your GitHub username in script.js</div>';
        if (placeholderContainer) placeholderContainer.style.display = 'grid';
    }
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'github-project-card work-card';
    
    const languages = Object.keys(repo.languages || {}).slice(0, 4);
    const totalBytes = Object.values(repo.languages || {}).reduce((a, b) => a + b, 0);
    
    const languageItems = languages.map(lang => {
        const percentage = Math.round((repo.languages[lang] / totalBytes) * 100);
        return `<span>${lang}</span>`;
    }).join('');
    
    const description = repo.description || 'No description available.';
    const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    card.innerHTML = `
        <div class="github-project-header">
            <div>
                <h2 class="github-project-title">${repo.name}</h2>
            </div>
        </div>
        <p class="github-project-description">${description}</p>
        <div class="github-project-footer">
            <div class="github-project-stats">
                <div class="github-project-stat">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
                    </svg>
                    <span>${repo.stargazers_count}</span>
                </div>
                <div class="github-project-stat">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm3-8.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"/>
                    </svg>
                    <span>${repo.forks_count}</span>
                </div>
                <div class="github-project-stat">
                    <span>Updated ${updatedDate}</span>
                </div>
            </div>
            <div class="github-project-languages work-tech">
                ${languageItems}
            </div>
        </div>
        <a href="${repo.html_url}" target="_blank" class="github-project-link" style="margin-top: 1rem;">
            View on GitHub →
        </a>
    `;
    
    return card;
}

// Fetch GitHub projects when work page loads
if (document.getElementById('github-projects')) {
    fetchGitHubProjects();
}

// ============================================
// Form Submission
// ============================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        console.log('Form submitted:', formData);
        alert('Thank you for your message! I\'ll get back to you soon.');
        contactForm.reset();
    });
}

// ============================================
// Smooth Page Transitions
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
