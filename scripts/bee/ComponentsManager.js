export default class ComponentsManager {
    static components = {}

    static _loaded_styles = {}
    static _loaded_scripts = {}

    static async define(name, cls, props) {
        cls.componentName = name
        cls.template = props.template
        cls.styles = props.styles
        cls.scripts = props.scripts

        ComponentsManager.components[name] = {
            class: cls,
            ...props
        }

        window.customElements.define(name, cls)
    }

    static async getComponent(componentURL) {
        if (!(componentURL in ComponentsManager.components))
            ComponentsManager.components[componentURL] = await ComponentsManager
                ._loadComponent(componentURL)

        return ComponentsManager.components[componentURL]
    }

    static async _loadComponent(componentURL) {
        return (await fetch(componentURL)).text()
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
}
