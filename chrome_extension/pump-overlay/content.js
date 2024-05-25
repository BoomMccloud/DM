console.log('Initializing content script');

// Configuration values
const config = {
    animationDuration: 7000,
    transactionDisplayDuration: 6000,
    marketCapThreshold: 5000,
    celebrationCooldown: 30000,
    mutationThrottleTime: 500 // Minimum time between mutation handling in ms
};

// Call the setupElements function to initialize the script
setupElements();

// State variables
let lastCelebrationTimestamp = 0;
let lastMarketCapForFireworks = 0;
let lastTransactionId = '';
let lastMutationTimestamp = 0;

// Function to extract the "Market cap" value
function extractMarketCap() {
    const parentDiv = document.querySelector('div.text-xs.text-green-300.flex.w-full.justify-between.items-center');
    if (parentDiv) {
        const childDivs = parentDiv.querySelectorAll('div');
        for (const div of childDivs) {
            if (div.textContent.includes('Market cap:')) {
                const marketCapText = div.textContent;
                const marketCapMatch = marketCapText.match(/Market cap: \$(\d+,\d+\.\d+)/);
                if (marketCapMatch) {
                    return parseFloat(marketCapMatch[1].replace(/,/g, ''));
                }
            }
        }
    }
    console.log('Market cap parent div not found.');
    return null;
}

// Function to trigger fireworks if conditions are met
function checkAndTriggerFireworks(marketCap) {
    if (marketCap && marketCap > config.marketCapThreshold &&
        (marketCap >= lastMarketCapForFireworks + config.marketCapThreshold || lastMarketCapForFireworks === 0)) {
        const currentTimestamp = Date.now();
        if (currentTimestamp - lastCelebrationTimestamp > config.celebrationCooldown) {
            console.log('Triggering celebration...');
            triggerFireworks(config.animationDuration);
            lastCelebrationTimestamp = currentTimestamp;
            lastMarketCapForFireworks = marketCap;
        } else {
            console.log('Celebration skipped due to cooldown period.');
        }
    }
}

// Function to process new transactions
function processTransaction(transactionElement) {
    const transactionLink = transactionElement.querySelector('a[href*="solscan.io/tx/"]');
    if (transactionLink) {
        const transactionId = transactionLink.getAttribute('href').split('/').pop();
        if (transactionId !== lastTransactionId) {
            lastTransactionId = transactionId;
            const usernameElement = transactionElement.querySelector('div.py-3.pl-2.text-left.flex.items-center.flex-wrap button span span');
            const actionElement = transactionElement.querySelector('div.p-3.text-left.text-green-300.hidden.sm\\:block, div.p-3.text-left.text-red-300.hidden.sm\\:block');
            const amountElements = transactionElement.querySelectorAll('div.p-3.text-left.overflow-hidden.whitespace-nowrap');
            if (usernameElement && actionElement && amountElements.length >= 2) {
                const username = usernameElement.textContent.trim();
                const action = actionElement.textContent.trim();
                const amount = amountElements[1].textContent.trim();
                const actionWord = action.toLowerCase().includes('buy') ? 'bought' : 'sold';
                const sentence = `${username} ${actionWord} ${amount}!`;
                console.log('Transaction:', sentence);
                window.createFloatingDiv(sentence, config.transactionDisplayDuration);
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
            processTransaction(transactionElements[0]);
        }
    }
}

// Function to handle observed mutations
function handleMutations(mutationsList) {
    const currentTimestamp = Date.now();
    if (currentTimestamp - lastMutationTimestamp > config.mutationThrottleTime) {
        lastMutationTimestamp = currentTimestamp;
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                captureMostRecentTransaction();
            }
        });
        const marketCap = extractMarketCap();
        checkAndTriggerFireworks(marketCap);
    }
}

// Initialize the mutation observer
const observer = new MutationObserver(handleMutations);
observer.observe(document.body, { childList: true, subtree: true });

// Run the functions once the DOM is fully loaded
window.addEventListener('load', () => {
    const marketCap = extractMarketCap();
    checkAndTriggerFireworks(marketCap);
    captureMostRecentTransaction();
});
