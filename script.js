const sideButtons = document.querySelectorAll('.side-btn');
const panes = document.querySelectorAll('.menu');
const menuButtons = document.querySelectorAll('.menu-btn');
const pages = document.querySelectorAll('.page');

function activateElement(selector, list, contentList) {
    const savedId = localStorage.getItem(selector);
    if (savedId) {
        const targetBtn = document.querySelector(`[href="${savedId}"]`);
        const targetContent = document.querySelector(savedId);

        if (targetBtn && targetContent) {
            list.forEach(b => b.classList.remove('active'));
            contentList.forEach(c => c.classList.remove('active'));
            
            targetBtn.classList.add('active');
            targetContent.classList.add('active');
            return true;
        }
    }
    return false;
}

sideButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (btn.classList.contains('active')) return;

        sideButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        panes.forEach(pane => pane.classList.remove('active'));

        const targetId = btn.getAttribute('href');
        localStorage.setItem('activeMenu', targetId);

        setTimeout(() => {
            const targetPane = document.querySelector(targetId);
            if (targetPane) targetPane.classList.add('active');
        }, 150);
    });
});

menuButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        menuButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        pages.forEach(p => p.classList.remove('active'));

        const targetId = btn.getAttribute('href');
        localStorage.setItem('activePage', targetId);

        const targetPage = document.querySelector(targetId);
        if (targetPage) targetPage.classList.add('active');
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const menuRestored = activateElement('activeMenu', sideButtons, panes);
    const pageRestored = activateElement('activePage', menuButtons, pages);

    if (!menuRestored && sideButtons[0]) {
        sideButtons[0].click();
    }
    if (!pageRestored && menuButtons[0]) {
        menuButtons[0].click();
    }
});

const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('sidemenu');
const sidebar = document.getElementById('sidebar');
const arrow = menuToggle.querySelector('.arrow');


let isManuallyCollapsed = sideMenu.classList.contains('collapsed');

function updateArrow() {
    arrow.innerText = sideMenu.classList.contains('collapsed') ? "›" : "‹";
}


menuToggle.addEventListener('click', () => {
    sideMenu.classList.toggle('collapsed');

    isManuallyCollapsed = sideMenu.classList.contains('collapsed');
    updateArrow();
});


function checkZoom() {

    if (window.innerWidth <= 1000) {
        sidebar.classList.add('zoom-hidden');
        menuToggle.classList.add('zoom-hidden');
        sideMenu.classList.add('collapsed'); 
    } else {
        sidebar.classList.remove('zoom-hidden');
        menuToggle.classList.remove('zoom-hidden');

        if (!isManuallyCollapsed) {
            sideMenu.classList.remove('collapsed');
        }
    }
    updateArrow();
}

window.addEventListener('DOMContentLoaded', () => {
    sideMenu.classList.remove('collapsed');
    checkZoom(); 
});

window.addEventListener('resize', checkZoom);




async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);

        setTimeout(() => {
            button.innerText = originalText;
            button.style.backgroundColor = "";
        }, 1000);
    } catch (err) {
        console.error("Ошибка при копировании: ", err);
    }
}


document.querySelectorAll('.card-grid').forEach(card => {
    const textElement = card.querySelector('.shab-text');
    const copyBtn = card.querySelector('.c-btn');
    const indentBtn = card.querySelector('.o-btn');


    copyBtn.addEventListener('click', () => {

        const text = textElement.innerText;
        copyToClipboard(text, copyBtn);

        showToast("Текст скопирован!");
    });


    indentBtn.addEventListener('click', () => {
        const specialChar = "ㅤ";
        const textWithIndent = `${specialChar}\n${specialChar}\n${textElement.innerText}`;
        copyToClipboard(textWithIndent, indentBtn);

        showToast("Текст скопирован!");
    });
});


function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    toast.className = 'toast';
    toast.innerText = message;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 1500);
}


