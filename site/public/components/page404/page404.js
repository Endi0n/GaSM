import Component from '/scripts/bee/Component.js'

class XPage404 extends Component { }

Component.define('x-page-404', XPage404, {
    template: '/components/page404/page404.html',

    styles: [
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap',

        '/components/page404/page404.css'
    ],

    scripts: ['https://kit.fontawesome.com/df8e637184.js']
})
