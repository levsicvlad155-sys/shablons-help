function showMenu(menuId, btn) {
    // 1. Находим текущее активное меню
    const currentActive = document.querySelector('.menu1.active');
    const targetMenu = document.getElementById(menuId);

    if (currentActive === targetMenu) return;

    // 2. Плавное исчезновение
    if (currentActive) {
        currentActive.style.opacity = '0';
    }

    setTimeout(() => {
        // 3. Убираем класс active у всех
        document.querySelectorAll('.menu1').forEach(menu => {
            menu.classList.remove('active');
        });

        // 4. Включаем нужное меню
        if (targetMenu) {
            targetMenu.classList.add('active');
            // Маленькая задержка для запуска анимации opacity
            setTimeout(() => { targetMenu.style.opacity = '1'; }, 10);
            
            // Сохраняем в память
            localStorage.setItem('lastMenu', menuId);
        }
    }, 150);

    // Подсветка кнопок в лефтбаре
    document.querySelectorAll('.leftbar button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// Инициализация при загрузке
window.onload = function() {
    const last = localStorage.getItem('lastMenu') || 'menu1';
    const btn = document.querySelector(`button[onclick*="${last}"]`);
    if (btn) showMenu(last, btn);
};



function showPage(pageId) {
    // Приводим ID к нижнему регистру (чтобы Page1 находило page1)
    const targetId = pageId.toLowerCase();
    const currentPage = document.querySelector('main section.active');
    const targetPage = document.getElementById(targetId);

    // Если страница уже активна, ничего не делаем
    if (currentPage === targetPage) return;

    // 1. Плавное исчезновение текущей страницы
    if (currentPage) {
        currentPage.style.opacity = '0';
    }


const pageTitles = {
    'page1': 'Шаблоны RU',
    'page2': 'Шаблоны EN',
    'page3': 'Редактор',
    'page4': 'Предупреждения RU',
    'page5': 'Предупреждения EN',
    'page6': 'Проверки RU',
    'page7': 'Проверки EN'
};

    // Задержка 150мс (соответствует твоему transition в CSS)
    setTimeout(() => {
        // 2. Убираем класс active у всех секций в main
        document.querySelectorAll('main section').forEach(pg => {
            pg.classList.remove('active');
            pg.style.display = 'none'; // Полностью убираем из потока
        });

        // 3. Активируем нужную страницу
        if (targetPage) {
            targetPage.style.display = 'flex'; // Возвращаем display
            targetPage.classList.add('active');

            document.title = pageTitles[targetId] || 'мой проект';
            // Маленький хак для запуска анимации opacity после display: flex
            setTimeout(() => { 
                targetPage.style.opacity = '1'; 
            }, 10);

            // Сохраняем последнюю открытую страницу
            localStorage.setItem('lastPage', targetId);
        }
    }, 150);
}

// Дополнение к твоему window.onload
const originalOnload = window.onload;
window.onload = function() {
    // Вызываем твой старый onload (для меню)
    if (typeof originalOnload === 'function') originalOnload();

    // Восстанавливаем последнюю страницу
    const lastPage = localStorage.getItem('lastPage') || 'page1';
    showPage(lastPage);
};


function copyAndAnimate(btn) {
    // 1. Поиск текста в том же родительском блоке
    const parent = btn.closest('.shab-grid'); 
    const textToCopy = parent.querySelector('.shab').innerText;

    // 2. Копирование в буфер обмена
    navigator.clipboard.writeText(textToCopy).then(() => {
        // 3. Добавляем класс (стиль "замирает" на 1 секунду)
        btn.classList.add('active-click');
        
        setTimeout(() => {
            // 4. Удаляем класс через секунду
            btn.classList.remove('active-click');
        }, 500);
    }).catch(err => {
        console.error('Ошибка при копировании: ', err);
    });
}


function copyWithGaps(btn) {
    // 1. Поиск текста в том же родительском блоке
    const parent = btn.closest('.shab-grid'); 
    const originalText = parent.querySelector('.shab').innerText;

    // 2. Формирование текста: символ "ㅤ" (U+3164) и две новые строки в начале
    const inv = "ㅤ"; 
    const textWithGaps = `${inv}\n${inv}\n${originalText}`;

    // 3. Копирование в буфер обмена
    navigator.clipboard.writeText(textWithGaps).then(() => {
        // 4. Добавляем твой класс active-click (цвет меняется мгновенно на var(--m-c))
        btn.classList.add('active-click');
        
        // 5. Удерживаем состояние 0.5с (500мс)
        setTimeout(() => {
            // 6. Удаляем класс. Кнопка плавно вернется к var(--b-c) за 0.15с
            btn.classList.remove('active-click');
        }, 500);
    }).catch(err => {
        console.error('Ошибка при копировании: ', err);
    });
}






function changeCategory(targetId, btn) {
    const parent = document.getElementById('shab1');
    const target = document.getElementById(targetId);
    
    // Ищем текущую активную страницу внутри родителя
    const current = parent.querySelector('.active');

    // --- ЛОГИКА ПОДСВЕТКИ КНОПОК ---
    if (btn) {
        // Находим все кнопки в том же контейнере и снимаем active
        const navButtons = btn.parentElement.querySelectorAll('.c-btn');
        navButtons.forEach(b => b.classList.remove('active'));
        // Добавляем active текущей кнопке
        btn.classList.add('active');
    }
    // ------------------------------

    if (!target || target === current) return;

    // 1. Плавное исчезновение текущей страницы
    if (current) current.classList.remove('active');

    setTimeout(() => {
        // 2. Скрываем все списки (используем твой класс)
        parent.querySelectorAll('.shab-page-obshee').forEach(el => {
            el.style.display = 'none';
        });

        // 3. Показываем нужный список
        target.style.display = 'block';
        parent.scrollTop = 0; // Сброс скролла

        setTimeout(() => {
            target.classList.add('active');
            localStorage.setItem('activeShab', targetId);
        }, 20); // Небольшая задержка для запуска анимации
    }, 150);
}

// Восстановление при загрузке
document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem('activeShab') || 'shab-obshee';
    document.querySelectorAll('.shab-page-obshee').forEach(el => {
        if (el.id === saved) {
            el.style.display = 'block';
            el.classList.add('active');
        } else {
            el.style.display = 'none';
        }
    });
});



