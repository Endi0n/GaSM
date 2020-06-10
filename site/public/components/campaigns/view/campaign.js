import Component from '/scripts/bee/Component.js'

class XCampaign extends Component {
    constructor(data) {
        super()
        
        this.data = data
    }

    async componentDidLoad() {
        $(this).find('.title').text(this.data.title)
        $(this).find('.description').text(this.data.content)
        $(this).find('.address').text(this.data.location)
        $(this).find('.date').html(this.data.date)
    }
}

Component.define('x-campaign', XCampaign, {
    template: '/components/campaigns/view/campaign.html',
    styles: [
        '/components/campaigns/view/view_campaigns.css'
    ]
})
