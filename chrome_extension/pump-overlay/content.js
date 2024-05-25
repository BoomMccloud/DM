console.log('Initializing content script');

// Call the setupElements function to initialize the script
setupElements();

// Variable to store the timestamp of the last celebration
let lastCelebrationTimestamp = 0;

// Set to keep track of processed transactions
const processedTransactions = new Set();

// Function to capture and log the "Market cap" value
function captureMarketCap() {
    // Select the parent div with the specific classes
    const parentDiv = document.querySelector('div.text-xs.text-green-300.flex.w-full.justify-between.items-center');
    
    // Check if the parent div exists
    if (parentDiv) {
        // Find all child div elements within the parent div
        const childDivs = parentDiv.querySelectorAll('div');

        // Loop through each child div element
        childDivs.forEach(div => {
            // Check if the div contains the text "Market cap:"
            if (div.textContent.includes('Market cap:')) {
                // Extract the market cap value
                const marketCapText = div.textContent;
                const marketCapMatch = marketCapText.match(/Market cap: \$(\d+,\d+\.\d+)/);
                
                if (marketCapMatch) {
                    const marketCapValue = marketCapMatch[1];
                    console.log('Market cap value:', marketCapValue);
                    
                    // Remove commas and convert to a number for comparison
                    const marketCapNumber = parseFloat(marketCapValue.replace(/,/g, ''));
                    
                    // Check if the market cap value is greater than $5000.00
                    if (marketCapNumber > 5000.00) {
                        // Get the current timestamp
                        const currentTimestamp = Date.now();
                        
                    // Check if the last celebration was more than 30 seconds ago
                    console.log('Time since last celebration:', currentTimestamp - lastCelebrationTimestamp);
                    if (currentTimestamp - lastCelebrationTimestamp > 15000) {
                        console.log('Triggering celebration...');
                        triggerFireworks(7000);
                        // Update the last celebration timestamp
                        lastCelebrationTimestamp = currentTimestamp;
                    } else {
                        console.log('Celebration skipped due to cooldown period.');
                    }
                    }
                }
            }
        });
    } else {
        console.log('Parent div not found.');
    }
}

// Function to capture unique user transactions
function captureUniqueTransactions() {
    // Select all transaction elements
    const transactionElements = document.querySelectorAll('div.text-xs.my-1.bg-\\[\\#2e303a\\].rounded-lg.grid.grid-cols-4.sm\\:grid-cols-6.items-start');

    transactionElements.forEach(transactionElement => {
        // Extract the transaction ID from the href attribute of the last child element
        const transactionLink = transactionElement.querySelector('a[href*="solscan.io/tx/"]');
        if (transactionLink) {
            const transactionId = transactionLink.getAttribute('href').split('/').pop();

            // Check if the transaction ID is already processed
            if (!processedTransactions.has(transactionId)) {
                // Add transaction ID to the set
                processedTransactions.add(transactionId);

                // Extract additional details for the sentence
                const usernameElement = transactionElement.querySelector('button span span');
                const actionElement = transactionElement.querySelector('div.text-green-300, div.text-red-300');
                const amountElements = transactionElement.querySelectorAll('div.p-3.text-left.overflow-hidden.whitespace-nowrap');

                if (usernameElement && actionElement && amountElements.length >= 2) {
                    const username = usernameElement.textContent.trim();
                    const action = actionElement.textContent.trim();
                    const amount = amountElements[1].textContent.trim(); // Selecting the second element

                    const actionWord = action.toLowerCase().includes('buy') ? 'bought' : 'sold';
                    const sentence = `${username} ${actionWord} ${amount}!`;

                    // Output the sentence to the console
                    console.log('Transaction:', sentence);
                }
            }
        }
    });
}

// Observe changes in the DOM to handle dynamic content loading
const observer = new MutationObserver((mutationsList, observer) => {
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
            captureMarketCap();
            captureUniqueTransactions();
        }
    });
});

// Start observing the document body for added nodes
observer.observe(document.body, { childList: true, subtree: true });

// Run the functions once the DOM is fully loaded
window.addEventListener('load', () => {
    captureMarketCap();
    captureUniqueTransactions();
});