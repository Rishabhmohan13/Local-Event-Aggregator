let isLoggedIn = false;

function formatDate(isoDate) {
    const date = new Date(isoDate);

    const dateOptions = {
        day: 'numeric',
        month: 'short'
    };

    const formattedDate = date.toLocaleString('en-US', dateOptions);  // e.g., "Monday, March 20, 2019"

    // Combine time and date with <br> after time
    return formattedDate;
}

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

    console.log('hello');

    fetch('http://127.0.0.1:4000/api/v1/events?upcoming=true')
    .then(response => response.json())
    .then(data => {
        const events = data.events;
        
        const eventContainer = document.getElementById('event-container');
        
        events.forEach((event) => {
            console.log(event); // Logging each event to check
            
            const eventDiv = createEventElement(event);
            eventContainer.appendChild(eventDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching events:', error.message);
        alert('Error fetching events. Please try again.');
    });

    function createEventElement(event) {

        const template = document.getElementById('upcoming-event');
        const eventDiv = template.content.cloneNode(true);
        // const event_ = eventDiv.querySelector('.event-link');
        // event_.setAttribute('data-event-id', event._id);

        // const headerDiv = stockDiv.querySelector('.stock-header');
        // headerDiv.setAttribute('onclick', `toggleMarketDepth('${stock._id}')`);


        // const depthDiv = stockDiv.querySelector('.market-depth');

        updateEventData(eventDiv, event);
        // openOrderContainer(depthDiv);

        return eventDiv;
    }

    function updateEventData(eventDiv, event) {

        // console.log(event);

        const eventName = eventDiv.querySelector('.event-name');
        eventName.textContent = event.eventName;

        const eventLocation = eventDiv.querySelector('.event-location');
        eventLocation.textContent = event.eventVenue;

        const eventDate = eventDiv.querySelector('.event-date');
        eventDate.textContent = formatDate(event.eventStartDate);

        const eventImage = eventDiv.querySelector('.event-image');
        eventImage.src = event.eventImageURL;
        
        const eventLink = eventDiv.querySelector('.event-link');
        eventLink.href = 'event-detail2.html?id=' + event._id;

    }

});