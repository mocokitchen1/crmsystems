/**
 * tasks.js
 * Logic for managing tasks and reminders.
 */

document.addEventListener('DOMContentLoaded', () => {
    loadCustomersToSelect();
    loadTasks();
    
    // Handle form submission
    document.getElementById('taskForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveTask();
    });
});

function loadCustomersToSelect() {
    const customers = StorageService.getCustomers();
    const select = document.getElementById('taskCustomer');
    select.innerHTML = '<option value="">None</option>';
    
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = customer.name;
        select.appendChild(option);
    });
}

function loadTasks() {
    const tasks = StorageService.getTasks();
    const customers = StorageService.getCustomers();
    const tableBody = document.getElementById('taskTableBody');
    tableBody.innerHTML = '';

    const today = new Date().toISOString().split('T')[0];
    let pendingCount = 0;
    let overdueCount = 0;

    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    if (tasks.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No tasks found.</td></tr>';
    } else {
        tasks.forEach(task => {
            const customer = customers.find(c => c.id === task.customerId);
            const isOverdue = !task.completed && task.dueDate < today;
            
            if (!task.completed) {
                pendingCount++;
                if (isOverdue) overdueCount++;
            }

            const row = document.createElement('tr');
            if (task.completed) row.style.opacity = '0.6';
            
            row.innerHTML = `
                <td>
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskComplete('${task.id}')">
                </td>
                <td style="${task.completed ? 'text-decoration: line-through;' : ''}">
                    <div style="font-weight: 600;">${task.title}</div>
                </td>
                <td>${customer ? customer.name : 'N/A'}</td>
                <td style="${isOverdue ? 'color: var(--danger-color); font-weight: bold;' : ''}">
                    ${new Date(task.dueDate).toLocaleDateString()}
                    ${isOverdue ? ' (Overdue)' : ''}
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editTask('${task.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTask('${task.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    document.getElementById('pending-tasks-count').textContent = pendingCount;
    document.getElementById('overdue-tasks-count').textContent = overdueCount;
}

function openModal(id = null) {
    const modal = document.getElementById('taskModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('taskForm');
    
    form.reset();
    document.getElementById('taskId').value = '';
    
    if (id) {
        const task = StorageService.getTasks().find(t => t.id === id);
        if (task) {
            title.textContent = 'Edit Task';
            document.getElementById('taskId').value = task.id;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskCustomer').value = task.customerId || '';
            document.getElementById('taskDueDate').value = task.dueDate;
        }
    } else {
        title.textContent = 'Add New Task';
        // Set default due date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('taskDueDate').value = tomorrow.toISOString().split('T')[0];
    }
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('taskModal').style.display = 'none';
}

function saveTask() {
    const taskId = document.getElementById('taskId').value;
    const existingTask = taskId ? StorageService.getTasks().find(t => t.id === taskId) : null;

    const taskData = {
        id: taskId || null,
        title: document.getElementById('taskTitle').value,
        customerId: document.getElementById('taskCustomer').value || null,
        dueDate: document.getElementById('taskDueDate').value,
        completed: existingTask ? existingTask.completed : false
    };

    StorageService.saveTask(taskData);
    closeModal();
    loadTasks();
}

function toggleTaskComplete(id) {
    const tasks = StorageService.getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        StorageService.saveTask(task);
        loadTasks();
    }
}

function editTask(id) {
    openModal(id);
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        StorageService.deleteTask(id);
        loadTasks();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('taskModal');
    if (event.target == modal) {
        closeModal();
    }
};
