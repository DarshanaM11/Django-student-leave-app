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

document.addEventListener("DOMContentLoaded", () => {
    const leaveForm = document.getElementById("leaveForm");
    const applyLeaveButton = document.getElementById("applyLeaveButton");
    const editButtons = document.querySelectorAll(".edit-btn");

    // Function to format date to YYYY-MM-DD
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2); // Month is 0-based, so we add 1
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    // Populate modal fields when editing
    editButtons.forEach(button => {
        button.addEventListener("click", () => {
            const leaveId = button.getAttribute("data-id");
            const leaveType = button.getAttribute("data-leave-type");
            const dateFrom = button.getAttribute("data-date-from");
            const dateTo = button.getAttribute("data-date-to");
            const reason = button.getAttribute("data-reason");

            // Log the data to the console for debugging
            console.log("Edit button clicked:", { leaveId, leaveType, dateFrom, dateTo, reason });

            // Convert dateFrom and dateTo to YYYY-MM-DD format
            const formattedDateFrom = formatDate(dateFrom);
            const formattedDateTo = formatDate(dateTo);

            // Populate the modal form fields
            leaveForm.querySelector("#leaveType").value = leaveType;
            leaveForm.querySelector("#dateFrom").value = formattedDateFrom;
            leaveForm.querySelector("#dateTo").value = formattedDateTo;
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

    // Handle leave form submission
    leaveForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions by disabling the submit button
        const submitButton = leaveForm.querySelector("[type='submit']");
        submitButton.disabled = true;

        try {
            const formData = new FormData(leaveForm);
            const response = await fetch(leaveForm.action, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            console.log("Server Response:", data); // Debug: log the full response

            if (data.success) {
                alert(data.message || "Leave application submitted successfully!"); // Fallback message

                // Optionally, update the table here or reload the page
                location.reload(); // Reload to reflect updates
            } else {
                alert(data.message || "Failed to update leave. Please try again."); // Fallback error message
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An unexpected error occurred. Please try again later.");
        } finally {
            // Re-enable the submit button
            submitButton.disabled = false;
        }
    });
});
