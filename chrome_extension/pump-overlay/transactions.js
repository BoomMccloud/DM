console.log('Initializing transactions.js');

// Set to keep track of processed transactions
const processedTransactions = new Set();

// Function to trigger animation for a new transaction
function triggerTransactionAnimation(transaction) {
    console.log('New transaction:', transaction);
    // Add your animation logic here
}

// Function to process transactions
function getTransactions() {
    // Select all transaction elements
    const transactions = document.querySelectorAll('div.text-xs.my-1.bg-[#2e303a].rounded-lg.grid.grid-cols-4.sm\\:grid-cols-6.items-start');

    transactions.forEach(transaction => {
        // Extract the transaction ID from the href attribute of the last child element
        const transactionLink = transaction.querySelector('a[href*="solscan.io/tx/"]');
        if (transactionLink) {
            const transactionId = transactionLink.getAttribute('href').split('/').pop();

            // Check if the transaction ID is already processed
            if (!processedTransactions.has(transactionId)) {
                // Add transaction ID to the set
                processedTransactions.add(transactionId);

                // Trigger animation for the new transaction
                triggerTransactionAnimation(transaction);
            }
        }
    });
}

// Observe changes in the DOM to handle dynamic content loading
const transactionObserver = new MutationObserver((mutationsList, observer) => {
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
            getTransactions();
        }
    });
});

// Start observing the transaction list element for added nodes
const transactionListElement = document.querySelector('div.transaction-list'); // Adjust the selector to the parent element of transactions
if (transactionListElement) {
    transactionObserver.observe(transactionListElement, { childList: true, subtree: true });
}

// Initial processing of transactions on page load
window.addEventListener('load', getTransactions);

// Expose the function to the global scope
window.getTransactions = getTransactions;
