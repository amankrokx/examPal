// https://cdn.jsdelivr.net/npm/baffle@0.3.6/dist/baffle.min.js
const btnreveal=document.querySelector(".btn_reveal");
const text=baffle(".card h2");
text.set({
	charecters:'██▒ ▓▒▒█▓ █>░▒< ▓▒░ ░>▓█░ ▒█<▒ █▓▓ /▓>> /░░░', //if ntg mentioned in charecter then nothing is visible
	speed: 120
});
text.start();
btnreveal.addEventListener("click", e =>{
	text.reveal(2000);//2000 is for timimg
})

// to disappear reveal button after clicking
var a;
function show_hide()
{
	if (a==1){
		document.getElementById("reveal").style.display="inline";
		// block can also be written instead of inline
	}
	else{
		document.getElementById("reveal").style.display="none";
		return a=1;
	}
}

/*data saving js*/ /*it is available in techwebs.in (first login and then copy code)*/
const scriptURL = 'https://script.google.com/macros/s/AKfycbynIeGWIHiyplQT09ry7zx1GwahYXiB89Ubz3-gTmqnv5-1Jhn-/exec'	
            const form = document.forms['submit_to_google_sheet']
          
            form.addEventListener('submit', e => {
              e.preventDefault()
              fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                .then(response => alert("Thanks for Contacting us..! We Will Contact You Soon..."))
                .catch(error => console.error('Error!', error.message))
            })
