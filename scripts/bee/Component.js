import ComponentsManager from './ComponentsManager.js'

export default class Component extends HTMLElement {
    // https://gist.github.com/franktopel/5d760330a936e32644660774ccba58a7

    constructor(...args) {
        super(...args)
        this.parsed = false // guard to make it easy to do certain stuff only once
        this.parentNodes = []
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

    static define(name, cls, props) {
        ComponentsManager.define(name, cls, props)
    }

    async _loadTemplateFrom(templateURL) {
        this.innerHTML = await ComponentsManager._loadURL(templateURL)
    }

    async _loadScriptsFrom(scriptsURLs) {

    }

    async _loadStylesFrom(stylesURLs) {

    }

    async connectedCallback() {
        await ComponentsManager.loadDependecies(this.constructor)

        if (this.constructor.template)
            this.innerHTML = await ComponentsManager.getComponent(this.constructor.template)
    
        await this.componentDidMount()
		await this._init()
    }

    async componentDidMount() { }

    async componentDidLoad() {}
}
