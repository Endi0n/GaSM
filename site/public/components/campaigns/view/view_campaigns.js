import * as routes from '/scripts/routes.js'
import Component from '/scripts/bee/Component.js'

class XCampaigns extends Component {
    async componentDidLoad() {
        const xInfiniteScroll = this.getElementsByTagName('x-infinite-scroll')[0]
        await xInfiniteScroll.loadFrom(routes.VIEW_CAMPAIGNS_ROUTE)
    }
}

Component.define('x-campaigns', XCampaigns, {
    template: '/components/campaigns/view/view_campaigns.html',

    styles: [
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap',

        '/components/campaigns/view/view_campaigns.css'
    ],

    scripts: ['https://kit.fontawesome.com/df8e637184.js', 'https://cdn.jsdelivr.net/momentjs/latest/moment.min.js']

})
