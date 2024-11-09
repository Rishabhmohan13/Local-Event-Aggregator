let userData = undefined;
let isLoggedIn = false;
let eventData;

function formatDate(isoDate) {
    const date = new Date(isoDate);

    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
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
            userData = data.userData;
    
            if (isLoggedIn) {

                const loginButton = document.getElementById('login-button');
                loginButton.style.display = "none";

                const accountButton = document.getElementById('account-button');
                accountButton.style.display = "block";
    
                const userName = document.getElementById('user-name');
                userName.textContent = userData.name;

                const userEmail = document.getElementById('user-email');
                userEmail.textContent = userData.email;

                getUserListings();
                getUserBookings();

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

document.getElementById('event-submit').addEventListener('click', async function() {

    event.preventDefault();

    const name = document.getElementById('event-name').value;
    const category = document.getElementById('event-category').value;
    const venue = document.getElementById('event-venue').value;
    const city = document.getElementById('event-city').value;
    const about = document.getElementById('event-about').value;
    const desc = document.getElementById('event-desc').value;
    const startDate = document.getElementById('start-date').value;
    const startTime = document.getElementById('start-time').value;
    const endDate = document.getElementById('end-date').value;
    const endTime = document.getElementById('end-time').value;
    const language = document.getElementById('event-language').value;
    const minutes = document.getElementById('event-minutes').value;
    const price = document.getElementById('event-price').value;
    const image = document.querySelector('#imageInput').files[0];

    // console.log(image);

    const start = new Date(`${startDate}T${startTime}`).toISOString();
    const end = new Date(`${endDate}T${endTime}`).toISOString();

    const formData = new FormData();
    formData.append('userID', userData._id);
    formData.append('eventName', name);
    formData.append('eventCategory', category);
    formData.append('eventLanguage', language);
    formData.append('eventMinutes', minutes);
    formData.append('eventStartDate', start);
    formData.append('eventEndDate', end);
    formData.append('eventVenue', venue);
    formData.append('eventCity', city);
    formData.append('eventPrice', price);
    formData.append('eventDesc', desc);
    formData.append('eventAbout', about);
    // formData.append('eventImage', document.querySelector('#imageInput').files[0]);

    // formData.append('userID', userData._id);
    // formData.append('eventName', "name");
    // formData.append('eventCategory', "category");
    // formData.append('eventLanguage', "language");
    // formData.append('eventMinutes', "minutes");
    // formData.append('eventStartDate', "start");
    // formData.append('eventEndDate', "end");
    // formData.append('eventLocation', "location");
    // formData.append('eventPrice', 150);
    // formData.append('eventDesc', "desc");
    // formData.append('eventAbout', "about");
    formData.append('eventImage', image);
    formData.append('eventImageURL', '');

    fetch('http://127.0.0.01:4000/api/v1/events', {
        method: 'POST',
        body: formData
        // body: JSON.stringify({
        //     userID: userData._id,
        //     eventName: name,
        //     eventCategory: category,
        //     eventLanguage: language,
        //     eventMinutes: minutes,
        //     eventStartDate: start,
        //     eventEndDate: end,
        //     eventLocation: location,
        //     eventPrice: 150,
        //     eventDesc: desc,
        //     eventAbout: about,
        //     eventImage: image,
        // })
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


function getUserListings(route, tabID) {

    // console.log('http://127.0.0.1:4000/api/v1/' + route + '/' + userData._id);

    fetch('http://127.0.0.1:4000/api/v1/events/user/' + userData._id)
    .then(response => response.json())
    .then(data => {

        //console.log(data);

        const events = data.event;

        //console.log(events);

        const listingTabContainer = document.getElementById('listing-tab-content');
        
        events.forEach((event) => {
           //console.log(event); // Logging each event to check
            
            const eventDiv = createEventElement(event);
            listingTabContainer.appendChild(eventDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching events:', error.message);
        alert('Error fetching events. Please try again.');
    });

    function createEventElement(event) {

        const template = document.getElementById('listing-template');
        const eventDiv = template.content.cloneNode(true);
        const event_ = eventDiv.querySelector('.event-box');
        event_.setAttribute('id', event._id);

        // const headerDiv = stockDiv.querySelector('.stock-header');
        // headerDiv.setAttribute('onclick', `toggleMarketDepth('${stock._id}')`);

        // const depthDiv = stockDiv.querySelector('.market-depth');

        updateEventData(eventDiv, event);
        // openOrderContainer(depthDiv);

        return eventDiv;
    }

    function updateEventData(eventDiv, event) {

        //console.log(event);

        const eventName = eventDiv.querySelector('.event-name');
        eventName.textContent = event.eventName;

        const eventAbout = eventDiv.querySelector('.event-about');
        eventAbout.textContent = event.eventDesc;

        const eventDate = eventDiv.querySelector('.event-date');
        eventDate.textContent = formatDate(event.eventStartDate);

        const eventImage = eventDiv.querySelector('.event-image');
        eventImage.src = event.eventImageURL;
        
        const eventLink = eventDiv.querySelector('.event-link');
        eventLink.href = 'event-detail2.html?id=' + event._id;
    }

}

function getUserBookings() {

    // console.log('http://127.0.0.1:4000/api/v1/' + route + '/' + userData._id);

    fetch('http://127.0.0.1:4000/api/v1/orders/' + userData._id)
    .then(response => response.json())
    .then(data => {

        //console.log(data);

        const events = data.order;

        //console.log(events);

        const listingTabContainer = document.getElementById('order-tab-content');
        
        events.forEach((event) => {
          // console.log(event); // Logging each event to check
            
            const eventDiv = createEventElement(event);
            listingTabContainer.appendChild(eventDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching events:', error.message);
        alert('Error fetching events. Please try again.');
    });

    function createEventElement(event) {

        const template = document.getElementById('order-template');
        const eventDiv = template.content.cloneNode(true);
        //const event_ = stockDiv.querySelector('.event-box');
        //event_.setAttribute('id', event._id);

        // const headerDiv = stockDiv.querySelector('.stock-header');
        // headerDiv.setAttribute('onclick', `toggleMarketDepth('${stock._id}')`);


        // const depthDiv = stockDiv.querySelector('.market-depth');

        updateEventData(eventDiv, event);
        // openOrderContainer(depthDiv);

        return eventDiv;
    }

    function updateEventData(eventDiv, event) {

        //console.log(event);

        const eventName = eventDiv.querySelector('.event-name');
        eventName.textContent = event.eventName;

        const orderPrice = eventDiv.querySelector('.order-price');
        orderPrice.textContent = event.orderPrice;

        const eventDate = eventDiv.querySelector('.event-date');
        eventDate.textContent = formatDate(event.eventStartDate);

        const quantity = eventDiv.querySelector('.order-quantity');
        quantity.textContent = event.quantity;

        const eventImage = eventDiv.querySelector('.event-image');
        eventImage.src = event.eventImageURL;
        
        const eventLink = eventDiv.querySelector('.event-link');
        eventLink.href = 'event-detail2.html?id=' + event.eventID;
    }

}

document.getElementById('logout-button').addEventListener('click', async function() {

    fetch('http://127.0.0.1:4000/api/v1/users/logout', { // Corrected the URL
        method: 'POST',
        credentials: 'include'
    })
    .then(async response => {
        const contentType = response.headers.get('content-type');

        // Check if the response is in JSON format
        if (contentType && contentType.includes('application/json')) {
            return response.json();  // Parse as JSON
        } else {
            return response.text();  // Parse as text
        }
    })
    .then(data => {
        console.log('Success:', data);

        // Redirect to the homepage or login page after successful logout
        window.location.href = 'index.html'; 
    })
    .catch((error) => {
        console.error('Error:', error);

        // Updated error message for logout
        alert('Logout failed. Please try again.');
    });


});

async function deleteEvent(event, eventID)
{

    event.preventDefault();

    console.log(eventID);

    try {
        const response = await fetch('http://127.0.0.1:4000/api/v1/events/' + eventID, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // console.log(response);

        if (response.ok) {
            // const data = await response.json();
            // alert(`Event deleted: ${JSON.stringify(data)}`);

            // const eventBox = document.getElementById(eventId); // Use the event ID to find the correct box
            // if (eventBox) {
            //     eventBox.remove(); // Remove the event box from the DOM
            // }

            window.location.href = 'add-listing.html'; 

        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
        closeModal(); // Close the modal after deletion
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

function openEdit(event, button) {

    event.preventDefault();
    document.getElementById('edit-tab-content').style.display = 'block';

    const tabContents = document.querySelectorAll('.tab-pane');
    tabContents.forEach(content => {
        content.classList.remove('active', 'show');
    });

    // Add 'active' class to the selected tab
    const selectedTab = document.getElementById('add-tab8');
    selectedTab.classList.add('active', 'show');

    const eventBoxID = button.closest('.event-box').id;

    console.log(eventBoxID);

    fetch('http://127.0.0.1:4000/api/v1/events/' + eventBoxID)
    .then(response => response.json())
    .then(data => {

        eventData = data.event;

        console.log(event);

        setValue(eventData);

        
    })
    .catch(error => {
        console.error('Error fetching events:', error.message);
        alert('Error fetching events. Please try again.');
    });

    function setValue(event) {

        const name = document.getElementById('edit-event-name');
        const category = document.getElementById('edit-event-category');
        const venue = document.getElementById('edit-event-venue');
        const city = document.getElementById('edit-event-city');
        const about = document.getElementById('edit-event-about');
        const desc = document.getElementById('edit-event-desc');
        const startDate = document.getElementById('edit-start-date');
        const startTime = document.getElementById('edit-start-time');
        const endDate = document.getElementById('edit-end-date');
        const endTime = document.getElementById('edit-end-time');
        const language = document.getElementById('edit-event-language');
        const minutes = document.getElementById('edit-event-minutes');
        const price = document.getElementById('edit-event-price');
        // const image = document.getElementById('edit-event-image');

        name.value = event.eventName;
        category.value = event.eventCategory;
        venue.value = event.eventVenue;
        city.value = event.eventCity;
        about.value = event.eventAbout;
        desc.value = event.eventDesc;

        let datePart = event.eventStartDate.split('T')[0];
        startDate.value = datePart;
        
        let dateObj = new Date(event.eventStartDate);
        let hours = String(dateObj.getHours()).padStart(2, '0');
        let minutes_ = String(dateObj.getMinutes()).padStart(2, '0');

        let timePart = `${hours}:${minutes_}`;
        startTime.value = timePart;

        datePart = event.eventEndDate.split('T')[0];
        endDate.value = datePart;

        dateObj = new Date(event.eventEndDate);
        hours = String(dateObj.getHours()).padStart(2, '0');
        minutes_ = String(dateObj.getMinutes()).padStart(2, '0');

        timePart = `${hours}:${minutes_}`;
        endTime.value = timePart;

        language.value = event.eventLanguage;
        minutes.value = event.eventMinutes;
        price.value = event.eventPrice;

        //image.value = event.eventImageURL;

        // console.log(image.value);

    }
}

document.getElementById('edit-submit').addEventListener('click', async function() {

    event.preventDefault();

    const name = document.getElementById('edit-event-name').value;
    const category = document.getElementById('edit-event-category').value;
    const venue = document.getElementById('edit-event-venue').value;
    const city = document.getElementById('edit-event-city').value;
    const about = document.getElementById('edit-event-about').value;
    const desc = document.getElementById('edit-event-desc').value;
    const startDate = document.getElementById('edit-start-date').value;
    const startTime = document.getElementById('edit-start-time').value;
    const endDate = document.getElementById('edit-end-date').value;
    const endTime = document.getElementById('edit-end-time').value;
    const language = document.getElementById('edit-event-language').value;
    const minutes = document.getElementById('edit-event-minutes').value;
    const price = document.getElementById('edit-event-price').value;
    const image = document.getElementById('edit-event-image').files[0];

    console.log(image);

    const start = new Date(`${startDate}T${startTime}`).toISOString();
    const end = new Date(`${endDate}T${endTime}`).toISOString();

    console.log(start);
    console.log(end);

    const formData = new FormData();

    formData.append('userID', userData._id);
    formData.append('eventName', name);
    formData.append('eventCategory', category);
    formData.append('eventLanguage', language);
    formData.append('eventMinutes', minutes);
    formData.append('eventStartDate', start);
    formData.append('eventEndDate', end);
    formData.append('eventVenue', venue);
    formData.append('eventCity', city);
    formData.append('eventPrice', price);
    formData.append('eventDesc', desc);
    formData.append('eventAbout', about);
    formData.append('eventImage', image);
    formData.append('eventImageURL', eventData.eventImageURL);

    // if(name != eventData.eventName)
    //     formData.append('eventName', name);

    // if(category != eventData.eventCategory)
    //     formData.append('eventCategory', category);

    // if(language != eventData.eventLanguage);
    //     formData.append('eventLanguage', language);

    // if(minutes != eventData.eventMinutes)
    //     formData.append('eventMinutes', minutes);

    // if(start != eventData.eventStartDate)
    //     formData.append('eventStartDate', start);

    // if(end != eventData.eventEndDate)
    //     formData.append('eventEndDate', end);

    // if(venue != eventData.eventVenue)
    //     formData.append('eventVenue', venue);

    // if(city != eventData.eventCity)
    //     formData.append('eventCity', city);

    // if(price != eventData.eventPrice)
    //     formData.append('eventPrice', price);

    // if(desc != eventData.eventDesc)
    //     formData.append('eventDesc', desc);

    // if(about != eventData.eventAbout)
    //     formData.append('eventAbout', about);
   

    // formData.append('eventImage', image);
    // formData.append('eventImageURL', '');

    

    fetch('http://127.0.0.01:4000/api/v1/events/' + eventData._id, {
        method: 'PATCH',
        body: formData
       
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data); 
        window.location.href = 'event-detail2.html?id=' + data.event._id;
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Signup failed. Please check your information and try again.');
    });
});
