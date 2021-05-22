let myself

let database = firebase.database()

let readFromAsync = async(path) => {
    return new Promise(async function(resolve, reject) {
        database.ref(path).once('value').then((snapshot) => {
            resolve(snapshot.val())
          })
    })
}

// Check Auth Before Proceeding
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        console.log(user)
        if (user.uid.length > 0) {
            myself = user
            document.querySelector('div.top div.login:first-of-type').classList.add('hidden')
            document.querySelector('div.top div.logout').classList.remove('hidden')
            document.querySelector('div.bottom span.logout').classList.remove('hidden')
            checkDetails()
        } else {document.querySelector('#login').classList.remove('hidden')}
        //
    } else {
        // User is signed out.
        console.log('not logged')
        localStorage.clear()
        window.location = './index.html'
    }
});

let checkDetails = () => {
    if(myself.displayName) {document.querySelector('#myprofile input.name').value = myself.displayName}
    else {document.querySelector('#myprofile input.name').classList.add('empty')}
    if(myself.email) {document.querySelector('#myprofile input.email').value = myself.email}
    else {document.querySelector('#myprofile input.email').classList.add('empty')}
    if(myself.phoneNumber) {document.querySelector('#myprofile input.phone').value = myself.phoneNumber}
    else {document.querySelector('#myprofile input.email').classList.add('empty')}
    if(myself.photoURL) {document.querySelector('#myprofile img').src = myself.photoURL}
    else {document.querySelector('#myprofile img').classList.add('empty')}
}

let finaliseProfile = (pUrl) => {
    let curr = firebase.auth().currentUser;
    
        curr.updateProfile({
            displayName: document.querySelector('#myprofile input.name').value,
            photoURL: pUrl
            }).then(function() {
            // Update successful.
            curr.updateEmail(document.querySelector('#myprofile input.email').value).then(function() {
                // Update successful.
                alert('Values Updated !')
                window.location.reload
              }).catch(function(error) {
                // An error happened.
                console.log(error)
            });
        }).catch(function(error) {
            // An error happened.
            console.log(error)
        });
}

let updateProfile = () => {
    if (document.querySelector('#myprofile input.name').value && document.querySelector('#myprofile input.email').value) {
        let filelist = document.querySelector('#myprofile input.photo').files
        console.log(filelist)
        if(filelist.length > 0) {
            let fileName = document.querySelector('#myprofile input.photo').value;
            let extension = fileName.split('.').pop();
            console.log(extension)
            let storageRef = firebase.storage().ref()
            let photoRef = storageRef.child('photos/'+myself.uid+'.'+extension)

            photoRef.put(filelist[0]).then((snapshot) => {
                console.log('Uploaded a blob or file!');
              });

              photoRef.getDownloadURL()
              .then((url) => {
                // Insert url into an <img> tag to "download"
                finaliseProfile(url)
                console.log(url)
            })
            .catch((error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                finaliseProfile(null)
                console.log(error)
              });

        } else {finaliseProfile(null)}

    }
}

// Grab Login...
document.querySelector('#main form.login input.submit').onclick = function(e) {
    //e.preventDefault()
    let userid = document.querySelector('#main form.login input.email').value
    let password = document.querySelector('#main form.login input.password').value
    //st()
    firebase.auth().signInWithEmailAndPassword(userid, password).catch(function(error) {
        // Handle Errors here. 
        //ht()
        console.error(error)
        alert(error.message)
    });
}

// Grab Signup...
document.querySelector('#main form.signup input.submit').onclick = function(e) {
    let userid = document.querySelector('#main form.signup input.email').value
    let password = document.querySelector('#main form.signup input.password').value
    //st()
    firebase.auth().createUserWithEmailAndPassword(userid, password).catch(function(error) {
        // Handle Errors here.
        //ht()
        var errorMessage = error.message
        console.error(errorMessage, error)
    });
}

// Create a Recaptcha verifier instance globally
// Calls submitPhoneNumberAuth() when the captcha is verified
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container", {
        size: "invisible",
        callback: function(response) {
            submitPhoneNumberAuth();
        },
        'expired-callback': function() {
            // Response expired. Ask user to solve reCAPTCHA again.
            // ...
            alert('ReCaptcha Loading Failed')
        }

    }
);
// This function runs when the 'sign-in-button' is clicked
// Takes the value from the 'phoneNumber' input and sends SMS to that phone number
function submitPhoneNumberAuth() {
    let phone = document.querySelector('#main form.signup_phone input.phone').value
    var appVerifier = window.recaptchaVerifier;
    //st()
    firebase
        .auth()
        .signInWithPhoneNumber(phone, appVerifier)
        .then(function(confirmationResult) {
            window.confirmationResult = confirmationResult;
            //ht()
            alert('OTP Sent Successfully !')
            document.querySelector('form.signup_phone input:last-of-type').classList.add('submit')
        })
        .catch(function(error) {
            //ht()
            console.log(error);

            grecaptcha.reset(window.recaptchaWidgetId);

            // Or, if you haven't stored the widget ID:
            window.recaptchaVerifier.render().then(function(widgetId) {
                grecaptcha.reset(widgetId);
            })

            alert(error.message)
        });
}

// This function runs when the 'confirm-code' button is clicked
// Takes the value from the 'code' input and submits the code to verify the phone number
// Return a user object if the authentication was successful, and auth is complete
function submitPhoneNumberAuthCode() {
    let code = document.querySelector('#main form.signup_phone input.otp').value
    if (code.length < 5) {
        alert('Invalid OTP')
        return
    }
    //st()
    confirmationResult.confirm(code).then(function(result) {
            //ht()
            var user = result.user;
            console.log(user);
        }).catch(function(error) {
            console.log(error);
            //ht()

            alert('Wrong OTP or Network Issue')
        });
}

//Google auth
let Gprovider = new firebase.auth.GoogleAuthProvider();

function googleLogin() {
firebase.auth()
    .signInWithPopup(Gprovider)
    .then((result) => {
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
    }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    });
}

//Facebook Auth
let Fprovider = new firebase.auth.FacebookAuthProvider();

function facebookLogin() {

firebase
    .auth()
    .signInWithPopup(Fprovider)
    .then((result) => {
    console.log(result)
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
    })
    .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
    });
}

var Tprovider = new firebase.auth.TwitterAuthProvider();

function twitterLogin() {
firebase
    .auth()
    .signInWithPopup(Tprovider)
    .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
    // You can use these server side with your app's credentials to access the Twitter API.
    var token = credential.accessToken;
    var secret = credential.secret;

    // The signed-in user info.
    var user = result.user;
    // ...
    }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    });

}

function logout() {
firebase.auth().signOut()
}

//      CHARTS...
google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Year', 'Sales', 'Expenses'],
        ['2004',  1000,      400],
        ['2005',  1170,      460],
        ['2006',  660,       1120],
        ['2007',  1030,      540]
    ]);

    var options = {
        title: 'Company Performance',
        curveType: 'function',
        chartArea: {
            backgroundColor: {
              fill: '#FF0000',
              fillOpacity: 0
            },
          },
          // Colors the entire chart area, simple version
          // backgroundColor: '#FF0000',
          // Colors the entire chart area, with opacity
          backgroundColor: {
            fill: '#FF0000',
            fillOpacity: 0
          },
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}