function showShabPage(pageId) {
    const allPages = document.querySelectorAll('.shab-page');
    allPages.forEach(page => {
        page.classList.remove('active-page');
        page.style.display = 'none';
    });

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active-page');
        targetPage.style.display = 'flex';
        localStorage.setItem('lastOpenedShabPage', pageId);
    }

    const allCatBtns = document.querySelectorAll('.cat-btn');
    allCatBtns.forEach(btn => {
        btn.classList.remove('active-cat');
        if (btn.getAttribute('onclick').includes(pageId)) {
            btn.classList.add('active-cat');
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const savedPage = localStorage.getItem('lastOpenedShabPage');

    if (savedPage && document.getElementById(savedPage)) {
        showShabPage(savedPage);
    } else {
        showShabPage('card-page1');
    }
});


const textArea = document.getElementById('constructor-area');
const copyBtn = document.getElementById('copy-cons');
const clearBtn = document.getElementById('clear-cons');
const indentBtn = document.getElementById('indent-cons');

function updateConstructor(text, isNewBlock = true) {
    if (isNewBlock && textArea.value.length > 0) {
        textArea.value += "\n" + text;
    } else {
        textArea.value += text;
    }
    
    localStorage.setItem('constructor_text', textArea.value);
    
    textArea.scrollTop = textArea.scrollHeight;

    showToast("copy");

    navigator.clipboard.writeText(textArea.value).then(() => {
        console.log("Текст обновлен и скопирован");
    }).catch(err => {
        console.error("Ошибка автокопирования: ", err);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const savedText = localStorage.getItem('constructor_text');
    if (savedText) textArea.value = savedText;

    const savedPage = localStorage.getItem('lastOpenedShabPage');
    if (savedPage) showShabPage(savedPage);
});

document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', () => {
        const textToAdd = button.getAttribute('data-text');
        updateConstructor(textToAdd);
    });
});

indentBtn.addEventListener('click', () => {
    const specialChar = "ㅤ";
    updateConstructor(specialChar);
});

copyBtn.addEventListener('click', () => {
    if (!textArea.value) return showToast("Поле пустое!");
    
    navigator.clipboard.writeText(textArea.value);
    showToast("Скопировано!");
});

clearBtn.addEventListener('click', () => {
    textArea.value = "";
    localStorage.removeItem('constructor_text');
    showToast("Очищено");
});

textArea.addEventListener('input', () => {
    localStorage.setItem('constructor_text', textArea.value);
});



document.addEventListener('click', (event) => {
    const isCard = event.target.closest('.style-textarea');

    if (isCard) {
        document.querySelectorAll('.style-textarea').forEach(c => c.classList.remove('highlight'));
        isCard.classList.add('highlight');
    } else {
        document.querySelectorAll('.style-textarea').forEach(c => c.classList.remove('highlight'));
    }
});



// --- БЛОК ПОИСКА И ОЧИСТКИ ---
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');

