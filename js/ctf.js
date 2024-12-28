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
        alert('Congratulations! You completed all challenges and stopped the hackers! As a reward, take this resume!');
        const link = document.createElement('a');
        link.href = '../assets/CalebAfework2025Resume.docx';
        link.download = 'CalebAfework2024Resume.docx';
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


//Email OSINT Challenge
document.getElementById('email-osint-button').addEventListener('click', function () {
    const emailInput = document.getElementById('email-osint-input').value.trim();
    const emailOutput = document.getElementById('email-osint-output'); // Output feedback element

    const correctEmail = 'calebafework@gmail.com'; 

    if (emailInput === correctEmail) {
        if (!challenges.emailOsint) {
            emailOutput.textContent = '🎉 Email OSINT successful!';
            challenges.emailOsint = true;
            document.getElementById('challenge-email-osint').classList.add('completed');
            updateScore();
        } else {
            emailOutput.textContent = '🚫 You already completed this challenge.';
        }
    } else {
        emailOutput.textContent = `🚫 Invalid email: ${emailInput || 'None'}. Try again.`;
    }

});

// Open Redirect Challenge
document.getElementById('redirect-button').addEventListener('click', function () {
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
