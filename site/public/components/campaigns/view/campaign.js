import Component from '/scripts/bee/Component.js'

class XCampaign extends Component {
    constructor(data) {
        super()
        
        this.data = data
    }

    async componentDidLoad() {
        $(this).find('.title').html(this.data.title)
        $(this).find('.description').html(this.data.content)
        $(this).find('.address').html(this.data.address)
        $(this).find('.date').html(this.data.date)
    }
}

Component.define('x-campaign', XCampaign, {
    template: '/components/campaigns/view/campaign.html',
})
