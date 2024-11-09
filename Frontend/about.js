document.addEventListener('DOMContentLoaded', function() {

    async function checkUserLoggedIn() {
        try {
            const response = await fetch('http://127.0.0.1:4000/api/v1/users/checkLoggedIn', {
                credentials: 'include' // Ensure cookies are sent with the request
            });
            const data = await response.json();
        
            isLoggedIn = data.isLoggedIn;
    
            if (isLoggedIn) {

                const loginButton = document.getElementById('login-button');
                loginButton.style.display = "none";

                const accountButton = document.getElementById('account-button');
                accountButton.style.display = "block";
                

            } else {
                const loginButton = document.getElementById('login-button');
                loginButton.style.display = "block";

                const accountButton = document.getElementById('account-button');
                accountButton.style.display = "none";
            }
    
        } catch (error) {
            console.error('Error checking user login status:', error);
        }
    }
    
    checkUserLoggedIn();
});