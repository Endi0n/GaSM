import Component from '/scripts/bee/Component.js'
import BComponent from '/scripts/bee/components/BComponent.js'

class XInfiniteScroll extends Component {
    constructor() {
        super()

        this.component = this.attributes.component.value
        this.canLoadMore = true
    }

    async componentDidLoad() {
        this.elements =this.getElementsByClassName('x-infinite-scroll-elements')[0]
        this.loadingAnimation = this.getElementsByClassName('x-infinite-scroll-loading')[0]
        
        this.scrollListenerCallback = this._scrollListener.bind(this)
    }

    async loadFrom(endpoint) {
        this.endpoint = endpoint

        const data = (await axios.get(endpoint)).data
        this.lastId = data[data.length - 1].id

        this.appendChildren(data)

        window.addEventListener('scroll', this.scrollListenerCallback)
    }

    appendChildren(data) {
        this.canLoadMore = data.length
        
        for (const el of data)
            this.elements.appendChild(new BComponent(this.component, el))
    }

    async _scrollListener() {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
        if (!(clientHeight + scrollTop >= scrollHeight - 5)) return
        
        this.loadMore()
    }

    async loadMore() {
        if (this.loading || !this.canLoadMore) return
        this.loading = true

        this.loadingAnimation.classList.add('show')

        const data = (await axios.get(this.endpoint)).data
        this.appendChildren(data)
        this.lastId = data[data.length - 1].id

        this.loading = false
    }
}

Component.define('x-infinite-scroll', XInfiniteScroll, {
    template: '/components/x-infinite-scroll/x-infinite-scroll.html',
    styles: [ '/components/x-infinite-scroll/x-infinite-scroll.css' ]
})
