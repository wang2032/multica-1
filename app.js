const menuGrid = document.getElementById('menuGrid');
const categoryButtons = document.querySelectorAll('.category-btn');

function renderMenuItems(items) {
    menuGrid.innerHTML = items.map(item => `
        <article class="menu-item">
            <img src="${item.image}" alt="${item.name}" class="menu-item-image">
            <div class="menu-item-content">
                <span class="menu-item-category">${item.categoryName}</span>
                <h3 class="menu-item-title">${item.name}</h3>
                <div class="menu-item-price">${item.price}</div>
            </div>
        </article>
    `).join('');
}

function filterByCategory(category) {
    if (category === 'all') {
        return menuData;
    }
    return menuData.filter(item => item.category === category);
}

function handleCategoryClick(event) {
    const button = event.target;
    const category = button.dataset.category;

    categoryButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filteredItems = filterByCategory(category);
    renderMenuItems(filteredItems);
}

categoryButtons.forEach(button => {
    button.addEventListener('click', handleCategoryClick);
});

renderMenuItems(menuData);