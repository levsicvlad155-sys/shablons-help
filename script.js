const root = document.body;
let savedCustomTemplates = JSON.parse(localStorage.getItem('customTemplates')) || [];
let allTemplates = [...templates, ...savedCustomTemplates];

if (localStorage.getItem('theme') === 'light') {
    root.classList.add('light-theme');
}

const navbar = document.createElement('nav');
navbar.classList.add('navbar');

const main = document.createElement('main');
main.classList.add('main-content');

root.appendChild(navbar);
root.appendChild(main);

function renderNavbar() {
    const activePage = localStorage.getItem('activePage') || btns[0].page;
    btns.forEach(data => {
        const btn = document.createElement('button');
        btn.textContent = data.text;
        btn.classList.add('btn', 'nav-btn');
        if (data.page === activePage) btn.classList.add('active');
        
        btn.onclick = () => {
            if (btn.classList.contains('active')) return;
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            localStorage.setItem('activePage', data.page);
            renderPage(data.page);
        };
        navbar.appendChild(btn);
    });
    renderPage(activePage);
}

function renderPage(page) {
    main.innerHTML = '';
    if (page === 'templates') renderTemplates();
    else if (page === 'constructor') renderConstructor();
    else if (page === 'settings') renderSettings();
}

function showAddModal(renderCallback) {
    const modal = document.createElement('div');
    modal.classList.add('modal-overlay');
    
    const content = document.createElement('div');
    content.classList.add('modal-content');
    
    const titleInput = document.createElement('input');
    titleInput.classList.add('modal-input', 'modal-title-input');
    titleInput.placeholder = 'Заголовок шаблона';
    
    const textInput = document.createElement('textarea');
    textInput.classList.add('modal-textarea');
    textInput.placeholder = 'Текст шаблона';
    
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('modal-actions');
    
    const saveBtn = document.createElement('button');
    saveBtn.classList.add('btn', 'modal-save-btn');
    saveBtn.textContent = 'Сохранить';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('btn', 'modal-cancel-btn');
    cancelBtn.textContent = 'Отмена';

    saveBtn.onclick = () => {
        if (titleInput.value.trim() && textInput.value.trim()) {
            const newTpl = {
                category: localStorage.getItem('activeFilter') || 'general',
                id: Date.now(),
                title: titleInput.value.trim(),
                text: textInput.value.trim()
            };
            savedCustomTemplates.push(newTpl);
            localStorage.setItem('customTemplates', JSON.stringify(savedCustomTemplates));
            allTemplates = [...templates, ...savedCustomTemplates];
            modal.remove();
            renderCallback();
        }
    };
    
    cancelBtn.onclick = () => modal.remove();
    
    actionsDiv.append(saveBtn, cancelBtn);
    content.append(titleInput, textInput, actionsDiv);
    modal.append(content);
    root.append(modal);
}

function renderTemplates() {
    const container = document.createElement('div');
    container.classList.add('page-container', 'templates-page');

    const filtersDiv = document.createElement('div');
    filtersDiv.classList.add('filters-container');
    
    let activeFilter = localStorage.getItem('activeFilter') || filters[0].category;

    const renderCards = () => {
        let oldCards = container.querySelector('.templates-container');
        if (oldCards) oldCards.remove();
        
        const cardsDiv = document.createElement('div');
        cardsDiv.classList.add('templates-container');
        container.appendChild(cardsDiv);

        if (localStorage.getItem('gridLayout') === 'true') {
    cardsDiv.classList.add('grid-view');
}

        const filtered = allTemplates.filter(t => t.category === activeFilter);
        filtered.forEach((tpl, i) => {
            const card = document.createElement('div');
            card.classList.add('template-card');
            
            card.onclick = (event) => {
                if (event.target.closest('.card-actions-wrapper')) {
                    return;
                }
                navigator.clipboard.writeText(tpl.text);
            };
            
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('card-content-wrapper');
            
            const title = document.createElement('h3');
            title.classList.add('card-title');
            title.textContent = tpl.title;
            
            const text = document.createElement('p');
            text.classList.add('card-text');
            text.textContent = tpl.text;
            
            contentDiv.append(title, text);

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('card-actions-wrapper');
            
            const copyBtn = document.createElement('button');
            copyBtn.classList.add('btn', 'card-copy-btn');
            copyBtn.textContent = 'Копировать';
            copyBtn.onclick = () => navigator.clipboard.writeText(tpl.text);
            
            const copySpaceBtn = document.createElement('button');
            copySpaceBtn.classList.add('btn', 'card-copy-space-btn');
            copySpaceBtn.textContent = 'Отступ';
            copySpaceBtn.onclick = () => navigator.clipboard.writeText('\u2800\n\u2800\n' + tpl.text);
            
            actionsDiv.append(copyBtn, copySpaceBtn);
            card.append(contentDiv, actionsDiv);
            
            setTimeout(() => {
                cardsDiv.appendChild(card);
            }, i * 30);
        });
    };

    filters.forEach(f => {
        const btn = document.createElement('button');
        btn.classList.add('btn', 'filter-btn');
        if (f.category === activeFilter) btn.classList.add('active');
        btn.textContent = f.text;
        
        btn.onclick = () => {
            if (btn.classList.contains('active')) return;
            filtersDiv.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = f.category;
            localStorage.setItem('activeFilter', activeFilter);
            renderCards();
        };
        filtersDiv.appendChild(btn);
    });

    const addBtn = document.createElement('button');
    addBtn.classList.add('btn', 'add-template-btn');
    addBtn.textContent = 'Добавить';
    addBtn.onclick = () => showAddModal(renderCards);
    filtersDiv.appendChild(addBtn);

    container.appendChild(filtersDiv);
    main.appendChild(container);
    renderCards();
}

