import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sanity configuration from environment.ts
const sanityConfig = {
  projectId: 'yn76jr12',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
};

const client = createClient(sanityConfig);

async function generateRoutes() {
  try {
    console.log('Fetching project IDs from Sanity...');
    const query = '*[_type == "project"]{_id}';
    const projects = await client.fetch(query);
    
    const projectRoutes = projects.map(p => {
      const id = p._id.replace('project-', '');
      return `/works/project/${id}`;
    });

    const staticRoutes = [
      '/',
      '/home',
      '/about',
      '/contact',
      '/works'
    ];

    const allRoutes = [...staticRoutes, ...projectRoutes];
    const routesFileContent = allRoutes.join('\n');

    const outputPath = path.join(__dirname, '../src/routes.txt');
    fs.writeFileSync(outputPath, routesFileContent);

    console.log(`Successfully generated ${allRoutes.length} routes in ${outputPath}`);
  } catch (error) {
    console.error('Error generating routes:', error);
    process.exit(1);
  }
}

generateRoutes();
