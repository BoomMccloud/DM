console.log('Initializing content script');

// Call the setupElements function to initialize the script
setupElements();

// Variable to store the timestamp of the last celebration
let lastCelebrationTimestamp = 0;

// Variable to store the market cap value at the last fireworks trigger
let lastMarketCapForFireworks = 0;

// Variable to store the most recent transaction ID
let lastTransactionId = '';

// Function to extract and log the "Market cap" value
function extractMarketCap() {
    // Select the parent div with the specific classes
    const parentDiv = document.querySelector('div.text-xs.text-green-300.flex.w-full.justify-between.items-center');
    
    // Check if the parent div exists
    if (parentDiv) {
        // Find all child div elements within the parent div
        const childDivs = parentDiv.querySelectorAll('div');

        // Loop through each child div element
        for (const div of childDivs) {
            // Check if the div contains the text "Market cap:"
            if (div.textContent.includes('Market cap:')) {
                // Extract the market cap value
                const marketCapText = div.textContent;
                const marketCapMatch = marketCapText.match(/Market cap: \$(\d+,\d+\.\d+)/);
                
                if (marketCapMatch) {
                    const marketCapValue = marketCapMatch[1];
                    console.log('Market cap value:', marketCapValue);
                    return parseFloat(marketCapValue.replace(/,/g, ''));
                }
            }
        }
    } else {
        console.log('Parent div not found.');
    }
    return null;
}

// Function to check if fireworks should be triggered
function checkAndTriggerFireworks(marketCap) {
    if (marketCap !== null) {
        // Check if the market cap value is greater than $5000.00 and $5000 higher than the last trigger value
        if (marketCap > 5000.00 && (marketCap >= lastMarketCapForFireworks + 5000 || lastMarketCapForFireworks === 0)) {
            // Get the current timestamp
            const currentTimestamp = Date.now();
            
            // Check if the last celebration was more than 30 seconds ago
            console.log('Time since last celebration:', currentTimestamp - lastCelebrationTimestamp);
            if (currentTimestamp - lastCelebrationTimestamp > 5000) {
                console.log('Triggering celebration...');
                triggerFireworks(7000);
                // Update the last celebration timestamp and market cap
                lastCelebrationTimestamp = currentTimestamp;
                lastMarketCapForFireworks = marketCap;
            } else {
                console.log('Celebration skipped due to cooldown period.');
            }
        }
    }
}

// Function to process new transactions
function processTransaction(transactionElement) {
    // Extract the transaction ID from the href attribute of the last child element
    const transactionLink = transactionElement.querySelector('a[href*="solscan.io/tx/"]');
    if (transactionLink) {
        const transactionId = transactionLink.getAttribute('href').split('/').pop();

        // Check if the transaction ID is the same as the last processed transaction
        if (transactionId !== lastTransactionId) {
            // Update the lastTransactionId to the current one
            lastTransactionId = transactionId;

            // Extract additional details for the sentence
            const usernameElement = transactionElement.querySelector('div.py-3.pl-2.text-left.flex.items-center.flex-wrap button span span');
            const actionElement = transactionElement.querySelector('div.p-3.text-left.text-green-300.hidden.sm\\:block, div.p-3.text-left.text-red-300.hidden.sm\\:block');
            const amountElements = transactionElement.querySelectorAll('div.p-3.text-left.overflow-hidden.whitespace-nowrap');

            if (usernameElement && actionElement && amountElements.length >= 2) {
                const username = usernameElement.textContent.trim();
                const action = actionElement.textContent.trim();
                const amount = amountElements[1].textContent.trim(); // Selecting the second element

                const actionWord = action.toLowerCase().includes('buy') ? 'bought' : 'sold';
                const sentence = `${username} ${actionWord} ${amount}!`;

                // Output the sentence to the console
                console.log('Transaction:', sentence);
                window.createFloatingDiv(sentence, 12000);
            }
        } else {
            console.log('Duplicate transaction detected, skipping...');
        }
    }
}

// Function to capture the most recent transaction
function captureMostRecentTransaction() {
    const transactionContainer = document.querySelector('div.w-full.text-xs.sm\\:text-sm.text-gray-400.bg-transparent.rounded-lg');
    if (transactionContainer) {
        const transactionElements = transactionContainer.querySelectorAll('div.text-xs.my-1.bg-\\[\\#2e303a\\].rounded-lg.grid.grid-cols-4.sm\\:grid-cols-6.items-start');
        if (transactionElements.length > 0) {
            const mostRecentTransaction = transactionElements[0];
            console.log('Most recent transaction detected:', mostRecentTransaction);
            processTransaction(mostRecentTransaction);
        }
    }
}

// Function to handle observed mutations
function handleMutations(mutationsList) {
    // console.log('Mutation observed:', mutationsList);

    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            captureMostRecentTransaction();
        }
        // Check and possibly trigger fireworks based on the updated market cap
        const marketCap = extractMarketCap();
        checkAndTriggerFireworks(marketCap);
    });
}

// Observe changes in the DOM to handle dynamic content loading
const observer = new MutationObserver(handleMutations);

// Start observing the document body for added nodes
observer.observe(document.body, { childList: true, subtree: true });

// Run the functions once the DOM is fully loaded
window.addEventListener('load', () => {
    const marketCap = extractMarketCap();
    checkAndTriggerFireworks(marketCap);
    captureMostRecentTransaction();
});