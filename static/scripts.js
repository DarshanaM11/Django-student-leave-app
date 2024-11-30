// scripts.js

// Function to toggle the popover visibility
document.querySelector('.profile-icon').addEventListener('click', function (event) {
    const popover = document.getElementById('popover');
    popover.classList.toggle('show');
    event.stopPropagation(); // Prevent click event from propagating to the document
});

// Function to close the popover when clicking outside
document.addEventListener('click', function (event) {
    const popover = document.getElementById('popover');
    const profileIcon = document.querySelector('.profile-icon');

    if (!popover.contains(event.target) && event.target !== profileIcon) {
        popover.classList.remove('show');
    }
});

// Logout confirmation
document.getElementById('logout-btn').addEventListener('click', function () {
    const confirmation = confirm("Do you want to exit?");
    if (confirmation) {
        window.location.href = "/"; // Redirect to home.html
    }
});

// Function to set the minimum date for Date From and Date To fields
function setMinDateForDateFields() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateFrom').setAttribute('min', today);
    document.getElementById('dateTo').setAttribute('min', today);
}

// Call the function to set the minimum date on page load
setMinDateForDateFields();

document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    });

    if (response.ok) {
        const result = await response.json();

        if (result.success) {
            const tableBody = document.querySelector('table tbody');
            const newRow = document.createElement('tr');
            const leaveType = formData.get('leaveType');
            const dateFrom = formData.get('dateFrom');
            const dateTo = formData.get('dateTo');
            const status = result.status || "Pending";

            newRow.innerHTML = `
            <td>${leaveType}</td>
            <td>${dateFrom} to ${dateTo}</td>
            <td>${status}</td>
        `;
            tableBody.appendChild(newRow);

            const noDataRow = document.getElementById('no-data-row');
            if (noDataRow) {
                noDataRow.style.display = 'none';
            }

            const modal = bootstrap.Modal.getInstance(document.getElementById('leaveModal'));
            modal.hide();
            form.reset();
        }
    }
});