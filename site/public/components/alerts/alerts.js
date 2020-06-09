import Component from '/scripts/bee/Component.js'

class XAlerts extends Component {
	async componentDidLoad() {
        const form = document.getElementById('form');
        const title = document.getElementById('title');
        const content = document.getElementById('content');
        const address = document.getElementById('address');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            checkInputs();
        })

        function checkInputs() {
            const titleValue = title.value.trim();   
            const contentValue = content.value.trim(); 
            const addressValue = address.value.trim();      

            if (titlelValue === '') {
                setErrorFor(title, 'Titlul trebuie completat.');
            } else {
                setSuccessFor(title);
            }

            if (contentValue === '') {
                setErrorFor(content, 'Descrierea trebuie completata.');
            } else {
                setSuccessFor(content);
            }

            if (addresslValue === '') {
                setErrorFor(address, 'Adresa trebuie completat.');
            } else {
                setSuccessFor(address);
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

    }
}

Component.define('x-alerts', XAlerts, {
    template: '/components/alerts/alerts.html',

    styles: [
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap',

        '/components/auth/auth.css'
    ],

    scripts: ['https://kit.fontawesome.com/df8e637184.js']
})
