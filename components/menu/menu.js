import BBaseComponent from '/scripts/bee/BBaseComponent.js'

class XMenu extends BBaseComponent {

    async componentDidMount() {
		await this.loadComponentFrom('/components/menu/menu.html')
	}
	
	async componentDidLoad() {
		const menu_btn = document.getElementsByClassName('menu-btn');
        const menu_list = document.getElementById('menu-list');

        menu_btn[0].addEventListener('click', () => {
                        menu_list.classList.toggle('show');
                        });
        menu_btn[1].addEventListener('click', () => {
                        menu_list.classList.toggle('show');
                        });
    }

}

window.customElements.define('x-menu', XMenu)
