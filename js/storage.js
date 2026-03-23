/**
 * storage.js
 * Handles all localStorage operations for the CRM system.
 */

const STORAGE_KEYS = {
    CUSTOMERS: 'crm_customers',
    DEALS: 'crm_deals',
    TASKS: 'crm_tasks',
    INTERACTIONS: 'crm_interactions',
    SETTINGS: 'crm_settings'
};

const StorageService = {
    // Generic methods
    getData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Customer methods
    getCustomers() {
        return this.getData(STORAGE_KEYS.CUSTOMERS);
    },

    saveCustomer(customer) {
        const customers = this.getCustomers();
        if (customer.id) {
            const index = customers.findIndex(c => c.id === customer.id);
            if (index !== -1) {
                customers[index] = customer;
            } else {
                customers.push(customer);
            }
        } else {
            customer.id = 'cust_' + Date.now();
            customer.createdAt = new Date().toISOString();
            customers.push(customer);
        }
        this.saveData(STORAGE_KEYS.CUSTOMERS, customers);
        return customer;
    },

    deleteCustomer(id) {
        const customers = this.getCustomers().filter(c => c.id !== id);
        this.saveData(STORAGE_KEYS.CUSTOMERS, customers);
        
        // Also clean up related deals, tasks, and interactions
        const deals = this.getDeals().filter(d => d.customerId !== id);
        this.saveData(STORAGE_KEYS.DEALS, deals);
        
        const tasks = this.getTasks().filter(t => t.customerId !== id);
        this.saveData(STORAGE_KEYS.TASKS, tasks);
        
        const interactions = this.getInteractions().filter(i => i.customerId !== id);
        this.saveData(STORAGE_KEYS.INTERACTIONS, interactions);
    },

    // Deal methods
    getDeals() {
        return this.getData(STORAGE_KEYS.DEALS);
    },

    saveDeal(deal) {
        const deals = this.getDeals();
        if (deal.id) {
            const index = deals.findIndex(d => d.id === deal.id);
            if (index !== -1) {
                deals[index] = deal;
            } else {
                deals.push(deal);
            }
        } else {
            deal.id = 'deal_' + Date.now();
            deal.createdAt = new Date().toISOString();
            deals.push(deal);
        }
        this.saveData(STORAGE_KEYS.DEALS, deals);
        return deal;
    },

    deleteDeal(id) {
        const deals = this.getDeals().filter(d => d.id !== id);
        this.saveData(STORAGE_KEYS.DEALS, deals);
    },

    // Task methods
    getTasks() {
        return this.getData(STORAGE_KEYS.TASKS);
    },

    saveTask(task) {
        const tasks = this.getTasks();
        if (task.id) {
            const index = tasks.findIndex(t => t.id === task.id);
            if (index !== -1) {
                tasks[index] = task;
            } else {
                tasks.push(task);
            }
        } else {
            task.id = 'task_' + Date.now();
            task.createdAt = new Date().toISOString();
            tasks.push(task);
        }
        this.saveData(STORAGE_KEYS.TASKS, tasks);
        return task;
    },

    deleteTask(id) {
        const tasks = this.getTasks().filter(t => t.id !== id);
        this.saveData(STORAGE_KEYS.TASKS, tasks);
    },

    // Interaction methods
    getInteractions() {
        return this.getData(STORAGE_KEYS.INTERACTIONS);
    },

    saveInteraction(interaction) {
        const interactions = this.getInteractions();
        if (interaction.id) {
            const index = interactions.findIndex(i => i.id === interaction.id);
            if (index !== -1) {
                interactions[index] = interaction;
            } else {
                interactions.push(interaction);
            }
        } else {
            interaction.id = 'int_' + Date.now();
            interaction.createdAt = new Date().toISOString();
            interactions.push(interaction);
        }
        this.saveData(STORAGE_KEYS.INTERACTIONS, interactions);
        return interaction;
    },

    deleteInteraction(id) {
        const interactions = this.getInteractions().filter(i => i.id !== id);
        this.saveData(STORAGE_KEYS.INTERACTIONS, interactions);
    },

    // Dashboard stats
    getStats() {
        const customers = this.getCustomers();
        const deals = this.getDeals();
        const tasks = this.getTasks();
        
        return {
            totalCustomers: customers.length,
            activeDeals: deals.filter(d => d.status !== 'Closed Won' && d.status !== 'Closed Lost').length,
            completedSales: deals.filter(d => d.status === 'Closed Won').length,
            pendingTasks: tasks.filter(t => !t.completed).length,
            totalRevenue: deals
                .filter(d => d.status === 'Closed Won')
                .reduce((sum, d) => sum + parseFloat(d.value || 0), 0)
        };
    }
};