// --- Функция для Page 2 (EN) ---
function changeCategoryEN(targetId, btn) {
    const parent = document.getElementById('shab2'); // Ссылка на ВТОРОЙ контейнер
    const target = document.getElementById(targetId);
    const current = parent.querySelector('.active');

    if (btn) {
        const navButtons = btn.parentElement.querySelectorAll('.c-btn');
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    if (!target || target === current) return;
    if (current) current.classList.remove('active');

    setTimeout(() => {
        parent.querySelectorAll('.shab-page-obshee').forEach(el => {
            el.style.display = 'none';
        });
        target.style.display = 'block';
        parent.scrollTop = 0;
        setTimeout(() => {
            target.classList.add('active');
            localStorage.setItem('activeShabEN', targetId); // Другой ключ памяти!
        }, 20);
    }, 150);
}

document.addEventListener("DOMContentLoaded", () => {
    // Универсальная функция настройки контента для любой страницы
    function initPageContent(pageId, storageKey) {
        const page = document.getElementById(pageId);
        if (!page) return;

        // Ищем контейнер со списками внутри этой страницы
        const contentContainer = page.querySelector('.shab1');
        const allLists = contentContainer.querySelectorAll('.shab-page-obshee');
        
        // Получаем сохраненный ID или берем первый доступный список
        const savedId = localStorage.getItem(storageKey);
        const targetId = savedId && page.querySelector(`#${savedId}`) ? savedId : allLists[0]?.id;

        // Показываем только нужный список внутри этой страницы
        allLists.forEach(list => {
            if (list.id === targetId) {
                list.style.display = 'block';
                list.classList.add('active');
            } else {
                list.style.display = 'none';
                list.classList.remove('active');
            }
        });

        // Подсвечиваем кнопку категории только внутри этой страницы
        const activeBtn = page.querySelector(`.c-btn[onclick*="${targetId}"]`);
        if (activeBtn) {
            page.querySelectorAll('.c-btn').forEach(btn => btn.classList.remove('active'));
            activeBtn.classList.add('active');
        }
    }

    // Запускаем для каждой страницы отдельно с их ключами памяти
    initPageContent('page1', 'activeShab');   // Для RU
    initPageContent('page2', 'activeShabEN'); // Для EN
});



document.addEventListener("DOMContentLoaded", () => {
    const scrollContainer = document.getElementById('shab1');
    const btnUp = document.getElementById('scrollToTop');

    // 1. Появление кнопки при скролле
    scrollContainer.onscroll = function() {
        // Если прокрутили больше 300px — показываем кнопку
        if (scrollContainer.scrollTop > 100) {
            btnUp.classList.add('show');
        } else {
            btnUp.classList.remove('show');
        }
    };

    // 2. Логика плавной прокрутки вверх
    btnUp.onclick = function() {
        scrollContainer.scrollTo({
            top: 0,
            behavior: 'smooth' // Делает прокрутку плавной
        });
    };
});

document.addEventListener("DOMContentLoaded", () => {
    const containerEN = document.getElementById('shab2'); 
    const btnUpEN = document.getElementById('scrollToTopEN');

    const constructorArea = document.getElementById('constructorArea');
if (constructorArea) {
    // 1. При загрузке достаем текст из памяти
    const saved = localStorage.getItem('constructorDraft');
    if (saved) {
        constructorArea.value = saved;
    }

    // 2. Если ты печатаешь в поле руками — тоже сохраняем
    constructorArea.addEventListener('input', () => {
        localStorage.setItem('constructorDraft', constructorArea.value);
    });
}

    if (containerEN && btnUpEN) {
        // Следим за скроллом внутри контейнера shab2
        containerEN.addEventListener('scroll', () => {
            if (containerEN.scrollTop > 100) {
                btnUpEN.classList.add('show');
            } else {
                btnUpEN.classList.remove('show');
            }
        });

        // Плавный скролл вверх
        btnUpEN.addEventListener('click', () => {
            containerEN.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});



function filterPages() {
    const input = document.getElementById('searchInput');
    const filter = input.value.trim().toLowerCase();
    const grids = document.querySelectorAll('.shab-grid');

    // 1. ЕСЛИ ПОИСК ПУСТОЙ ИЛИ МАЛО БУКВ
    if (filter.length < 3) {
        grids.forEach(grid => {
            // Мгновенно возвращаем отображение, чтобы не ждать секунду при очистке
            grid.style.display = "flex"; 
            
            // Запускаем плавное появление через opacity
            setTimeout(() => {
                grid.classList.remove('hidden-grid');
            }, 10);

            // ОЧИСТКА ПОДСВЕТКИ: заменяем только найденные <span> обратно на текст
            const elements = grid.querySelectorAll('.shab-name, .shab');
            elements.forEach(el => {
                const highlights = el.querySelectorAll('.highlight');
                if (highlights.length > 0) {
                    // Используем innerText, чтобы сбросить всё в чистый текст И сохранить <br> 
                    // (в современных браузерах innerText при вставке в innerHTML может чудить, 
                    // поэтому лучше просто удалить только теги подсветки)
                    el.innerHTML = el.innerHTML.replace(/<span class="highlight">|<\/span>/g, "");
                }
            });
        });
        return;
    }

    

    

    // 2. ЛОГИКА АКТИВНОГО ПОИСКА
    grids.forEach(grid => {
        const elements = grid.querySelectorAll('.shab-name, .shab');
        let hasMatch = false;

        elements.forEach(el => {
            // Берем чистый текст для проверки, не трогая оригинальный HTML с <br>
            const textContent = el.innerText.toLowerCase();

            if (textContent.includes(filter)) {
                hasMatch = true;
                // Подсвечиваем, сохраняя <br>
                const originalHTML = el.innerHTML.replace(/<span class="highlight">|<\/span>/g, "");
                const regex = new RegExp(`(${filter})`, 'gi');
                el.innerHTML = originalHTML.replace(regex, '<span class="highlight">$1</span>');
                
                // Авто-затухание подсветки через 2 сек
                setTimeout(() => {
                    if (input.value.toLowerCase() === filter) {
                        el.innerHTML = el.innerHTML.replace(/<span class="highlight">|<\/span>/g, "");
                    }
                }, 2000);
            }
        });

        // Плавное скрытие/появление всей карточки
        if (hasMatch) {
            grid.style.display = "flex";
            setTimeout(() => grid.classList.remove('hidden-grid'), 10);
        } else {
            grid.classList.add('hidden-grid');
            setTimeout(() => {
                if (grid.classList.contains('hidden-grid')) {
                    grid.style.display = "none";
                }
            }, 1000); // 1 секунда как в CSS
        }
    });
}

// Вспомогательная функция для безопасной подсветки текста внутри HTML
function highlightTextNodes(element, regex) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const nodesToReplace = [];

    while (node = walker.nextNode()) {
        if (node.nodeValue.match(regex)) {
            nodesToReplace.push(node);
        }
    }

    nodesToReplace.forEach(node => {
        const span = document.createElement('span');
        span.innerHTML = node.nodeValue.replace(regex, '<span class="highlight">$1</span>');
        node.parentNode.replaceChild(span, node);
        // "Разворачиваем" временный span, чтобы не плодить вложенность
        const parent = span.parentNode;
        while (span.firstChild) {
            parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
    });
}




// Твоя функция очистки (оставляем как есть)
function clearAllHighlights() {
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(span => {
        const textNode = document.createTextNode(span.textContent);
        span.parentNode.replaceChild(textNode, span);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');

    // Делаем меню открытым по умолчанию
    sidebar.classList.add('active');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        
        // Меняем иконку при клике
        toggleBtn.innerHTML = sidebar.classList.contains('active') ? '❮' : '❯';
    });
});



document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    
    // Установи порог: если ширина экрана меньше этого значения (из-за зума или ресайза), 
    // меню схлопнется. Если больше — откроется.
    const breakpoint = 1800; 

    function autoToggleMenu() {
        if (window.innerWidth < breakpoint) {
            // Если места мало — закрываем
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                if (toggleBtn) toggleBtn.innerHTML = '❮';
                
                // Если ты используешь JS для смещения кнопки, добавь строку ниже:
                // toggleBtn.style.left = "80px"; 
            }
        } else {
            // Если места достаточно — открываем обратно
            if (!sidebar.classList.contains('active')) {
                sidebar.classList.add('active');
                if (toggleBtn) toggleBtn.innerHTML = '❯';
                
                // Если ты используешь JS для смещения кнопки, добавь строку ниже:
                // toggleBtn.style.left = "400px";
            }
        }
    }

    // Слушаем изменение размера окна (срабатывает и при зуме)
    window.addEventListener('resize', autoToggleMenu);

    // Вызываем один раз при загрузке страницы, чтобы сразу проверить масштаб
    autoToggleMenu();
});


