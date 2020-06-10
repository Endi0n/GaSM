import * as routes from '/scripts/routes.js'
import Component from '/scripts/bee/Component.js'

class XCampaigns extends Component {
    async componentDidLoad() {
        const xInfiniteScroll = this.getElementsByTagName('x-infinite-scroll')[0]
        await xInfiniteScroll.loadFrom(routes.VIEW_CAMPAIGNS_ROUTE)
    }

	async componentDidLoad2() {
        const container = document.getElementById('container');
        const loading = document.querySelector('.loading');

        axios.get(routes.VIEW_CAMPAIGNS_ROUTE)
                .then(resp => addDataToDOM(resp.data))
                .catch(err => console.log(err))

        window.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            
            if(clientHeight + scrollTop >= scrollHeight - 5) {
                showLoading()
            }
        });

        function showLoading() {
            console.log('herre')
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
