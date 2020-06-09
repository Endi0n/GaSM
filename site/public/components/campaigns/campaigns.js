import * as routes from '/scripts/routes.js'
import Component from '/scripts/bee/Component.js'

class XCampaigns extends Component {
	async componentDidLoad() {
        const form = document.getElementById('form');
        const formular = document.getElementById('formular');
        const content = document.getElementById('content');
        const title = document.getElementById('title');
        const date = document.getElementById('date');
        const address =  document.getElementById('address');

        let ok = 0;
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

        if (vh < 800 && vw > 900) {
            formular.style.overflowY = "scroll";
            formular.style.height = "60vh";
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            checkInputs();
        })

        function checkInputs() {
            const titleValue = title.value.trim();
            const contentValue = content.value.trim();
            const dateValue = date.value;
            const addressValue = address.value.trim();
        

            if (titleValue === '') {
                setErrorFor(title, 'Titlul trebuie completat.');
            } else {
                setSuccessFor(title);
            }

            if (contentValue === '') {
                setErrorFor(content, 'Continutul trebuie completat.');
            } else {
                setSuccessFor(content);
            }

            if (dateValue === '') {
                setErrorFor(date, 'Data trebuie completata.');
            } else {
                setSuccessFor(date);
            }

            if (addressValue === '') {
                setErrorFor(address, 'Adresa trebuie completata.');
            } else {
                setSuccessFor(address);
            }


            if (!ok) {
                const formData = new FormData(document.getElementsByTagName('form')[0]);
                const jsonFormData = JSON.stringify(Object.fromEntries(formData));
                /*
                axios.post(routes.CAMPAIGNS_ROUTE, jsonFormData)
                .then(resp => console.log(resp))
                .catch(err => console.log(err.response))
                */
            }

            ok = 0;
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

    }
}

Component.define('x-campaigns', XCampaigns, {
    template: '/components/campaigns/campaigns.html',

    styles: [
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap',

        '/components/auth/auth.css'
    ],

    scripts: ['https://kit.fontawesome.com/df8e637184.js']
})
