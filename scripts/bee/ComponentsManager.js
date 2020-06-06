export default class ComponentsManager {
    static components = {}

    static _templates = {}

    static _loadedResources = {}

    static async define(name, cls, props) {
        cls.componentName = name
        cls.template = props.template
        cls.styles = props.styles
        cls.scripts = props.scripts
        cls.lazyScripts = props.lazyScripts

        ComponentsManager.components[name] = cls

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
            if (!(style in ComponentsManager._loadedResources)) {
                let styleEl = document.createElement('link')
                styleEl.rel = 'stylesheet'
                styleEl.href = style

                document.head.appendChild(styleEl)

                ComponentsManager._loadedResources[style] = { count: 0, element: styleEl }
            }

            ComponentsManager._loadedResources[style].count += 1
        }

        for (let script of component.scripts || []) {
            if (!(script in ComponentsManager._loadedResources)) {
                let scriptEl = document.createElement('script')
                scriptEl.type = 'text/javascript'

                let scriptPromise = new Promise(
                    resolve => scriptEl.onload = resolve
                )

                scriptEl.src = script
                document.head.appendChild(scriptEl)

                await scriptPromise

                ComponentsManager._loadedResources[script] = { count: 0, element: scriptEl }
            }

            ComponentsManager._loadedResources[script].count += 1
        }
    }

    static loadLazyDependencies(component) {
        for (let script of component.lazyScripts || []) {
            if (!(script in ComponentsManager._loadedResources)) {
                let scriptEl = document.createElement('script')
                scriptEl.type = 'text/javascript'

                scriptEl.src = script
                document.body.appendChild(scriptEl)

                ComponentsManager._loadedResources[script] = { count: 0, element: scriptEl }
            }

            ComponentsManager._loadedResources[script].count += 1
        }
    }

    static _removeDependenciesCascade(component) {
        if (!component.tagName) return

        for (const subComponent of component.childNodes)
            ComponentsManager._removeDependenciesCascade(subComponent)
        
        const componentCls = ComponentsManager.components[component.tagName.toLowerCase()]
        if (!componentCls) return

        for (const resource of [...componentCls.styles || [], ...componentCls.scripts || [], ...componentCls.lazyScripts || []])
            ComponentsManager._loadedResources[resource].count -= 1    
    }
    
    static removeDependencies(component) {
        ComponentsManager._removeDependenciesCascade(component)
        
        for (const [key, value] of Object.entries(ComponentsManager._loadedResources)) {
            if (value.count < 1) {
                value.element.remove()
                delete ComponentsManager._loadedResources[key]
            }
        }
            
    }
}
