export default class ComponentsManager {
    static components = {}

    static _templates = {}

    static _loadedResources = {}

    static async define(name, cls, props) {
        cls.componentName = name

        if (props) {
            cls.template = props.template
            cls.styles = props.styles
            cls.scripts = props.scripts
            cls.lazyScripts = props.lazyScripts
        }

        ComponentsManager.components[name] = cls

        window.customElements.define(name, cls)

        // Asynchronous preload
        ComponentsManager.getTemplate(this.constructor)
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

    static async _loadAsyncScriptsBatch(scripts) {
        scripts = (scripts instanceof Array) ? scripts : [ scripts ]

        let scriptPromises = []

        for (let script of scripts) {
            if (!(script in ComponentsManager._loadedResources)) {
                let scriptEl = document.createElement('script')
                scriptEl.async = 1

                scriptPromises.push(new Promise(
                    resolve => scriptEl.onload = resolve
                ))

                scriptEl.src = script
                document.head.appendChild(scriptEl)

                ComponentsManager._loadedResources[script] = { count: 0, element: scriptEl }
            }

            ComponentsManager._loadedResources[script].count += 1
        }

        await Promise.all(scriptPromises)
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

        for (let scripts of component.scripts || [])
            await ComponentsManager._loadAsyncScriptsBatch(scripts)
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
            if (resource in ComponentsManager._loadedResources)
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
