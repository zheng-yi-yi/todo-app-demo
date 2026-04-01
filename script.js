// Apply saved theme immediately to avoid flash of wrong theme
(function() {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', () => {
    const todoInput   = document.getElementById('todoInput');
    const addBtn      = document.getElementById('addBtn');
    const todoList    = document.getElementById('todoList');
    const themeToggle = document.getElementById('themeToggle');
    const emptyState  = document.getElementById('emptyState');
    const totalCount  = document.getElementById('totalCount');
    const doneCount   = document.getElementById('doneCount');
    const pendingCount = document.getElementById('pendingCount');
    const progressBar = document.getElementById('progressBar');

    // ── Theme ──────────────────────────────────────────────────
    function updateToggleIcon() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    }
    updateToggleIcon();

    themeToggle.onclick = () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const next = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateToggleIcon();
    };

    // ── Stats ──────────────────────────────────────────────────
    function bump(el) {
        el.classList.remove('bump');
        void el.offsetWidth; // reflow to restart animation
        el.classList.add('bump');
    }

    function updateStats() {
        const items   = todoList.querySelectorAll('li');
        const done    = todoList.querySelectorAll('li .todo-check.checked');
        const total   = items.length;
        const doneN   = done.length;
        const pending = total - doneN;

        bump(totalCount);
        totalCount.textContent   = total;
        doneCount.textContent    = doneN;
        pendingCount.textContent = pending;

        const pct = total === 0 ? 0 : Math.round((doneN / total) * 100);
        progressBar.style.width = pct + '%';

        emptyState.classList.toggle('visible', total === 0);
    }

    // ── Add todo ───────────────────────────────────────────────
    function addTodo() {
        const text = todoInput.value.trim();
        if (text === '') {
            todoInput.focus();
            todoInput.classList.add('shake');
            setTimeout(() => todoInput.classList.remove('shake'), 400);
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="todo-check" role="checkbox" aria-checked="false" tabindex="0" title="标记完成"></div>
            <span class="todo-text">${escapeHtml(text)}</span>
            <button class="delete-btn" title="删除">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
            </button>`;

        const checkEl  = li.querySelector('.todo-check');
        const textEl   = li.querySelector('.todo-text');
        const deleteBtn = li.querySelector('.delete-btn');

        // Toggle completion
        function toggleDone() {
            const checked = checkEl.classList.toggle('checked');
            textEl.classList.toggle('done', checked);
            checkEl.setAttribute('aria-checked', checked);
            updateStats();
        }
        checkEl.onclick  = toggleDone;
        checkEl.onkeydown = (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleDone(); } };

        // Delete with animation
        deleteBtn.onclick = () => {
            li.classList.add('removing');
            li.addEventListener('animationend', () => {
                li.remove();
                updateStats();
            }, { once: true });
        };

        todoList.appendChild(li);
        todoInput.value = '';
        todoInput.focus();
        updateStats();
    }

    // ── Helpers ────────────────────────────────────────────────
    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ── Events ─────────────────────────────────────────────────
    addBtn.onclick = addTodo;

    todoInput.onkeydown = (e) => {
        if (e.key === 'Enter') addTodo();
    };

    // Initial render
    updateStats();
});

