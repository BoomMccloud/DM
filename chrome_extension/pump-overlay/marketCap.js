console.log('Initializing marketCap.js');

// Variable to store the timestamp of the last celebration
let lastCelebrationTimestamp = 0;

// Function to capture and log the "Market cap" value
function getMarketCap() {
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
                        if (currentTimestamp - lastCelebrationTimestamp > 30000) {
                            console.log('Triggering celebration...');
                            window.triggerFireworks(7000);
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

// Observe changes in the DOM to handle dynamic content loading
const marketCapObserver = new MutationObserver((mutationsList, observer) => {
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
            getMarketCap();
        }
    });
});

// Start observing the document body for added nodes
marketCapObserver.observe(document.body, { childList: true, subtree: true });

// Run the function once the DOM is fully loaded
window.addEventListener('load', getMarketCap);

// Expose the function to the global scope
window.getMarketCap = getMarketCap;
