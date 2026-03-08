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

document.addEventListener("DOMContentLoaded", () => {
    // 1. Получаем ID последней открытой страницы из памяти
    const activeShabId = localStorage.getItem('activeShab');
    
    if (activeShabId) {
        // 2. Ищем ту самую страницу в верстке
        const targetPage = document.getElementById(activeShabId);
        
        if (targetPage) {
            // 3. Сначала скрываем все страницы (на всякий случай)
            document.querySelectorAll('.shab-page-obshee').forEach(el => {
                el.style.display = 'none';
                el.classList.remove('active');
            });

            // 4. Показываем сохраненную страницу
            targetPage.style.display = 'block';
            targetPage.classList.add('active');

            // 5. Ищем кнопку, у которой onclick совпадает с этим ID, и подсвечиваем её
            const btn = document.querySelector(`.c-btn[onclick*="${activeShabId}"]`);
            if (btn) {
                btn.classList.add('active');
            }
        }
    } else {
        // Если в памяти ничего нет, подсвечиваем первую кнопку "Общее" по умолчанию
        const defaultBtn = document.querySelector('.c-btn');
        if (defaultBtn) defaultBtn.classList.add('active');
    }
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
        toggleBtn.innerHTML = sidebar.classList.contains('active') ? '✕' : '☰';
    });
});



document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    
    // Установи порог: если ширина экрана меньше этого значения (из-за зума или ресайза), 
    // меню схлопнется. Если больше — откроется.
    const breakpoint = 1300; 

    function autoToggleMenu() {
        if (window.innerWidth < breakpoint) {
            // Если места мало — закрываем
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                if (toggleBtn) toggleBtn.innerHTML = '☰';
                
                // Если ты используешь JS для смещения кнопки, добавь строку ниже:
                // toggleBtn.style.left = "80px"; 
            }
        } else {
            // Если места достаточно — открываем обратно
            if (!sidebar.classList.contains('active')) {
                sidebar.classList.add('active');
                if (toggleBtn) toggleBtn.innerHTML = '✕';
                
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




