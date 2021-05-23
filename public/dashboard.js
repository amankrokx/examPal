let myself, tests = [], startAll

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
            startAll()

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

function logout() {
    firebase.auth().signOut()
}
/*
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
}*/

// Grab tests...

startAll = () => {
    // Populate test...
    database.ref('users/'+myself.uid+'/tests').on('child_added', (data) => { 
        tests[data.key]= data.val()
        if(data.key.length > 0) {
            let temp = data.val()
            if (Object.keys(temp).length > 0 && temp != 'none') {
                document.querySelector('div.'+data.key+' div.lists h3.h').classList.add('hidden')
                for (prop in temp) {
                    document.querySelector('div.'+data.key+' div.lists').innerHTML += '<div class="list"><span class="material-icons">event</span><span class="name">'+prop+'</span><div class="time"><span>MAY 14, 2021</span><br><span>05:36 PM</span></div><span class="aname">'+temp[prop].Author+'</span><span class="material-icons">play_arrow</span></div>'
                }
            } else {
                document.querySelector('div.'+data.key+' div.lists').innerHTML = '<center><h3>No Tests ! Enjoy</h3></center>'
            }

        }
    })

    // Check if Teacher...
    database.ref('users/'+myself.uid+'/type').once('value').then((snapshot) => {
        myself.designation = snapshot.val()
        if(myself.designation == 'teacher') {document.querySelector('span.con').innerHTML = 'Create Test'}
        else if(myself.designation == 'student') {document.querySelector('span.con').innerHTML = 'Join Test'}
      })
}