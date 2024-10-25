// Function to handle voting
function vote(party) {
    const userId = prompt("Please enter your User ID:"); // Prompt for user ID
    if (!userId) {
        alert("User ID is required to vote!");
        return;
    }

    fetch('/vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'user-id': userId
        },
        body: JSON.stringify({ party })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').innerText = data.message;
        // Do not call getResults here
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = "Error in voting!";
    });
}

// Function to get and display results
function getResults() {
    fetch('/results')
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            let winningParty = '';
            let highestVotes = 0;
            let partiesWithSameVotes = [];

            for (const party in data) {
                resultsDiv.innerHTML += `<h4>${party}:</h4>`;
                resultsDiv.innerHTML += `<p>Votes: ${data[party].count} votes</p>`;
                resultsDiv.innerHTML += `<p>Users: ${data[party].users.join(', ')}</p>`; // Display users who voted for this party

                // Determine the highest votes and track possible ties
                if (data[party].count > highestVotes) {
                    highestVotes = data[party].count;
                    winningParty = party;
                    partiesWithSameVotes = [party]; // Reset the tie list
                } else if (data[party].count === highestVotes) {
                    partiesWithSameVotes.push(party); // Add to tie list
                }
            }

            // Display the winning party and margins
            const winningStatement = document.getElementById('winningStatement');
            const losingStatements = document.getElementById('losingStatements');
            winningStatement.style.display = 'none'; // Initially hide winning statement
            losingStatements.style.display = 'none'; // Initially hide losing statements

            if (winningParty) {
                winningStatement.innerText = `Winning Party: ${winningParty} with ${highestVotes} votes`;
                winningStatement.style.display = 'block'; // Show the winning statement

                // Calculate and display the margin of loss for other parties
                let losingText = '';
                for (const party in data) {
                    if (party !== winningParty) {
                        const margin = highestVotes - data[party].count;
                        losingText += `${party} lost by ${margin} votes<br>`; // Use <br> for line breaks
                    }
                }

                losingStatements.innerHTML = losingText;
                losingStatements.style.display = 'block'; // Show the losing statements
            }
        })
        .catch(error => {
            console.error('Error fetching results:', error);
            document.getElementById('results').innerText = "Error fetching results!";
        });
}
