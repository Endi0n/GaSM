import Component from '/scripts/bee/Component.js'

class XForgot extends Component {
	async componentDidLoad() {
        
        const form = document.getElementById('form');
        const email = document.getElementById('email');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            checkInputs();
        })

        function checkInputs() {
            const emailValue = email.value.trim();        

            if (emailValue === '') {
                setErrorFor(email, 'E-mailul trebuie completat.');
            } else if(!isEmail(emailValue)) {
                setErrorFor(email, 'E-mailul nu este valid.')
            } else {
                setSuccessFor(email);
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
            const small = formControl.querySelector('small');
            
            small.innerText = 'E-mailul pentru recuperarea parolei a fost trimis.';
            formControl.style['padding-bottom'] = "40px";
            formControl.className = 'form-control success send';
        }

        function isEmail(email) {
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
        }


    }
}

Component.define('x-forgot', XForgot, {
    template: '/components/auth/forgot_password/forgot_password.html',

    styles: [
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap',

        '/components/auth/auth.css'
    ],

    scripts: ['https://kit.fontawesome.com/df8e637184.js']
})
