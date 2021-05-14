let showLogin

window.onload = () => {

    let items = document.getElementsByTagName('form')
    toggle.onclick = () => {
        items[0].classList.toggle('hidden')
        items[1].classList.toggle('hidden')
    }
    document.querySelectorAll('form span.toggle').forEach(e => {
        e.onclick = () => {
            items[1].classList.toggle('hidden')
            items[3].classList.toggle('hidden')
        }
    });

    showLogin = () => {
      if(document.querySelector('#login').classList.contains('hidden')) {
        document.querySelector('#login').classList.remove('hidden')
      } else {document.querySelector('#login').classList.add('hidden')}
    }
  }