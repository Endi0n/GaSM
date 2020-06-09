import * as routes from '/scripts/routes.js'
import Component from '/scripts/bee/Component.js'

class XCampaigns extends Component {
	async componentDidLoad() {
        const container = document.getElementById('container');
        const loading = document.querySelector('.loading');

        axios.get(routes.VIEW_CAMPAIGNS_ROUTE)
                .then(resp => addDataToDOM(resp.data))
                .catch(err => console.log(err))

        function addDataToDOM(resp) {
            const postElement = document.createElement('div');
            for (let i = 0; i < resp.length; i++) {
                postElement.classList.add('campaign');
                postElement.innerHTML = `
                <h2 class="title">${resp[i].title}</h2>
                <p class="description">${resp[i].content}</p>

                <a href="${resp[i].id}">Citeste mai mult</a>
                
                <div class="info">
                <div>
                <h4>Adresa</h4>
                    <span class="address">${resp[i].location}</span>
                </div>
                <div>
                <h4>Data</h4>
                    <span class="name">${resp[i].date}</span>
                </div>
                <div>
                <h4>Organizator</h4>
                
                </div>
                `;
                container.appendChild(postElement);
            }
            loading.classList.remove('show');
        }

        window.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            
            if(clientHeight + scrollTop >= scrollHeight - 5) {
                showLoading();
            }
        });

        function showLoading() {
            loading.classList.add('show');
            axios.get(routes.VIEW_CAMPAIGNS_ROUTE)
                .then(resp => addDataToDOM(resp.data))
                .catch(err => console.log(err))
        }

        
    }
}

Component.define('x-campaigns', XCampaigns, {
    template: '/components/campaigns/view/view_campaigns.html',

    styles: [
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap',

        '/components/campaigns/view/view_campaigns.css'
    ],

    scripts: ['https://kit.fontawesome.com/df8e637184.js']
})