if (searchInput) {
    // Функция самой фильтрации
    const filterCards = () => {
        const query = searchInput.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.card-grid');
        
        // Показываем/скрываем кнопку очистки
        if (clearSearchBtn) {
            clearSearchBtn.style.display = query.length > 0 ? 'block' : 'none';
        }

        cards.forEach(card => {
            // Если в поиске меньше 3 символов — показываем всё
            if (query.length < 3) {
                card.style.display = 'flex';
                return;
            }

            const name = card.querySelector('.shab-name').innerText.toLowerCase();
            const text = card.querySelector('.shab-text').innerText.toLowerCase();

            if (name.includes(query) || text.includes(query)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // Слушаем ввод текста
    searchInput.addEventListener('input', filterCards);

    // Логика кнопки очистки
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            filterCards(); // Сбросит видимость всех карточек
            searchInput.focus();
        });
    }
}




document.addEventListener('DOMContentLoaded', () => {
    const tabsContainer = document.getElementById('tabs-container');
    const closeAllBtn = document.getElementById('close-all-tabs');
    const menuButtons = document.querySelectorAll('.menu-btn');
    const pages = document.querySelectorAll('.page');
    const STORAGE_KEY = 'layout_tabs_config';

    // 1. ФУНКЦИИ СОХРАНЕНИЯ И ЗАГРУЗКИ (теперь внутри, чтобы видеть переменные)
    function saveTabsState() {
        const tabs = [...tabsContainer.querySelectorAll('.tab')].map(tab => ({
            id: tab.dataset.target,
            title: tab.querySelector('span').textContent,
            isClosable: !!tab.querySelector('.tab-close')
        }));

        const activeTab = document.querySelector('.tab.active');
        const activeTabId = activeTab ? activeTab.dataset.target : null;

        const state = { tabs, activeTabId };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function loadTabsState() {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (!savedData) {
            // Если памяти нет — инициализируем дефолтную вкладку
            createTab('page1', 'Шаблоны RU', false);
            switchTab('page1');
            return;
        }

        try {
            const { tabs, activeTabId } = JSON.parse(savedData);
            tabsContainer.innerHTML = ''; // Очистка
            
            tabs.forEach(t => {
                createTab(t.id, t.title, t.isClosable);
            });

            if (activeTabId) switchTab(activeTabId);
        } catch (e) {
            console.error("Ошибка загрузки:", e);
            createTab('page1', 'Шаблоны RU', false);
        }
    }

    // 2. ИНИЦИАЛИЗАЦИЯ (Загружаем сохраненное вместо жесткого кода)
    loadTabsState();

    // Перехватываем клики по меню в сайдбаре
    menuButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = btn.getAttribute('href').replace('#', '');
            const title = btn.querySelector('.textt1').textContent;

            const existingTabs = [...tabsContainer.querySelectorAll('.tab')].map(t => t.dataset.target);
            
            if (!existingTabs.includes(pageId)) {
                createTab(pageId, title, true);
            }
            switchTab(pageId);
            saveTabsState(); // Сохраняем после добавления
        });
    });

    function createTab(pageId, title, isClosable) {
        const tab = document.createElement('div');
        tab.classList.add('tab');
        tab.dataset.target = pageId;

        const span = document.createElement('span');
        span.textContent = title;
        tab.appendChild(span);

        if (isClosable) {
            const closeBtn = document.createElement('button');
            closeBtn.classList.add('tab-close');
            closeBtn.innerHTML = '×';
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                closeTab(pageId);
            });
            tab.appendChild(closeBtn);
        }

        tabsContainer.appendChild(tab);

        // Логика перемещения
        let isDragging = false;
        let startX, startLeft, fixedTop, placeholder;

        tab.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || e.target.classList.contains('tab-close')) return;
            isDragging = false;
            startX = e.clientX;

            const onMouseMove = (moveEvent) => {
                if (!isDragging && Math.abs(moveEvent.clientX - startX) > 3) {
                    isDragging = true;
                    const rect = tab.getBoundingClientRect();
                    startLeft = rect.left;
                    fixedTop = rect.top;

                    placeholder = document.createElement('div');
                    placeholder.classList.add('tab-placeholder');
                    placeholder.style.width = `${rect.width}px`;
                    placeholder.style.height = `${rect.height}px`;
                    tabsContainer.insertBefore(placeholder, tab.nextSibling);

                    tab.classList.add('dragging');
                    tab.style.position = 'fixed';
                    tab.style.top = `${fixedTop}px`;
                    tab.style.width = `${rect.width}px`;
                }

                if (isDragging) {
                    let newLeft = startLeft + (moveEvent.clientX - startX);
                    const containerRect = tabsContainer.getBoundingClientRect();
                    newLeft = Math.max(containerRect.left, Math.min(newLeft, containerRect.right - tab.offsetWidth));
                    tab.style.left = `${newLeft}px`;

                    const siblings = [...tabsContainer.querySelectorAll('.tab:not(.dragging)')];
                    const nextSibling = siblings.find(sibling => {
                        const box = sibling.getBoundingClientRect();
                        return moveEvent.clientX < box.left + box.width / 2;
                    });

                    if (nextSibling) tabsContainer.insertBefore(placeholder, nextSibling);
                    else tabsContainer.appendChild(placeholder);
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                if (isDragging) {
                    tab.classList.remove('dragging');
                    tab.style.cssText = ''; 
                    tabsContainer.insertBefore(tab, placeholder);
                    placeholder.remove();
                    saveTabsState(); // СОХРАНЯЕМ ПОРЯДОК после перетаскивания
                } else {
                    switchTab(pageId);
                }
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    function switchTab(pageId) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));

        const activeTab = document.querySelector(`.tab[data-target="${pageId}"]`);
        if (activeTab) activeTab.classList.add('active');
        
        const activePage = document.getElementById(pageId);
        if (activePage) activePage.classList.add('active');
        
        saveTabsState(); // Сохраняем, какая вкладка активна
    }

    function closeTab(pageId) {
        if (pageId === 'page1') return;
        const tabToRemove = document.querySelector(`.tab[data-target="${pageId}"]`);
        if (tabToRemove) {
            if (tabToRemove.classList.contains('active')) {
                const remainingTabs = [...tabsContainer.querySelectorAll('.tab')];
                const index = remainingTabs.indexOf(tabToRemove);
                const nextTab = remainingTabs[index - 1] || remainingTabs[index + 1];
                switchTab(nextTab ? nextTab.dataset.target : 'page1');
            }
            tabToRemove.remove();
            saveTabsState(); // Сохраняем после закрытия
        }
    }

    closeAllBtn.addEventListener('click', () => {
        [...tabsContainer.querySelectorAll('.tab')].forEach(t => {
            if (t.dataset.target !== 'page1') t.remove();
        });
        switchTab('page1');
        saveTabsState(); // Сохраняем после очистки всех вкладок
    });
});






