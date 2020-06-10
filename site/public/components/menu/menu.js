import Component from '/scripts/bee/Component.js'
import authGuard from '/guards/auth.js'
import Authentication from '/scripts/auth.js'

class XMenu extends Component {
	async componentDidLoad() {
        await authGuard()

        const menu_list = this.getElementsByClassName('menu-list')[0]

        $(this).children('.menu-btn').click(() =>  menu_list.classList.toggle('show'))

        $(this).children('.menu-link').click(() => menu_list.classList.toggle('show'))

        $(this).children('#menu-logout').click(Authentication.logout)
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
