import * as routes from '/scripts/routes.js'
import Component from '/scripts/bee/Component.js'

class XViewCampaigns extends Component {
	async componentDidLoad() {
        const container = document.getElementById('container');
        const loading = document.querySelector('.loading');

        getPost();
        getPost();
        getPost();

        window.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            
            console.log( { scrollTop, scrollHeight, clientHeight });
            
            if(clientHeight + scrollTop >= scrollHeight - 5) {
                showLoading();
            }
        });

        function showLoading() {
            loading.classList.add('show');
            
            setTimeout(getPost, 1000)
        }

        async function getPost() {
            const postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${getRandomNr()}`);
            const postData = await postResponse.json();
            
            const userResponse = await fetch('https://randomuser.me/api');
            const userData = await userResponse.json();
            
            const data = { post: postData, user: userData.results[0] };
            
            addDataToDOM(data);
        }

        function getRandomNr() {
            return Math.floor(Math.random() * 100) + 1;
        }

        function addDataToDOM(data) {
            const postElement = document.createElement('div');
            postElement.classList.add('campaign');
            postElement.innerHTML = `
            <h2 class="title">${data.post.title}</h2>
            <p class="description">${data.post.content}</p>

            <a href="${data.post.id}">Citeste mai mult</a>
            
            <div class="info">
            <div>
            <h4>Adresa</h4>
                <span class="address">${data.user.name.address}</span>
            </div>
            <div>
            <h4>Data</h4>
                <span class="name">${data.user.name.date}</span>
            </div>
            <div>
            <h4>Organizator</h4>
                <span class="date">${data.user.name.surname} ${data.user.name}</span>
            </div>
            `;
            container.appendChild(postElement);
            
            loading.classList.remove('show');
        }
    }
}

Component.define('x-view-campaigns', XViewCampaigns, {
    template: '/components/view_campaigns/view_campaigns.html',

    styles: [
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap',

        '/components/view_campaigns/view_campaigns.css'
    ],

    scripts: ['https://kit.fontawesome.com/df8e637184.js']
})
