export default class ComponentsManager {
    static components = {}

    static _templates = {}

    static _loaded_styles = {}
    static _loaded_scripts = {}

    static async define(name, cls, props) {
        cls.componentName = name
        cls.template = props.template
        cls.styles = props.styles
        cls.scripts = props.scripts
        cls.lazyScripts = props.lazyScripts

        ComponentsManager.components[name] = {
            class: cls,
            ...props
        }

        window.customElements.define(name, cls)
    }

    static async getTemplate(component) {
        if (!(component.template in ComponentsManager._templates))
            ComponentsManager._templates[component.template] = await ComponentsManager
                ._fetchTemplate(component.template)

        return ComponentsManager._templates[component.template]
    }

    static async _fetchTemplate(templateURL) {
        return (await fetch(templateURL)).text()
    }

    static async loadDependecies(component) {
        for (let style of component.styles || []) {
            if (!(style in ComponentsManager._loaded_styles)) {
                document.head.insertAdjacentHTML('beforeend', `<link rel='stylesheet' href='${style}' />`)
                ComponentsManager._loaded_styles[style] = 0
            }

            ComponentsManager._loaded_styles[style] += 1
        }

        for (let script of component.scripts || []) {
            if (!(script in ComponentsManager._loaded_scripts)) {
                let scriptEl = document.createElement('script')
                scriptEl.type = 'text/javascript'

                let scriptPromise = new Promise(
                    resolve => scriptEl.onload = () => resolve()
                )

                scriptEl.src = script
                document.head.appendChild(scriptEl)

                await scriptPromise

                ComponentsManager._loaded_scripts[script] = {count: 0, element: scriptEl}
            }

            ComponentsManager._loaded_scripts[script].count += 1
        }
    }

    static async loadLazyDependencies(component) {
        for (let script of component.lazyScripts || []) {
            if (!(script in ComponentsManager._loaded_scripts)) {
                let scriptEl = document.createElement('script')
                scriptEl.type = 'text/javascript'

                let scriptPromise = new Promise(
                    resolve => scriptEl.onload = () => resolve()
                )

                scriptEl.src = script
                document.body.appendChild(scriptEl)

                await scriptPromise

                ComponentsManager._loaded_scripts[script] = {count: 0, element: scriptEl}
            }

            ComponentsManager._loaded_scripts[script].count += 1
        }
    }
}
