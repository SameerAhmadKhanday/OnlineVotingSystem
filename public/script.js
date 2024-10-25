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
        if (data.message.startsWith("Thank you")) {
            getResults(); // Update results after voting
        }
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

            for (const party in data) {
                resultsDiv.innerHTML += `<h4>${party}:</h4>`;
                resultsDiv.innerHTML += `<p>Votes: ${data[party].count} votes</p>`;
                resultsDiv.innerHTML += `<p>Users: ${data[party].users.join(', ')}</p>`; // Display users who voted for this party

                if (data[party].count > highestVotes) {
                    highestVotes = data[party].count;
                    winningParty = party;
                }
            }

            // Display the winning party
            if (winningParty) {
                resultsDiv.innerHTML += `<h3>Winning Party: ${winningParty} with ${highestVotes} votes</h3>`;
            }
        })
        .catch(error => {
            console.error('Error fetching results:', error);
            document.getElementById('results').innerText = "Error fetching results!";
        });
}
