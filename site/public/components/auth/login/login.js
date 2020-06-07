import Component from '/scripts/bee/Component.js'

class XLogin extends Component {
	async componentDidLoad() {
        const form = document.getElementById('form');
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            checkInputs();
        })

        function checkInputs() {
            const emailValue = email.value.trim();
            const passwordValue = password.value.trim();

            if (emailValue === '') {
                setErrorFor(email, 'E-mailul trebuie completat.');
            } else if(!isEmail(emailValue)) {
                setErrorFor(email, 'E-mailul nu este valid.')
            } else {
                setSuccessFor(email);
            }

            if (passwordValue === '') {
                setErrorFor(password, 'Parola trebuie completata.');
            } else if (passwordValue.length < 7) {
                setErrorFor(password, 'Minim 7 caractere.')
            } else {
                setSuccessFor(password);
            }

        }

        function setErrorFor(input, message) {
            const formControl = input.parentElement;
            const small = formControl.querySelector('small');

            small.innerText = message;
            formControl.className = 'form-control error';
        }

        function setSuccessFor(input) {
            const formControl = input.parentElement;
            formControl.className = 'form-control success';
        }

        function isEmail(email) {
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
        }

    }
}

Component.define('x-login', XLogin, {
    template: '/components/auth/login/login.html',

    styles: [
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap',

        '/components/auth/auth.css'
    ],

    scripts: ['https://kit.fontawesome.com/df8e637184.js']
})
