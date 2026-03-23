/**
 * app.js
 * Shared logic for all pages in the CRM.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const header = document.querySelector('.header');
    
    // Highlight active link in sidebar
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    sidebarLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    if (header && window.innerWidth <= 768) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        toggleBtn.style.marginRight = '15px';
        toggleBtn.onclick = () => {
            sidebar.classList.toggle('active');
        };
        header.prepend(toggleBtn);
    }

    // Initialize data if empty (Demo data)
    initDemoData();
});

function initDemoData() {
    const customers = StorageService.getCustomers();
    if (customers.length === 0) {
        console.log('Initializing demo data...');
        
        // Add a demo customer
        const demoCust = StorageService.saveCustomer({
            name: 'Thabo Mbeki',
            phone: '082 123 4567',
            email: 'thabo@example.co.za',
            location: 'Durban, KZN',
            notes: 'Interested in euphorbia collection.'
        });

        // Add a demo deal
        StorageService.saveDeal({
            customerId: demoCust.id,
            value: 2500,
            status: 'New Enquiry',
            notes: 'Initial enquiry from WhatsApp.'
        });

        // Add a demo task
        StorageService.saveTask({
            title: 'Call Thabo regarding enquiry',
            customerId: demoCust.id,
            dueDate: new Date().toISOString().split('T')[0],
            completed: false
        });

        // Add a demo interaction
        StorageService.saveInteraction({
            customerId: demoCust.id,
            type: 'WhatsApp',
            notes: 'Customer asked for price list and delivery options to Durban North.'
        });
        
        // Refresh page if on index to show stats
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            window.location.reload();
        }
    }
}
