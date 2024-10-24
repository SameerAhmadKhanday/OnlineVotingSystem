async function vote(party) {
    const userId = prompt("Enter your User ID to vote:");
    
    if (!userId) {
        alert("User ID is required!");
        return;
    }

    const response = await fetch('/vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-ID': userId
        },
        body: JSON.stringify({ party }),
    });
    
    const result = await response.json();
    document.getElementById('message').innerText = result.message;
}

async function getResults() {
    const response = await fetch('/results');

    if (!response.ok) {
        alert('Failed to fetch results.');
        return;
    }

    const results = await response.json();

    let resultsText = '';
    let winningParty = '';
    let maxVotes = 0;
    let tiedParties = []; // Array to hold parties with the maximum votes

    for (const party in results) {
        resultsText += `${party}: ${results[party].count} votes<br>`;
        resultsText += `Voted by: ${results[party].users.join(', ')}<br><br>`;

        // Check for the maximum votes
        if (results[party].count > maxVotes) {
            maxVotes = results[party].count;
            winningParty = party;
            tiedParties = [party]; // Reset the tie list with the new winning party
        } else if (results[party].count === maxVotes) {
            tiedParties.push(party); // Add to the tie list if votes are equal
        }
    }

    // Display the results
    const resultContainer = `<div class="results-container">`;
    
    if (tiedParties.length > 1) {
        resultsText += `<div class="winning-party" style="font-weight: bold; text-align: center;">There is a tie between: ${tiedParties.join(' and ')}</div>`;
    } else {
        // Only one winner
        resultsText += `<div class="winning-party" style="font-weight: bold; text-align: center;">Winning Party: ${winningParty} with ${maxVotes} votes</div>`;
        
        // Calculate margin for other parties
        const margins = {};
        for (const party in results) {
            if (party !== winningParty) {
                margins[party] = maxVotes - results[party].count;
                resultsText += `<div class="margin-info" style="text-align: center;">${party} is behind by ${margins[party]} votes</div>`;
            }
        }
    }

    document.getElementById('results').innerHTML = resultContainer + resultsText + '</div>';
}
