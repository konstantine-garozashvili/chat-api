class DomainManager {
  constructor(container) {
    this.container = container;
    this.domains = [];
    this.init();
  }

  async init() {
    await this.loadDomains();
    this.render();
    this.setupEventListeners();
  }

  async loadDomains() {
    const response = await fetch('/api/widget/domains', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    this.domains = await response.json();
  }

  render() {
    this.container.innerHTML = `
      <div class="domain-manager">
        <div class="add-domain">
          <input type="text" placeholder="Enter domain (e.g., example.com)" />
          <button class="add">Add Domain</button>
        </div>
        <div class="domain-list">
          ${this.domains.map(domain => this.renderDomain(domain)).join('')}
        </div>
      </div>
    `;
  }

  renderDomain(domain) {
    return `
      <div class="domain-item" data-domain="${domain}">
        <span>${domain}</span>
        <button class="remove" data-domain="${domain}">Remove</button>
      </div>
    `;
  }

  setupEventListeners() {
    const addButton = this.container.querySelector('.add');
    addButton.addEventListener('click', () => this.addDomain());

    this.container.addEventListener('click', e => {
      if (e.target.classList.contains('remove')) {
        this.removeDomain(e.target.dataset.domain);
      }
    });
  }

  async addDomain() {
    const input = this.container.querySelector('input');
    const domain = input.value.trim();
    
    if (!domain) return;

    try {
      const response = await fetch('/api/widget/domains', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ domain })
      });

      if (response.ok) {
        this.domains.push(domain);
        this.render();
        input.value = '';
      }
    } catch (error) {
      console.error('Error adding domain:', error);
    }
  }

  async removeDomain(domain) {
    try {
      const response = await fetch(`/api/widget/domains/${domain}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        this.domains = this.domains.filter(d => d !== domain);
        this.render();
      }
    } catch (error) {
      console.error('Error removing domain:', error);
    }
  }
} 