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
    }, 500);
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
    // Здесь больше НЕТ navigator.clipboard
}

window.addEventListener('DOMContentLoaded', () => {
    const savedText = localStorage.getItem('constructor_text');
    if (savedText) textArea.value = savedText;

    const savedPage = localStorage.getItem('lastOpenedShabPage');
    if (savedPage) showShabPage(savedPage);
});

document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', () => {
        let textToAdd = button.getAttribute('data-text');
        
        // --- ЛОГИКА ЗАМЕНЫ ДАТЫ ---
        if (currentManualDate !== "") {
            // Ищем xx.xx.xxxx и заменяем на нашу дату
            textToAdd = textToAdd.replace(/xx\.xx\.xxxx/g, currentManualDate);
        }
        
        // 1. Добавляем уже обработанный текст в конструктор
        updateConstructor(textToAdd);
        
        // 2. Копируем в буфер только этот обработанный фрагмент
        navigator.clipboard.writeText(textToAdd).then(() => {
            // Твое уведомление :)
            showToast("Успешно"); 
        }).catch(err => {
            console.error("Ошибка копирования фрагмента: ", err);
        });
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
    const previewBox = document.getElementById('tab-preview'); // Контейнер для превью
    const STORAGE_KEY = 'layout_tabs_config';
    
    let previewTimer; // Таймер для задержки появления

    // 1. ФУНКЦИИ СОХРАНЕНИЯ И ЗАГРУЗКИ
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
            createTab('page1', 'Шаблоны RU', false);
            switchTab('page1');
            return;
        }

        try {
            const { tabs, activeTabId } = JSON.parse(savedData);
            tabsContainer.innerHTML = ''; 
            
            tabs.forEach(t => {
                createTab(t.id, t.title, t.isClosable);
            });

            if (activeTabId) switchTab(activeTabId);
        } catch (e) {
            console.error("Ошибка загрузки:", e);
            createTab('page1', 'Шаблоны RU', false);
        }
    }

    // 2. ИНИЦИАЛИЗАЦИЯ
    loadTabsState();

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
            saveTabsState();
        });
    });

    function createTab(pageId, title, isClosable) {
        const tab = document.createElement('div');
        tab.classList.add('tab', 'tab-new'); 
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

        // --- ЛОГИКА ПРЕВЬЮ (Яндекс-стайл) ---
        tab.addEventListener('mouseenter', () => {
            // Запускаем таймер на 2 секунды (или 1.5 для комфорта)
            previewTimer = setTimeout(() => {
                const targetPage = document.getElementById(pageId);
                // Показываем только если мы не тащим вкладку прямо сейчас
                if (targetPage && !tab.classList.contains('dragging')) {
                    const content = previewBox.querySelector('.preview-content');
                    content.innerHTML = '';
                    
                    // Клонируем страницу и делаем её видимой в контейнере
                    const clone = targetPage.cloneNode(true);
                    clone.style.display = 'block'; 
                    content.appendChild(clone);

                    // Позиционируем квадрат превью
                    const rect = tab.getBoundingClientRect();
                    previewBox.style.left = `${rect.left}px`;
                    previewBox.style.top = `${rect.bottom + 10}px`;
                    
                    previewBox.classList.add('visible');
                }
            }, 1000); 
        });

        tab.addEventListener('mouseleave', () => {
            clearTimeout(previewTimer);
            previewBox.classList.remove('visible');
        });
        // --- КОНЕЦ ЛОГИКИ ПРЕВЬЮ ---

        tabsContainer.appendChild(tab);

        setTimeout(() => {
            tab.classList.remove('tab-new');
        }, 250);

        // Логика перемещения
        let isDragging = false;
        let startX, startLeft, fixedTop, placeholder;

        tab.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || e.target.classList.contains('tab-close')) return;
            
            // Скрываем превью сразу при нажатии
            clearTimeout(previewTimer);
            previewBox.classList.remove('visible');

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
                    const rect = placeholder.getBoundingClientRect();
                    tab.style.transition = 'left 0.15s ease-out, top 0.15s ease-out';
                    tab.style.left = `${rect.left}px`;
                    tab.style.top = `${rect.top}px`;

                    setTimeout(() => {
                        tab.classList.remove('dragging');
                        tab.style.cssText = ''; 
                        tabsContainer.insertBefore(tab, placeholder);
                        placeholder.remove();
                        saveTabsState();
                    }, 150);
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
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));

        const activeTab = document.querySelector(`.tab[data-target="${pageId}"]`);
        if (activeTab) activeTab.classList.add('active');
        
        const activePage = document.getElementById(pageId);
        if (activePage) activePage.classList.add('active');
        
        const targetMenuBtn = document.querySelector(`.menu-btn[href="#${pageId}"]`) || document.querySelector(`.menu-btn[href="${pageId}"]`);
        if (targetMenuBtn) {
            targetMenuBtn.classList.add('active');
            localStorage.setItem('activePage', targetMenuBtn.getAttribute('href'));
        }
        
        saveTabsState(); 
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
            saveTabsState();
        }
    }

    closeAllBtn.addEventListener('click', () => {
        [...tabsContainer.querySelectorAll('.tab')].forEach(t => {
            if (t.dataset.target !== 'page1') t.remove();
        });
        switchTab('page1');
        saveTabsState();
    });
});


