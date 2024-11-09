const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

let userData = undefined;
let isLoggedIn = false;

let eventData;

function formatDate(isoDate) {
    const date = new Date(isoDate);

    // Get parts of the date
    const timeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };

    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    // Format time and date separately
    const time = date.toLocaleString('en-US', timeOptions);  // e.g., "8:00 AM"
    const formattedDate = date.toLocaleString('en-US', dateOptions);  // e.g., "Monday, March 20, 2019"

    // Combine time and date with <br> after time
    return `${time} <br> ${formattedDate}`;
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


    fetch('http://127.0.0.1:4000/api/v1/events/' + eventId)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            // console.log(data.event.eventName);

            eventData = data.event;

            const eventName = document.getElementById('event-name');
            eventName.textContent = data.event.eventName;

            const eventLine = document.getElementById('event-line');
            eventLine.textContent = data.event.eventCategory + ' | ' +  data.event.eventLanguage + ' | ' + data.event.eventMinutes + ' mins';

            const startTime = document.getElementById('start-time');
            startTime.innerHTML = formatDate(data.event.eventStartDate);

            const endTime = document.getElementById('end-time');
            endTime.innerHTML = formatDate(data.event.eventEndDate);

            const location = document.getElementById('location');
            location.textContent = data.event.eventVenue + ', ' + data.event.eventCity;

            const desc = document.getElementById('desc');
            desc.textContent = data.event.eventDesc;

            const about = document.getElementById('about');
            about.textContent = data.event.eventAbout;

            const price = document.getElementById('price');
            price.textContent = '₹' + data.event.eventPrice;

            const image = document.getElementById('event-image');
            image.src = data.event.eventImageURL;

        })
        .catch(error => {
            console.error('Error fetching event:', error.message);
            alert('Error fetching event. Please try again.');
    });

});

async function buyOrder()
{
    const quantity = document.getElementById('quantity').value;

    const orderPrice = quantity * eventData.eventPrice;

    const response = await fetch('http://127.0.0.1:4000/api/v1/orders/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 
            JSON.stringify({ 
                amount:orderPrice, 
                currency: 'INR', 
                receipt: 'receipt#1'            
            })
      });

      const order = await response.json();

      console.log(order);

      // Open Razorpay Checkout
      const options = {
        key: 'rzp_test_EWswSbF12I4zgV', 
        amount: order.amount, 
        currency: 'INR',
        order_id: order.id,
        handler: async function (response) {
            console.log(response);
    
            const paymentDetails = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
            };
    
            const res = await fetch('http://127.0.0.1:4000/api/v1/orders/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentDetails),
            });
    
            const data = await res.json();
            if (data.success) {
                
                fetch('http://127.0.0.1:4000/api/v1/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userID: userData._id,
                        userEmail: userData.email,
                        userName: userData.name,
                        eventID: eventId,
                        eventName: eventData.eventName,
                        eventStartDate: eventData.eventStartDate,
                        eventAbout: eventData.eventAbout,
                        eventImageURL: eventData.eventImageURL,
                        quantity: quantity,
                        orderPrice: orderPrice
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);

                    fetch('http://127.0.0.1:4000/api/v1/orders/email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data.order)
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
    
                        alert("Payment Successful");
                        window.location.href = 'add-listing.html';
                    })

                    alert("Payment Successful");
                    window.location.href = 'add-listing.html';
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Signup failed. Please check your information and try again.');
                });
                
            } else {
                alert("Payment verification failed!");
            }
        },
        prefill: {
          contact: userData.phone
        },
        theme: {
          color: '#F37254'
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
}

// document.getElementById('buy-btn').addEventListener('submit', function(event) {
//     event.preventDefault();

//     console.log('hell');

    

// });