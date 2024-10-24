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
    const results = await response.json();
    
    let resultsText = '';
    for (const party in results) {
        resultsText += `${party}: ${results[party].count} votes<br>`;
        resultsText += `Voted by: ${results[party].users.join(', ')}<br><br>`; // Display user IDs
    }
    
    document.getElementById('results').innerHTML = resultsText;
}
