import Component from '/scripts/bee/Component.js'
import authGuard from '/guards/auth.js'
import BHistory from '/scripts/bee/BHistory.js'

class XMenu extends Component {
	async componentDidLoad() {
        await authGuard(this)

		const menu_btn = this.getElementsByClassName('menu-btn')
        const menu_list = this.getElementsByClassName('menu-list')[0]

        menu_btn[0].addEventListener('click', () => menu_list.classList.toggle('show'))

        menu_btn[1].addEventListener('click', () => menu_list.classList.toggle('show'))

        $(() => $(".menu-link").click(() => menu_list.classList.toggle('show')))

        BHistory.addObserver(this)
    }

    async update() {
        await authGuard(this)
    }
}

Component.define('x-menu', XMenu, {
    template: '/components/menu/menu.html',

    styles: [
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap',

        '/components/menu/menu.css'
    ],

    scripts: ['https://kit.fontawesome.com/df8e637184.js']
})
