class SmoothTransitions {
    constructor() {
        this.cache = new Map();
        this.init();
    }

    async init() {
        this.preloadPages();
        this.setupLinks();
        this.setupHistory();
    }

    async preloadPages() {
        const links = document.querySelectorAll('nav a');
        for (const link of links) {
            const url = link.href;
            if (!this.cache.has(url) && !url.includes('#')) {
                try {
                    const content = await this.fetchPage(url);
                    this.cache.set(url, content);
                } catch (error) {
                    console.error('Preload error:', error);
                }
            }
        }
    }

    async fetchPage(url) {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        return doc.getElementById('page-wrapper').innerHTML;
    }

    setupLinks() {
        document.addEventListener('click', async (e) => {
            const link = e.target.closest('a');
            if (!link || link.target || link.href.includes('mailto:') || link.href.includes('tel:')) return;
            
            e.preventDefault();
            await this.transitionTo(link.href);
        });
    }

    setupHistory() {
        window.addEventListener('popstate', async () => {
            await this.transitionTo(window.location.href, true);
        });
    }

    async transitionTo(url, isBack = false) {
       
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        document.body.appendChild(transition);

        
        let content;
        if (this.cache.has(url)) {
            content = this.cache.get(url);
        } else {
            content = await this.fetchPage(url);
            this.cache.set(url, content);
        }

        
        await new Promise(resolve => setTimeout(resolve, 100));

       
        document.getElementById('page-wrapper').innerHTML = content;
        document.title = document.querySelector('title').textContent;

        
        transition.classList.add('page-exit');
        transition.addEventListener('animationend', () => {
            transition.remove();
        });

       
        window.scrollTo(0, 0);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new SmoothTransitions();
});