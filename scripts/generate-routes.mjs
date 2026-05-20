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

    console.log('Fetching case study slugs from Sanity...');
    const caseStudyQuery = '*[_type == "caseStudy"]{slug}';
    const caseStudies = await client.fetch(caseStudyQuery);

    const caseStudyRoutes = caseStudies
      .filter(cs => cs.slug && cs.slug.current)
      .map(cs => `/case-studies/${cs.slug.current}`);

    const staticRoutes = [
      '/',
      '/home',
      '/about',
      '/contact',
      '/works',
      '/case-studies'
    ];

    const allRoutes = [...staticRoutes, ...projectRoutes, ...caseStudyRoutes];
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
