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





