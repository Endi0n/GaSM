import * as routes from '/scripts/routes.js'
import Component from '/scripts/bee/Component.js'
import Authentication from '/scripts/auth.js'
import BState from '/scripts/bee/BState.js'

class XRegister extends Component {
	async componentDidLoad() {
        const form = document.getElementById('form');
        const formular = document.getElementById('formular');
        const email = document.getElementById('email');
        const name = document.getElementById('name');
        const surname = document.getElementById('surname');
        const phone =  document.getElementById('phone');
        const address =  document.getElementById('address');
        const password = document.getElementById('password');
        const password2 = document.getElementById('password2');

        let ok = 0
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        console.log(vh);
        if (vh < 800) {
            formular.style.overflowY = "scroll";
            formular.style.height = "60vh";
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            checkInputs();
        })

        function checkInputs() {
            const nameValue = name.value.trim();
            const surnameValue = surname.value.trim();
            const emailValue = email.value.trim();
            const passwordValue = password.value.trim();
            const password2Value = password2.value.trim();
            const addressValue = address.value.trim();
            const phoneValue = phone.value.trim();
        

            if (nameValue === '') {
                setErrorFor(name, 'Numele trebuie completat.');
            } else {
                setSuccessFor(name);
            }

            if (surnameValue === '') {
                setErrorFor(surname, 'Prenumele trebuie completat.');
            } else {
                setSuccessFor(surname);
            }

            if (emailValue === '') {
                setErrorFor(email, 'E-mailul trebuie completat.');
            } else if(!isEmail(emailValue)) {
                setErrorFor(email, 'E-mailul nu este valid.')
            } else {
                setSuccessFor(email);
            }

            if (phoneValue === '') {
                setErrorFor(phone, 'Nr. de telefon trebuie completat.');
            } else if(!isPhone(phoneValue)) {
                setErrorFor(phone, 'Nr. de telefon nu este valid.')
            } else {
                setSuccessFor(phone);
            }

            if (addressValue === '') {
                setErrorFor(address, 'Adresa trebuie completata.');
            } else {
                setSuccessFor(address);
            }

            if (passwordValue === '') {
                setErrorFor(password, 'Parola trebuie completata.');
            } else if (passwordValue.length < 7) {
                setErrorFor(password, 'Minim 7 caractere.')
            } else {
                setSuccessFor(password);
            }

            if (password2Value === '') {
                setErrorFor(password2, 'Parola trebuie completata din nou.');
            } else if (password2Value != passwordValue) {
                setErrorFor(password2, 'Parolele nu coincid.')
            } else {
                setSuccessFor(password2);
            }

            if (!ok) {
                const formData = new FormData(document.getElementsByTagName('form')[0]);
                const jsonFormData = JSON.stringify(Object.fromEntries(formData));
                axios.post(routes.REGISTER_ROUTE, jsonFormData)
                .then(async resp => await onRegistrationSuccess(resp.data))
                .catch(err => console.log(err, err.data))
            }

            ok = 0;
        }

        async function onRegistrationSuccess(data) {
            const formData = new FormData(document.getElementsByTagName('form')[0]);
            const jsonFormData = JSON.stringify(Object.fromEntries(formData));

            Authentication.token = (await axios.post(routes.LOGIN_ROUTE, jsonFormData)).data.token

            if (BState.state && BState.state.refferal) {
                console.log(BState.state.refferal)
                BState.replaceState(BState.state.refferal)
                return
            }

            BState.pushState('/')
        }

        function setErrorFor(input, message) {
            const formControl = input.parentElement.parentElement;
            const small = formControl.querySelector('small');
            
            small.innerText = message;
            formControl.className = 'form-control error';
            ok++;
        }

        function setSuccessFor(input) {
            const formControl = input.parentElement.parentElement;
            formControl.className = 'form-control success';
        }

        function isEmail(email) {
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
        }

        function isPhone(phone) {
            return /^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/.test(phone);
        }
    }
}

Component.define('x-register', XRegister, {
    template: '/components/auth/register/register.html',

    styles: [
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap',

        '/components/auth/auth.css'
    ],

    scripts: ['https://kit.fontawesome.com/df8e637184.js']
})