// Переменная для хранения даты (по умолчанию пустая)
let currentManualDate = "";

// Слушатель для кнопки "ОК" возле поля даты
document.addEventListener('DOMContentLoaded', () => {
    const setDateBtn = document.getElementById('set-date-btn');
    const dateInput = document.getElementById('manual-date');

    if (setDateBtn && dateInput) {
        // Устанавливаем текущую дату по умолчанию
        const today = new Date().toLocaleDateString('ru-RU');
        dateInput.value = today;
        currentManualDate = today;

        setDateBtn.addEventListener('click', () => {
            currentManualDate = dateInput.value.trim();
            showToast(currentManualDate ? "Дата установлена" : "Дата пустая");
        });
    }
});


document.getElementById('convert-to-data-text').addEventListener('click', () => {
    const rawText = textArea.value; // Берем текст из твоего конструктора
    
    if (!rawText) {
        showToast("Пусто!");
        return;
    }

    // Заменяем все обычные переносы строк на &#10;
    // А также заменяем двойные кавычки на &quot;, чтобы не сломать HTML-атрибут
    const escapedText = rawText
        .replace(/\n/g, '&#10;')
        .replace(/"/g, '&quot;');

    // Копируем результат в буфер обмена
    navigator.clipboard.writeText(escapedText).then(() => {
        showToast("Готово!");
        
        // Опционально: выводим результат в консоль, чтобы можно было скопировать оттуда
        console.log('Твой data-text:');
        console.log(`data-text="${escapedText}"`);
    });
});



const slotsWrapper = document.getElementById('slots-wrapper');
const addSlotBtn = document.getElementById('add-new-slot');
const STORAGE_SLOTS_KEY = 'user_custom_slots';

// 1. Загрузка слотов при старте
let userSlots = JSON.parse(localStorage.getItem(STORAGE_SLOTS_KEY)) || [];

function renderSlots() {
    slotsWrapper.innerHTML = '';
    userSlots.forEach((slot, index) => {
        const slotEl = document.createElement('div');
        slotEl.className = 'custom-slot';
        slotEl.innerHTML = `
            <span>${slot.name}</span>
            <button class="slot-delete" onclick="deleteSlot(${index}, event)">×</button>
        `;
        
        // Клик по кнопке — копируем текст
        slotEl.addEventListener('click', () => {
            if (slot.text) {
                updateConstructor(slot.text); // Добавляем в твой конструктор
                navigator.clipboard.writeText(slot.text);
                showToast(`Слот "${slot.name}" скопирован!`);
            } else {
                showToast("Слот пустой!");
            }
        });
        
        slotsWrapper.appendChild(slotEl);
    });

    // Ограничение на 10 кнопок
    addSlotBtn.style.display = userSlots.length >= 10 ? 'none' : 'block';
}

// 2. Добавление нового слота
addSlotBtn.addEventListener('click', () => {
    const name = prompt("Введите название кнопки:");
    if (!name) return;

    const text = prompt(`Вставьте текст шаблона для кнопки "${name}":`);
    if (text === null) return; // Если нажали "Отмена"

    userSlots.push({ name, text });
    saveAndRender();
});

// 3. Удаление слота
window.deleteSlot = function(index, event) {
    event.stopPropagation(); // Чтобы не сработал клик по самой кнопке
    if (confirm("Удалить этот слот?")) {
        userSlots.splice(index, 1);
        saveAndRender();
    }
};

function saveAndRender() {
    localStorage.setItem(STORAGE_SLOTS_KEY, JSON.stringify(userSlots));
    renderSlots();
}

// Инициализация
document.addEventListener('DOMContentLoaded', renderSlots);




function wrapText(symbol) {
    const area = document.getElementById('constructor-area'); // Твой textarea
    const start = area.selectionStart; // Начало выделения
    const end = area.selectionEnd;     // Конец выделения
    
    const fullText = area.value;
    const selectedText = fullText.substring(start, end);
    
    if (start === end) {
        // Если ничего не выделено, просто вставляем символы в место курсора
        const newText = fullText.substring(0, start) + symbol + symbol + fullText.substring(end);
        area.value = newText;
        // Ставим курсор между символами
        area.setSelectionRange(start + symbol.length, start + symbol.length);
    } else {
        // Оборачиваем выделенный кусок
        const newText = fullText.substring(0, start) + symbol + selectedText + symbol + fullText.substring(end);
        area.value = newText;
        // Возвращаем выделение на место, но уже с символами
        area.setSelectionRange(start, end + (symbol.length * 2));
    }
    
    area.focus(); // Возвращаем фокус на поле
}

async function fetchLastUpdate() {
    const dateElement = document.getElementById('update-date');
    
    // Автоматически берем ник и репо из текущего URL страницы
    const pathParts = window.location.pathname.split('/');
    const repo = pathParts[1] || 'название-репозитория'; 
    const username = 'levsicvlad155-sys';

    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/commits?per_page=1`);
        
        if (!response.ok) throw new Error('Ошибка API');

        const data = await response.json();
        if (data && data.length > 0) {
            const commitDate = new Date(data[0].commit.committer.date);
            const formattedDate = commitDate.toLocaleDateString('ru-RU', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            });
            dateElement.textContent = `Обновлено: ${formattedDate}`;
        }
    } catch (error) {
        // Если API не сработало, используем системную дату файла
        const lastMod = new Date(document.lastModified);
        if (lastMod) {
            dateElement.textContent = `Обновлено: ${lastMod.toLocaleDateString('ru-RU')}`;
        } else {
            dateElement.style.display = 'none';
        }
    }
}
document.addEventListener('DOMContentLoaded', fetchLastUpdate);









let previewTimer;
const previewBox = document.getElementById('tab-preview');

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('mouseenter', (e) => {
        const targetId = tab.dataset.target;
        const targetPage = document.getElementById(targetId);

        previewTimer = setTimeout(() => {
            if (targetPage) {
                // Клонируем содержимое страницы для превью
                const clone = targetPage.cloneNode(true);
                clone.classList.add('is-preview'); // Чтобы стилизовать внутри квадрата
                
                const content = previewBox.querySelector('.preview-content');
                content.innerHTML = '';
                content.appendChild(clone);

                // Позиционируем квадрат над вкладкой
                const rect = tab.getBoundingClientRect();
                previewBox.style.left = `${rect.left}px`;
                previewBox.style.top = `${rect.bottom + 10}px`; // Или сверху: rect.top - 160
                
                previewBox.classList.add('visible');
            }
        }, 1500); // 1.5 секунды (в Яндексе примерно так)
    });

    tab.addEventListener('mouseleave', () => {
        clearTimeout(previewTimer);
        previewBox.classList.remove('visible');
    });
});


