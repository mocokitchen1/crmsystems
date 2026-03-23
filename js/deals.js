/**
 * deals.js
 * Logic for managing sales pipeline (deals).
 */

document.addEventListener('DOMContentLoaded', () => {
    loadCustomersToSelect();
    loadDeals();
    
    // Handle form submission
    document.getElementById('dealForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveDeal();
    });
});

function loadCustomersToSelect() {
    const customers = StorageService.getCustomers();
    const select = document.getElementById('dealCustomer');
    select.innerHTML = '<option value="">Select Customer</option>';
    
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = customer.name;
        select.appendChild(option);
    });
}

function loadDeals() {
    const deals = StorageService.getDeals();
    const customers = StorageService.getCustomers();
    
    // Define columns and their list IDs
    const columns = {
        'New Enquiry': 'new-enquiry-list',
        'Proposal Sent': 'proposal-sent-list',
        'In Preparation': 'in-prep-list',
        'Delivered': 'delivered-list',
        'Closed Won': 'closed-won-list'
    };

    // Reset all lists
    Object.values(columns).forEach(id => {
        const list = document.getElementById(id);
        if (list) list.innerHTML = '';
        
        // Update count
        const header = list?.parentElement.querySelector('.count');
        if (header) header.textContent = '0';
    });

    deals.forEach(deal => {
        const listId = columns[deal.status] || (deal.status === 'Closed Lost' ? null : 'new-enquiry-list');
        if (!listId) return; // Skip Closed Lost or others not in columns

        const list = document.getElementById(listId);
        if (!list) return;

        const customer = customers.find(c => c.id === deal.customerId);
        
        const item = document.createElement('div');
        item.className = 'kanban-item';
        item.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 4px;">${customer ? customer.name : 'Unknown Customer'}</div>
            <div style="color: var(--secondary-color); font-weight: bold; margin-bottom: 8px;">R ${parseFloat(deal.value).toLocaleString()}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px;">
                ${deal.notes ? deal.notes.substring(0, 50) + '...' : 'No notes'}
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 5px;">
                <button class="btn btn-sm btn-primary" onclick="editDeal('${deal.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteDeal('${deal.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(item);

        // Update count
        const countSpan = list.parentElement.querySelector('.count');
        countSpan.textContent = parseInt(countSpan.textContent) + 1;
    });
}

function openModal(id = null) {
    const modal = document.getElementById('dealModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('dealForm');
    
    form.reset();
    document.getElementById('dealId').value = '';
    
    if (id) {
        const deal = StorageService.getDeals().find(d => d.id === id);
        if (deal) {
            title.textContent = 'Edit Deal';
            document.getElementById('dealId').value = deal.id;
            document.getElementById('dealCustomer').value = deal.customerId;
            document.getElementById('dealValue').value = deal.value;
            document.getElementById('dealStatus').value = deal.status;
            document.getElementById('dealNotes').value = deal.notes || '';
        }
    } else {
        title.textContent = 'Create New Deal';
    }
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('dealModal').style.display = 'none';
}

function saveDeal() {
    const dealData = {
        id: document.getElementById('dealId').value || null,
        customerId: document.getElementById('dealCustomer').value,
        value: document.getElementById('dealValue').value,
        status: document.getElementById('dealStatus').value,
        notes: document.getElementById('dealNotes').value
    };

    StorageService.saveDeal(dealData);
    closeModal();
    loadDeals();
}

function editDeal(id) {
    openModal(id);
}

function deleteDeal(id) {
    if (confirm('Are you sure you want to delete this deal?')) {
        StorageService.deleteDeal(id);
        loadDeals();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('dealModal');
    if (event.target == modal) {
        closeModal();
    }
};
