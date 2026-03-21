import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

async function seedData() {
  const connection = await mysql.createConnection(DATABASE_URL);

  try {
    console.log('Seeding blog posts...');
    
    const blogPosts = [
      {
        title: 'Getting Started with p5.js',
        slug: 'getting-started-p5js',
        excerpt: 'Learn the basics of creative coding with p5.js',
        content: 'p5.js is a JavaScript library that makes coding accessible for artists, designers, educators, and beginners. It is based on the core principles of Processing.',
        category: 'Tutorial',
        date: new Date().toISOString().split('T')[0],
      },
      {
        title: 'Interactive Design Patterns',
        slug: 'interactive-design-patterns',
        excerpt: 'Explore modern patterns for interactive web experiences',
        content: 'Interactive design has evolved significantly. This article covers key patterns and best practices for creating engaging user experiences.',
        category: 'Design',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      },
      {
        title: 'WebGL for Creative Coding',
        slug: 'webgl-creative-coding',
        excerpt: 'Harness the power of WebGL for stunning 3D graphics',
        content: 'WebGL brings GPU-accelerated graphics to the web. Learn how to create impressive 3D visualizations and interactive experiences.',
        category: 'Graphics',
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
      },
    ];

    for (const post of blogPosts) {
      await connection.execute(
        'INSERT INTO blog_posts (title, slug, excerpt, content, category, date, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [post.title, post.slug, post.excerpt, post.content, post.category, post.date]
      );
    }

    console.log('Seeding portfolio projects...');

    const projects = [
      {
        title: 'Kinetic Portfolio',
        slug: 'kinetic-portfolio',
        description: 'An interactive personal portfolio website featuring p5.js animations, WebGL 3D scenes, and smooth scroll interactions.',
        technologies: 'React, TypeScript, p5.js, WebGL, Tailwind CSS',
        link: 'https://kinetic-portfolio.example.com',
        imageUrl: 'https://via.placeholder.com/400x300?text=Kinetic+Portfolio',
        featured: 1,
      },
      {
        title: 'Gravity Collage System',
        slug: 'gravity-collage',
        description: 'A physics-based layout system that arranges content pieces with gravity simulation.',
        technologies: 'p5.js, Matter.js, Canvas API',
        link: 'https://gravity-collage.example.com',
        imageUrl: 'https://via.placeholder.com/400x300?text=Gravity+Collage',
        featured: 1,
      },
      {
        title: '3D Blueprint Visualizer',
        slug: '3d-blueprint',
        description: 'An interactive 3D visualization tool for architectural and technical drawings.',
        technologies: 'Three.js, WebGL, React',
        link: 'https://blueprint-viz.example.com',
        imageUrl: 'https://via.placeholder.com/400x300?text=3D+Blueprint',
        featured: 0,
      },
      {
        title: 'Particle Flow Generator',
        slug: 'particle-flow',
        description: 'A tool for generating and visualizing particle flow fields with Perlin noise.',
        technologies: 'p5.js, Canvas API, JavaScript',
        link: 'https://particle-flow.example.com',
        imageUrl: 'https://via.placeholder.com/400x300?text=Particle+Flow',
        featured: 0,
      },
    ];

    for (const project of projects) {
      await connection.execute(
        'INSERT INTO portfolio_projects (title, slug, description, technologies, link, imageUrl, featured, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [
          project.title,
          project.slug,
          project.description,
          project.technologies,
          project.link,
          project.imageUrl,
          project.featured,
        ]
      );
    }

    console.log('✅ Seed data inserted successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedData();
