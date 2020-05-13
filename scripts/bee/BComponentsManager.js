export default class BComponentsManager {
    static components = {}

    static async load(componentURL) {
        if (!(componentURL in BComponentsManager.components))
            BComponentsManager.components[componentURL] = await BComponentsManager
                ._loadComponent(componentURL)

        return BComponentsManager.components[componentURL]
    }

    static async _loadComponent(componentURL) {
        return (await fetch(componentURL)).text()
    }
}
