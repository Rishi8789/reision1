
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Make a POST request to the login API
    fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
    // added
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Store the token in localStorage
            localStorage.setItem('token', data.token);
            // Redirect to the Employee page
            window.location.href = 'employee.html';
        } else {
            alert('Login failed. Please check your credentials.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function generateEmployeeCard(employee) {
    return `
        <div class="employee-card">
            <img src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" alt="${employee.name}">
            <h2>${employee.name}</h2>
            <p>Gender: ${employee.gender}</p>
            <p>Department: ${employee.department}</p>
            <p>Salary: ${employee.salary}</p>
        </div>
    `;
}

// Function to display employee cards on the page
function displayEmployees(employees) {
    const employeeContainer = document.getElementById('employee-container');
    employeeContainer.innerHTML = ''; // Clear previous content
console.log(employees)
    employees.forEach(employee => {
        const cardHtml = generateEmployeeCard(employee);
        employeeContainer.innerHTML += cardHtml;
    });
}

// Fetch employees data from the API

async function fetchEmployees(page = 1, sort = 'asc', department = '', gender = '') {
    const token = localStorage.getItem('token');

    try {
        let apiUrl = `https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-employees?page=${page}&limit=6&sort=salary&order=${sort}`;

        if (department) {
            apiUrl += `&filterBy=department&filterValue=${department}`;
        }

        if (gender) {
            apiUrl += `&filterValue=${gender}&filterBy=gender`;
        }
        // if (sort) {
        //     apiUrl += `&sort=salary&order=${sort}`;
        // }


        const response = await fetch(apiUrl, {
            // headers: {
            //     'Authorization': `Bearer ${token}`,
            // },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        const data = await response.json();
        
    
        
        displayEmployees(data.data); 
        console.log(data.totalPages);
        // Logic for pagination
        const totalPages = Math.ceil(data.totalPages / 6); 
        displayPagination(totalPages, page);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Function to handle sorting selection
function handleSortChange() {
    const sortSelect = document.getElementById('sort-select');
    const selectedSort = sortSelect.value;
    fetchEmployees(1, selectedSort);
}

// Function to handle department filter selection
function handleDepartmentChange() {
    const departmentSelect = document.getElementById('department-select');
    const selectedDepartment = departmentSelect.value;
    fetchEmployees(1, 'asc', selectedDepartment);
}

// Function to handle gender filter selection
function handleGenderChange() {
    const genderSelect = document.getElementById('gender-select');
    const selectedGender = genderSelect.value;
    fetchEmployees(1, 'asc', '', selectedGender);
}

// ...

// Call the fetchEmployees function on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchEmployees();
});


function displayPagination(totalPages, currentPage) {
    console.log(currentPage);
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = ''; // Clear previous pagination links

    const prevButton = document.createElement('a');
    prevButton.href = '#';
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            fetchEmployees(currentPage - 1);
        }
    });

    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.addEventListener('click', () => {
            fetchEmployees(i);
        });

        if (i === currentPage) {
            pageLink.classList.add('active');
        }

        paginationContainer.appendChild(pageLink);
    }

    const nextButton = document.createElement('a');
    nextButton.href = '#';
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
        console.log(currentPage);
        if (currentPage < totalPages) {
            fetchEmployees(currentPage + 1);
        }
    });

    paginationContainer.appendChild(nextButton);
}

// Add event listeners for sorting and filtering
document.getElementById('sort-select').addEventListener('change', handleSortChange);
document.getElementById('department-select').addEventListener('change', handleDepartmentChange);
document.getElementById('gender-select').addEventListener('change', handleGenderChange);