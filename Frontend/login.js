document.getElementById('loginForm').addEventListener('submit', function(event) {

    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Username:', email);
    console.log('Password:', password);

    fetch('http://127.0.0.1:4000/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer token'
            },
            credentials: 'include',
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.href = 'add-listing.html';
        })
        .catch((error) => {
            //console.error('Error:', error);
            alert('Login failed. Please check your credentials and try again.');
        });
});

document.getElementById('sign-up').addEventListener('submit', function(event) {

    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('semail').value;
    const password = document.getElementById('spass').value;
    const repassword = document.getElementById('srpass').value;
    const phone = document.getElementById('sphone').value;
    const user = document.getElementById('suser').value;

    console.log(`Name: ${name}, Email: ${email}, Password: ${password}, Re-Password: ${repassword}, Phone: ${phone}, Username: ${user}`);

    fetch('http://127.0.0.1:4000/api/v1/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            username: user,
            phone: phone,
            email: email,
            password: password,
            passwordConfirm: repassword
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        window.location.href = 'add-listing.html';
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Signup failed. Please check your information and try again.');
    });
});