/**
 * customers.js
 * Logic for managing customers.
 */

document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();
    
    // Handle form submission
    document.getElementById('customerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveCustomer();
    });
});

function loadCustomers(filter = '') {
    const customers = StorageService.getCustomers();
    const tableBody = document.getElementById('customerTableBody');
    tableBody.innerHTML = '';

    const filtered = customers.filter(c => 
        c.name.toLowerCase().includes(filter.toLowerCase()) ||
        c.email.toLowerCase().includes(filter.toLowerCase()) ||
        (c.location && c.location.toLowerCase().includes(filter.toLowerCase()))
    );

    if (filtered.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No customers found.</td></tr>';
        return;
    }

    filtered.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="font-weight: 600;">${customer.name}</div>
                <div style="color: var(--text-muted); font-size: 0.75rem;">${customer.id}</div>
            </td>
            <td>
                <div>${customer.phone}</div>
                <div style="color: var(--text-muted); font-size: 0.75rem;">${customer.email}</div>
            </td>
            <td>${customer.location || 'N/A'}</td>
            <td>${new Date(customer.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editCustomer('${customer.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCustomer('${customer.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function filterCustomers() {
    const searchValue = document.getElementById('customerSearch').value;
    loadCustomers(searchValue);
}

function openModal(id = null) {
    const modal = document.getElementById('customerModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('customerForm');
    
    form.reset();
    document.getElementById('customerId').value = '';
    
    if (id) {
        const customer = StorageService.getCustomers().find(c => c.id === id);
        if (customer) {
            title.textContent = 'Edit Customer';
            document.getElementById('customerId').value = customer.id;
            document.getElementById('customerName').value = customer.name;
            document.getElementById('customerPhone').value = customer.phone;
            document.getElementById('customerEmail').value = customer.email;
            document.getElementById('customerLocation').value = customer.location || '';
            document.getElementById('customerNotes').value = customer.notes || '';
        }
    } else {
        title.textContent = 'Add New Customer';
    }
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('customerModal').style.display = 'none';
}

function saveCustomer() {
    const customerData = {
        id: document.getElementById('customerId').value || null,
        name: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        email: document.getElementById('customerEmail').value,
        location: document.getElementById('customerLocation').value,
        notes: document.getElementById('customerNotes').value
    };

    StorageService.saveCustomer(customerData);
    closeModal();
    loadCustomers();
}

function editCustomer(id) {
    openModal(id);
}

function deleteCustomer(id) {
    if (confirm('Are you sure you want to delete this customer? This will also delete all related deals, tasks, and interactions.')) {
        StorageService.deleteCustomer(id);
        loadCustomers();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('customerModal');
    if (event.target == modal) {
        closeModal();
    }
};
