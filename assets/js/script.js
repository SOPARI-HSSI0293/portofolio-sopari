// Load and display apps
async function loadApps() {
    try {
        const response = await fetch('apps.json');
        const apps = await response.json();
        displayApps(apps);
        setupSearchAndFilter(apps);
    } catch (error) {
        console.error('Error loading apps:', error);
    }
}

function displayApps(apps) {
    const grid = document.getElementById('cardsGrid');
    const count = document.getElementById('appCount');
    
    grid.innerHTML = '';
    count.textContent = apps.length;
    
    apps.forEach((app, index) => {
        const card = createCard(app, index);
        grid.appendChild(card);
    });
}

function createCard(app, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${index * 0.05}s`;
    card.setAttribute('data-category', app.category);
    card.setAttribute('data-tags', app.tags.join(' '));
    
    card.innerHTML = `
        <span class="card-icon">${app.icon}</span>
        <span class="card-category">${app.category}</span>
        <h3 class="card-title">${app.name}</h3>
        <p class="card-description">${app.description}</p>
        <div class="card-tags">
            ${app.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
        </div>
        <div class="card-footer">
            <div class="card-status">
                <span class="status-dot ${app.status}"></span>
                ${app.status === 'active' ? 'Active' : 'Maintenance'}
            </div>
            <a href="${app.url}" target="_blank" rel="noopener noreferrer" class="card-link">
                Launch App →
            </a>
        </div>
    `;
    
    card.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
            window.open(app.url, '_blank');
        }
    });
    
    return card;
}

function setupSearchAndFilter(apps) {
    const searchInput = document.getElementById('searchInput');
    const filterTags = document.getElementById('filterTags');
    
    // Extract unique categories
    const categories = ['All', ...new Set(apps.map(app => app.category))];
    
    // Create filter buttons
    filterTags.innerHTML = categories.map(cat => 
        `<button class="filter-tag ${cat === 'All' ? 'active' : ''}" data-category="${cat}">${cat}</button>`
    ).join('');
    
    // Search functionality
    searchInput.addEventListener('input', filterApps);
    
    // Filter by category
    filterTags.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-tag')) {
            document.querySelectorAll('.filter-tag').forEach(btn => 
                btn.classList.remove('active')
            );
            e.target.classList.add('active');
            filterApps();
        }
    });
}

function filterApps() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const activeCategory = document.querySelector('.filter-tag.active').dataset.category;
    const cards = document.querySelectorAll('.card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const category = card.dataset.category;
        const tags = card.dataset.tags.toLowerCase();
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-description').textContent.toLowerCase();
        
        const matchesSearch = !searchTerm || 
            title.includes(searchTerm) || 
            description.includes(searchTerm) || 
            tags.includes(searchTerm);
        
        const matchesCategory = activeCategory === 'All' || category === activeCategory;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    document.getElementById('appCount').textContent = visibleCount;
    document.getElementById('noResults').style.display = 
        visibleCount === 0 ? 'block' : 'none';
}

// Load apps on page load
document.addEventListener('DOMContentLoaded', loadApps);