function filterPagesEN() {
    // 1. Берем значение именно из АНГЛИЙСКОГО инпута
    const input = document.getElementById('searchInputEN');
    if (!input) return; // Защита от ошибок
    
    const filter = input.value.trim().toLowerCase();
    
    // 2. Ищем карточки ТОЛЬКО внутри контейнера второй страницы
    const container = document.getElementById('shab2');
    if (!container) return;
    
    const grids = container.querySelectorAll('.shab-grid');

    // ЛОГИКА ОЧИСТКИ (если в поиске меньше 3 символов)
    if (filter.length < 3) {
        grids.forEach(grid => {
            grid.style.display = "flex"; 
            setTimeout(() => { grid.classList.remove('hidden-grid'); }, 10);
            
            const elements = grid.querySelectorAll('.shab-name, .shab');
            elements.forEach(el => {
                el.innerHTML = el.innerHTML.replace(/<span class="highlight">|<\/span>/g, "");
            });
        });
        return;
    }

    // ЛОГИКА ПОИСКА
    grids.forEach(grid => {
        const elements = grid.querySelectorAll('.shab-name, .shab');
        let hasMatch = false;

        elements.forEach(el => {
            const textContent = el.innerText.toLowerCase();

            if (textContent.includes(filter)) {
                hasMatch = true;
                // Подсветка
                const originalHTML = el.innerHTML.replace(/<span class="highlight">|<\/span>/g, "");
                const regex = new RegExp(`(${filter})`, 'gi');
                el.innerHTML = originalHTML.replace(regex, '<span class="highlight">$1</span>');
            }
        });

        // Плавное скрытие/появление карточки
        if (hasMatch) {
            grid.style.display = "flex";
            setTimeout(() => grid.classList.remove('hidden-grid'), 10);
        } else {
            grid.classList.add('hidden-grid');
            setTimeout(() => {
                if (grid.classList.contains('hidden-grid')) {
                    grid.style.display = "none";
                }
            }, 1000); // 1 секунда (согласно твоему CSS)
        }
    });
}



// 1. Добавление текста в поле
function addToConstructor(btn) {
    const area = document.getElementById('constructorArea');
    const textToAdd = btn.getAttribute('data-text');
    
    // Добавляем текст к текущему содержимому
    area.value += textToAdd;
    
    // Анимация кнопки (опционально, используем твой класс)
    btn.classList.add('active-click');
    setTimeout(() => btn.classList.remove('active-click'), 300);

    // Добавь эту строку в самый конец функции addToConstructor
    localStorage.setItem('constructorDraft', area.value);
}

// 2. Копирование результата
function copyConstructorText() {
    const area = document.getElementById('constructorArea');
    if (area.value.trim() === "") return; // Если пусто — не копируем

    navigator.clipboard.writeText(area.value).then(() => {
        
    });
}

// 3. Очистка поля
function clearConstructor() {
    document.getElementById('constructorArea').value = "";

    // Добавь это внутрь функции, которая очищает поле
    localStorage.removeItem('constructorDraft');
}













