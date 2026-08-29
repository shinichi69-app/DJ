// API Base URL
const API_URL = 'http://localhost:3000/api/employees';

// DOM Elements
const employeeGrid = document.getElementById('employeeGrid');
const searchInput = document.getElementById('searchInput');
const departmentFilter = document.getElementById('departmentFilter');
const loading = document.getElementById('loading');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');

// Modal Elements
const employeeModal = document.getElementById('employeeModal');
const deleteModal = document.getElementById('deleteModal');
const modalTitle = document.getElementById('modalTitle');
const employeeForm = document.getElementById('employeeForm');
const employeeIdInput = document.getElementById('employeeId');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const positionInput = document.getElementById('position');
const departmentInput = document.getElementById('department');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const bioInput = document.getElementById('bio');
const profileImageInput = document.getElementById('profileImage');

// Close buttons
const closeModal = document.querySelector('.close');
const closeDelete = document.querySelector('.close-delete');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');

let currentDeleteId = null;

// ============== API Functions ==============

// Fetch all employees
async function fetchEmployees() {
    showLoading(true);
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch employees');
        const employees = await response.json();
        renderEmployees(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        showError('ไม่สามารถโหลดข้อมูลพนักงานได้');
    } finally {
        showLoading(false);
    }
}

// Add new employee
async function addEmployee(employeeData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });
        if (!response.ok) throw new Error('Failed to add employee');
        const newEmployee = await response.json();
        return newEmployee;
    } catch (error) {
        console.error('Error adding employee:', error);
        throw error;
    }
}

// Update employee
async function updateEmployee(id, employeeData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });
        if (!response.ok) throw new Error('Failed to update employee');
        const updatedEmployee = await response.json();
        return updatedEmployee;
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
}

// Delete employee
async function deleteEmployee(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete employee');
        return true;
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
}

// ============== Render Functions ==============

function renderEmployees(employees) {
    if (employees.length === 0) {
        employeeGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-users" style="font-size: 3rem; color: #ccc;"></i>
                <h3 style="color: #666; margin-top: 15px;">ไม่พบข้อมูลพนักงาน</h3>
                <p style="color: #999;">คลิก "เพิ่มพนักงาน" เพื่อเริ่มต้น</p>
            </div>
        `;
        return;
    }

    employeeGrid.innerHTML = employees.map(emp => `
        <div class="employee-card" data-id="${emp.id}">
            <div class="actions">
                <button class="edit-btn" onclick="editEmployee('${emp.id}')" title="แก้ไข">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="confirmDeleteEmployee('${emp.id}')" title="ลบ">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <img src="${emp.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(emp.firstName + ' ' + emp.lastName) + '&background=667eea&color=fff&size=80'}" 
                 alt="${emp.firstName} ${emp.lastName}" 
                 class="avatar">
            <div class="name">${emp.firstName} ${emp.lastName}</div>
            <div class="position">${emp.position}</div>
            <span class="department">${emp.department}</span>
            <div class="email"><i class="fas fa-envelope"></i> ${emp.email}</div>
            ${emp.phone ? `<div class="phone"><i class="fas fa-phone"></i> ${emp.phone}</div>` : ''}
            ${emp.bio ? `<div class="bio">${emp.bio}</div>` : ''}
        </div>
    `).join('');
}

function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
    if (show) {
        employeeGrid.innerHTML = '';
    }
}

function showError(message) {
    employeeGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #e74c3c;">
            <i class="fas fa-exclamation-circle" style="font-size: 3rem;"></i>
            <p style="margin-top: 15px;">${message}</p>
            <button onclick="fetchEmployees()" class="btn btn-primary" style="margin-top: 15px;">
                <i class="fas fa-sync"></i> ลองใหม่
            </button>
        </div>
    `;
}

// ============== Filter Functions ==============

function filterEmployees() {
    const searchTerm = searchInput.value.toLowerCase();
    const department = departmentFilter.value;

    const cards = document.querySelectorAll('.employee-card');
    cards.forEach(card => {
        const name = card.querySelector('.name')?.textContent?.toLowerCase() || '';
        const position = card.querySelector('.position')?.textContent?.toLowerCase() || '';
        const dept = card.querySelector('.department')?.textContent || '';
        
        const matchesSearch = name.includes(searchTerm) || position.includes(searchTerm);
        const matchesDept = !department || dept === department;
        
        card.style.display = (matchesSearch && matchesDept) ? 'block' : 'none';
    });
}

// ============== Modal Functions ==============

function openModal(employee = null) {
    if (employee) {
        modalTitle.innerHTML = '<i class="fas fa-user-edit"></i> แก้ไขข้อมูลพนักงาน';
        employeeIdInput.value = employee.id;
        firstNameInput.value = employee.firstName;
        lastNameInput.value = employee.lastName;
        positionInput.value = employee.position;
        departmentInput.value = employee.department;
        emailInput.value = employee.email;
        phoneInput.value = employee.phone || '';
        bioInput.value = employee.bio || '';
        profileImageInput.value = employee.profileImage || '';
    } else {
        modalTitle.innerHTML = '<i class="fas fa-user-plus"></i> เพิ่มพนักงานใหม่';
        employeeForm.reset();
        employeeIdInput.value = '';
    }
    employeeModal.style.display = 'block';
}

function closeModalFn() {
    employeeModal.style.display = 'none';
    employeeForm.reset();
}

function confirmDeleteEmployee(id) {
    currentDeleteId = id;
    deleteModal.style.display = 'block';
}

function closeDeleteModal() {
    deleteModal.style.display = 'none';
    currentDeleteId = null;
}

// ============== Event Handlers ==============

// Add employee button
addEmployeeBtn.addEventListener('click', () => openModal());

// Close modal buttons
closeModal.addEventListener('click', closeModalFn);
closeDelete.addEventListener('click', closeDeleteModal);
cancelDelete.addEventListener('click', closeDeleteModal);

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target === employeeModal) closeModalFn();
    if (e.target === deleteModal) closeDeleteModal();
});

// Edit employee (global function)
window.editEmployee = async function(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch employee');
        const employee = await response.json();
        openModal(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        alert('ไม่สามารถโหลดข้อมูลพนักงานได้');
    }
};

// Confirm delete (global function)
window.confirmDeleteEmployee = confirmDeleteEmployee;

// Delete confirmation
confirmDelete.addEventListener('click', async () => {
    if (!currentDeleteId) return;
    try {
        await deleteEmployee(currentDeleteId);
        closeDeleteModal();
        await fetchEmployees();
    } catch (error) {
        alert('ไม่สามารถลบพนักงานได้');
    }
});

// Form submit
employeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const employeeData = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        position: positionInput.value.trim(),
        department: departmentInput.value,
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        bio: bioInput.value.trim(),
        profileImage: profileImageInput.value.trim()
    };

    const id = employeeIdInput.value;
    try {
        if (id) {
            await updateEmployee(id, employeeData);
        } else {
            await addEmployee(employeeData);
        }
        closeModalFn();
        await fetchEmployees();
    } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
    }
});

// Search and filter
searchInput.addEventListener('input', filterEmployees);
departmentFilter.addEventListener('change', filterEmployees);

// ============== Initialize ==============
fetchEmployees();