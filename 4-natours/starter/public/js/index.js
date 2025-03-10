/* eslint-disable */
import '@babel/polyfill';
import {displayMap} from './mapbox.js'
import { login,logout } from './login.js'
import {updateSettings} from './updateSettings.js'
import { bookTour } from './stripe.js'
//import { setTourUserIds } from '../../controllers/reviewController.js';

// DOM ELEMENT
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login')
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');




if(mapBox){
    const locations = JSON.parse(document.getElementById("map").dataset.locations);
    displayMap(locations);
}



if(loginForm)
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email,password);

});

if(logOutBtn){
    logOutBtn.addEventListener('click', e => {
        e.preventDefault();
        //console.log('logOutBtn clicked');
        logout();
    })

}

if(userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();

        form.append('name',document.getElementById('name').value);
        form.append('email',document.getElementById('email').value);
        form.append('photo',document.getElementById('photo').files[0]);

        console.log("Form Geliyor : ")
        console.log(form)
        
        updateSettings(form,'data');
    }

)};    

if(userPasswordForm) {
    userPasswordForm.addEventListener('submit',async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating ....'
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        
        await updateSettings({passwordCurrent,password,passwordConfirm},'password');

        document.querySelector('.btn--save-password').textContent = 'Save password.'
        document.getElementById('password-current').value = ''
        document.getElementById('password').value = ''
        document.getElementById('password-confirm').value = ''
})};    

if(bookBtn){
    bookBtn.addEventListener('click', e => {
        console.log('bookBtn clicked');
        e.target.textContent = 'Processing...';
        const {tourId} = e.target.dataset;
        console.log(tourId);
        bookTour(tourId)
    })
}

