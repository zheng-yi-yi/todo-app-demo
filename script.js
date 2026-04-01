document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');

    // 添加新任务的功能
    function addTodo() {
        const todoText = todoInput.value.trim();

        if (todoText === '') {
            alert('请输入待办事项！');
            return;
        }

        // 创建列表项并添加内容
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="todo-text">${todoText}</span>
            <button class="delete-btn">删除</button>
        `;

        // 为删除按钮添加事件监听
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.onclick = function() {
            li.remove();
        };

        // 将新项添加到列表中
        todoList.appendChild(li);

        // 清空输入框并聚焦
        todoInput.value = '';
        todoInput.focus();
    }

    // 点击按钮添加
    addBtn.onclick = addTodo;

    // 按回车键添加
    todoInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    };
});
