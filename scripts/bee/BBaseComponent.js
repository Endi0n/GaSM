import BComponentsManager from './BComponentsManager.js'

export default class BBaseComponent extends HTMLElement {
    // https://gist.github.com/franktopel/5d760330a936e32644660774ccba58a7

    constructor(...args) {
        const self = super(...args)
        self.parsed = false // guard to make it easy to do certain stuff only once
        self.parentNodes = []
        return self
    }
    
    async _init() {
        // collect the parentNodes
        let el = this
        while (el.parentNode) {
          el = el.parentNode
          this.parentNodes.push(el)
        }

        // check if the parser has already passed the end tag of the component
        // in which case this element, or one of its parents, should have a nextSibling
        // if not (no whitespace at all between tags and no nextElementSiblings either)
        // resort to DOMContentLoaded or load having triggered
        if ([this, ...this.parentNodes].some(el => el.nextSibling) || document.readyState !== 'loading') {
            this.componentDidLoad()
        } else {
            this.mutationObserver = new MutationObserver(async () => {
                if ([this, ...this.parentNodes].some(el => el.nextSibling) || document.readyState !== 'loading') {
                    await this.componentDidLoad()
                    this.mutationObserver.disconnect()
                }
            });
    
            this.mutationObserver.observe(this, {childList: true})
        }
    }

    async connectedCallback() {
        await this.componentDidMount()
		await this._init()
    }

    async componentDidLoad() {}

    async componentDidMount() { }

    async loadComponentFrom(componentURL) {
        this.innerHTML = await BComponentsManager.load(componentURL)
    }
}
