// Initialize challenges from localStorage or default
let challenges = JSON.parse(localStorage.getItem('challenges')) || {
    xss: false,
    sql: false,
    clickjacking: false,
    redirect: false,
};

function saveChallenges() {
    localStorage.setItem('challenges', JSON.stringify(challenges));
}

function updateScore() {
    const score = Object.values(challenges).filter(Boolean).length;
    document.getElementById('score').textContent = `Score: ${score}/4`;

    if (score === 4) {
        alert('Congratulations! You completed all challenges!');
        const link = document.createElement('a');
        link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('CTF{all_challenges_completed}');
        link.download = '..\\assets\\CalebAfework2024Resume.docx';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    saveChallenges(); // Save progress to localStorage
}

// XSS Challenge
document.getElementById('xss-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const input = document.getElementById('xss-input').value;
    const xssOutput = document.getElementById('xss-output'); // Output feedback element
    document.getElementById('xss-input').innerHTML = input;
    if (input.includes('<script>')) {
        xssOutput.textContent = '🎉 XSS successful!';
        challenges.xss = true;
        document.getElementById('challenge-xss').classList.add('completed');
        updateScore();
    } else {
        xssOutput.textContent = '🚫 Invalid XSS payload. Try again.';
    }
});

// SQL Injection Challenge
document.getElementById('sql-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('sql-username').value;
    const password = document.getElementById('sql-password').value;
    const sqlOutput = document.getElementById('sql-output'); // Output feedback element
    
    // Reset output on every attempt
    sqlOutput.textContent = '';

    if (username === 'admin' && password.includes("' OR 1=1 --")) {
        sqlOutput.textContent = '🎉 SQL Injection successful!';
        challenges.sql = true;
        document.getElementById('challenge-sql').classList.add('completed');
        updateScore();
    } else {
        sqlOutput.textContent = '🚫 Invalid SQL Injection attempt.';
    }
});


// Clickjacking Challenge
document.getElementById('clickjacking-button').addEventListener('click', function () {
    const clickjackingOutput = document.getElementById('clickjacking-output'); // Output feedback element
    if (!challenges.clickjacking) {
        clickjackingOutput.textContent = '🎉 Clickjacking successful!';
        challenges.clickjacking = true;
        document.getElementById('challenge-clickjacking').classList.add('completed');
        updateScore();
    } else {
        clickjackingOutput.textContent = '🚫 You already completed this challenge.';
    }
});

// Open Redirect Challenge
document.getElementById('redirect-button').addEventListener('click', function () {
    const newRedirect = '?redirect=http://example.com'; // Simulated new URL
    history.pushState(null, '', newRedirect); // Update URL without navigation

    // Re-parse URL parameters after updating the URL
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    const redirectOutput = document.getElementById('redirect-output'); // Output feedback element

    // Check if the redirect parameter is correct
    if (redirect === 'http://flag.com') {
        redirectOutput.textContent = '🎉 Redirect successful!';
        if (!challenges.redirect) {
            challenges.redirect = true;
            document.getElementById('challenge-redirect').classList.add('completed');
            updateScore();
        }
    } else {
        redirectOutput.textContent = `🚫 Invalid redirect target: ${redirect || 'None'}. Try again.`;
    }
});

// Check for challenges on page load
document.addEventListener('DOMContentLoaded', function () {
    updateScore();
    Object.keys(challenges).forEach(key => {
        if (challenges[key]) {
            document.getElementById(`challenge-${key}`).classList.add('completed');
        }
    });
});
