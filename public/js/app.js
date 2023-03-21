const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const message1 = document.querySelector('#message1')
const message2 = document.querySelector('#message2')
const message3 = document.querySelector('#message3') 
const icon = document.querySelector('img') 


weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    message1.textContent = 'Loading....'
    message2.textContent = ''
    message3.textContent = ''



    fetch('/weather?address='+search.value).then((response) => {
        response.json().then((data) => {
            if(data.error) {
                message1.textContent = data.error
                message2.textContent = ''
                message3.textContent = ''
            }
            else {
                message1.textContent = "Weather for: "+data.location+ ", "+data.region+ ", "+data.country
                message2.textContent = "Local time: "+data.time
                message3.textContent = "It is "+data.temperature+" degrees outside, feels like "+data.feels_like+", "+data.current_weather+"."
                icon.setAttribute('src', data.icon)
            }
        })
    })
})