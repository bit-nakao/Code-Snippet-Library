const db = require('./db');

const seedData = [
  {
    title: 'Modern Primary Button',
    description: 'A sleek, modern primary button with hover effects and smooth transitions.',
    category: 'button',
    tags: 'modern, primary, button, tailwind',
    html_code: '<button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">Click Me</button>',
    css_code: '',
    js_code: ''
  },
  {
    title: 'Glassmorphism Card',
    description: 'A beautiful glassmorphism card effect for modern UI designs.',
    category: 'card',
    tags: 'glassmorphism, card, frosted-glass',
    html_code: '<div class="glass-card"><h2>Card Title</h2><p>This is a glassmorphism card.</p></div>',
    css_code: '.glass-card {\n  background: rgba(255, 255, 255, 0.1);\n  backdrop-filter: blur(10px);\n  border-radius: 15px;\n  padding: 20px;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}',
    js_code: ''
  },
  {
    title: 'Responsive Navbar',
    description: 'Simple responsive navigation bar with a mobile menu toggle.',
    category: 'navigation',
    tags: 'navbar, responsive, mobile-menu',
    html_code: '<nav>...</nav>',
    css_code: '',
    js_code: 'document.querySelector(".toggle").onclick = () => { ... }'
  }
];

const insert = db.prepare(`
  INSERT INTO snippets (title, description, category, tags, html_code, css_code, js_code)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

seedData.forEach(item => {
  insert.run(item.title, item.description, item.category, item.tags, item.html_code, item.css_code, item.js_code);
});

console.log('Database seeded successfully!');
