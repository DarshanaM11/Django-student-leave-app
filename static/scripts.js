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









document.addEventListener("DOMContentLoaded", () => {
    const editButtons = document.querySelectorAll(".edit-btn");
    const applyLeaveButton = document.getElementById("applyLeaveButton"); // Add the ID to the button
    const leaveForm = document.getElementById("leaveForm");

    // Populate modal fields when editing
    editButtons.forEach(button => {
        button.addEventListener("click", () => {
            const leaveId = button.getAttribute("data-id");
            const leaveType = button.getAttribute("data-leave-type");
            const dateFrom = button.getAttribute("data-date-from");
            const dateTo = button.getAttribute("data-date-to");
            const reason = button.getAttribute("data-reason");


            // Log the data to the console for debugging
            console.log("Edit button clicked:");
            console.log("Leave ID:", leaveId);
            console.log("Leave Type:", leaveType);
            console.log("Date From:", dateFrom);
            console.log("Date To:", dateTo);
            console.log("Reason:", reason);

            // Populate the modal form fields
            leaveForm.querySelector("#leaveType").value = leaveType;
            leaveForm.querySelector("#dateFrom").value = dateFrom;
            leaveForm.querySelector("#dateTo").value = dateTo;
            leaveForm.querySelector("#reason").value = reason;

            // Add a hidden input for the edit ID
            let editIdField = leaveForm.querySelector("input[name='editId']");
            if (!editIdField) {
                editIdField = document.createElement("input");
                editIdField.type = "hidden";
                editIdField.name = "editId";
                leaveForm.appendChild(editIdField);
            }
            editIdField.value = leaveId;
        });
    });

    // Clear modal fields for new leave application
    applyLeaveButton.addEventListener("click", () => {
        leaveForm.reset(); // Reset all fields in the form
        const editIdField = leaveForm.querySelector("input[name='editId']");
        if (editIdField) {
            editIdField.remove(); // Remove the edit ID hidden field
        }
    });
});


leaveForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(leaveForm);

    fetch(leaveForm.action, {
        method: "POST",
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log("Server Response:", data); // Debug: log the full response
            if (data.success) {
                alert(data.message || "Leave application submitted successfully!"); // Fallback message
                location.reload(); // Reload the table to reflect updates
            } else {
                alert(data.message || "Failed to update leave. Please try again."); // Fallback error message
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An unexpected error occurred. Please try again later.");
        });
});