function renderConstructor() {
    const container = document.createElement('div');
    container.classList.add('page-container', 'constructor-page');

    const textarea = document.createElement('textarea');
    textarea.classList.add('constructor-textarea');
    textarea.value = localStorage.getItem('constructorText') || '';
    textarea.addEventListener('input', () => {
        localStorage.setItem('constructorText', textarea.value);
    });

    const snippetsDiv = document.createElement('div');
    snippetsDiv.classList.add('snippets-container');
    
    constructorSnippets.forEach(s => {
        const btn = document.createElement('button');
        btn.classList.add('btn', 'snippet-btn');
        btn.textContent = s.label;
        btn.onclick = () => {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0, start) + s.text + textarea.value.substring(end);
            localStorage.setItem('constructorText', textarea.value);
            navigator.clipboard.writeText(s.text);
            textarea.focus();
            textarea.selectionEnd = start + s.text.length;
        };
        snippetsDiv.appendChild(btn);
    });

    const controlsDiv = document.createElement('div');
    controlsDiv.classList.add('controls-container');

    const copyTextBtn = document.createElement('button');
    copyTextBtn.classList.add('btn', 'control-btn', 'copy-full-btn');
    copyTextBtn.textContent = 'Копировать';
    copyTextBtn.onclick = () => navigator.clipboard.writeText(textarea.value);

    const indentBtn = document.createElement('button');
    indentBtn.classList.add('btn', 'control-btn', 'indent-btn');
    indentBtn.textContent = 'Отступ';
    indentBtn.onclick = () => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const char = '\u2800\n';
        textarea.value = textarea.value.substring(0, start) + char + textarea.value.substring(end);
        localStorage.setItem('constructorText', textarea.value);
        textarea.focus();
        textarea.selectionEnd = start + char.length;
    };

    const clearBtn = document.createElement('button');
    clearBtn.classList.add('btn', 'control-btn', 'clear-textarea-btn');
    clearBtn.textContent = 'Очистить';
    clearBtn.onclick = () => {
        textarea.value = '';
        localStorage.setItem('constructorText', '');
    };

    controlsDiv.append(copyTextBtn, indentBtn, clearBtn);
    container.append(textarea, snippetsDiv, controlsDiv);
    main.appendChild(container);
}

function renderSettings() {
    const container = document.createElement('div');
    container.classList.add('page-container', 'settings-page');

    const themeCard = document.createElement('div');
    themeCard.classList.add('settings-card', 'theme-card');
    
    const themeTitle = document.createElement('h3');
    themeTitle.classList.add('settings-card-title');
    themeTitle.textContent = 'Светлая тема';
    
    const themeToggle = document.createElement('div');
    themeToggle.classList.add('theme-toggle-circle');
    const isLight = root.classList.contains('light-theme');
    if (isLight) themeToggle.classList.add('active');
    
    themeToggle.onclick = () => {
        root.classList.toggle('light-theme');
        const isActive = root.classList.contains('light-theme');
        themeToggle.classList.toggle('active', isActive);
        localStorage.setItem('theme', isActive ? 'light' : 'dark');
    };
    
    themeCard.append(themeTitle, themeToggle);

    const layoutCard = document.createElement('div');
layoutCard.classList.add('settings-card', 'layout-card');

const layoutTitle = document.createElement('h3');
layoutTitle.classList.add('settings-card-title');
layoutTitle.textContent = 'Отображение сеткой (Grid)';

const layoutToggle = document.createElement('div');
layoutToggle.classList.add('theme-toggle-circle');

// Читаем настройку из localStorage
if (localStorage.getItem('gridLayout') === 'true') {
    layoutToggle.classList.add('active');
}

layoutToggle.onclick = () => {
    layoutToggle.classList.toggle('active');
    const isActive = layoutToggle.classList.contains('active');
    localStorage.setItem('gridLayout', isActive ? 'true' : 'false');
};

layoutCard.append(layoutTitle, layoutToggle);

    const clearCard = document.createElement('div');
    clearCard.classList.add('settings-card', 'clear-card');
    
    const clearTitle = document.createElement('h3');
    clearTitle.classList.add('settings-card-title');
    clearTitle.textContent = 'Очистить добавленные шаблоны';
    
    const clearBtn = document.createElement('button');
    clearBtn.classList.add('btn', 'clear-all-btn');
    clearBtn.textContent = 'Очистить все';
    clearBtn.onclick = () => {
        localStorage.removeItem('customTemplates');
        savedCustomTemplates = [];
        allTemplates = [...templates];
    };
    
    clearCard.append(clearTitle, clearBtn);
    container.append(themeCard, clearCard, layoutCard);
    main.appendChild(container);
}

renderNavbar();









    
