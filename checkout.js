document.addEventListener('DOMContentLoaded', function () {
    // Load order summary from local storage
    loadOrderSummary();

    // Add event listener for the proceed to checkout button
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (validateForm()) {
            displayThankYouMessage();
        }
    });

    // Restrict input length for specific fields
    addInputRestrictions();

    // Format credit card input
    formatCreditCardInput();
});

// Load order summary from local storage
function loadOrderSummary() {
    const orderSummaryBody = document.getElementById('order-summary-body');
    const totalPriceElement = document.getElementById('order-summary-total');
    const storedItems = JSON.parse(localStorage.getItem('orderSummary')) || [];
    const totalPrice = localStorage.getItem('totalPrice') || 0;

    orderSummaryBody.innerHTML = '';

    storedItems.forEach(item => {
        const { itemName, itemQuantity, itemPrice } = item;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${itemName}</td>
            <td>${itemQuantity}</td>
            <td>${itemPrice}</td>
        `;
        orderSummaryBody.appendChild(row);
    });

    totalPriceElement.innerText = `Rs. ${parseFloat(totalPrice.replace('Rs. ', '')).toFixed(2)}`;
}

// Restrict input length for credit card, CVV, and ZIP code fields
function addInputRestrictions() {
    const creditCardInput = document.querySelector('input[aria-label="card"]');
    const cvvInput = document.querySelector('input[aria-label="cvv"]');
    const zipInput = document.querySelector('input[aria-label="zip"]');

    creditCardInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 16); // Only allow digits, max 16
    });

    cvvInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 3); // Only allow digits, max 3
    });

    zipInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 5); // Only allow digits, max 5
    });
}

// Format the credit card input with hyphens every 4 digits
function formatCreditCardInput() {
    const creditCardInput = document.querySelector('input[aria-label="card"]');

    creditCardInput.addEventListener('input', function () {
        // Remove non-digit characters
        let rawValue = this.value.replace(/\D/g, '');

        // Limit to 16 digits
        rawValue = rawValue.slice(0, 16);

        // Format with hyphens
        let formattedValue = '';
        for (let i = 0; i < rawValue.length; i += 4) {
            if (i > 0) formattedValue += '-';
            formattedValue += rawValue.substring(i, i + 4);
        }

        // Set the formatted value back to the input
        this.value = formattedValue;
    });
}

// Validate checkout form
function validateForm() {
    const inputs = document.querySelectorAll('input[required]');
    let valid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            valid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return valid;
}

// Display thank you message and redirect after closing
function displayThankYouMessage() {
    const thankYouMessage = document.getElementById('thank-you-message');
    const deliveryDateElement = document.getElementById('delivery-date');
    deliveryDateElement.innerText = getDeliveryDate();
    thankYouMessage.style.display = 'flex';

    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', function () {
        thankYouMessage.style.display = 'none';

        // Redirect to the Pharmacy page
        window.location.href = './index.html'; // Update the URL as per your Pharmacy page path
    });
}

// Calculate delivery date (2 days from now)
function getDeliveryDate() {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 2);

    return deliveryDate.toDateString();
}
