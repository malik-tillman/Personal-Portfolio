import { createClient } from '@sanity/client';

const STRAPI_URL = 'https://cms.maliktillman.com/api';
const SANITY_PROJECT_ID = 'yn76jr12';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = process.env.SANITY_TOKEN;

if (!SANITY_TOKEN) {
  console.error('Please set SANITY_TOKEN environment variable');
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function uploadImage(url, filename) {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: filename
    });
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.error(`Failed to upload image ${url}:`, error);
    return null;
  }
}

async function migrateProjects() {
  console.log('Fetching projects from Strapi...');
  const response = await fetch(`${STRAPI_URL}/projects?populate=*`);
  const { data } = await response.json();

  for (const project of data) {
    const attr = project.attributes;
    console.log(`Migrating project: ${attr.title}`);

    let mainImage = null;
    if (attr.thumbnail && attr.thumbnail.data) {
      const thumb = attr.thumbnail.data.attributes;
      // Construct URL based on cms.service.ts logic
      const imageUrl = `https://maliktillman-cms-light.s3.us-west-002.backblazeb2.com/${thumb.hash}${thumb.ext}`;
      mainImage = await uploadImage(imageUrl, `${thumb.hash}${thumb.ext}`);
    }

    const doc = {
      _type: 'project',
      _id: `project-${project.id}`,
      title: attr.title,
      slug: {
        _type: 'slug',
        current: attr.title.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
      description: attr.description,
      publishedAt: attr.createdAt,
      categories: attr.category ? [attr.category] : [],
      tags: attr.tags || undefined,
      github: attr.github || undefined,
      website: attr.website || undefined,
      mainImage: mainImage || undefined,
    };

    await client.createOrReplace(doc);
    console.log(`Successfully migrated project: ${attr.title}`);
  }
}

async function migrateQuotes() {
  console.log('Fetching quotes from Strapi...');
  const response = await fetch(`${STRAPI_URL}/quotes`);
  const { data } = await response.json();

  for (const quote of data) {
    const attr = quote.attributes;
    console.log(`Migrating quote: ${attr.text.substring(0, 20)}...`);

    const doc = {
      _type: 'quote',
      _id: `quote-${quote.id}`,
      text: attr.text,
      author: attr.author,
    };

    await client.createOrReplace(doc);
  }
  console.log('Successfully migrated all quotes');
}

async function migrateSiteSettings() {
  console.log('Fetching site settings from Strapi...');
  const response = await fetch(`${STRAPI_URL}/site-setting`);
  const { data } = await response.json();
  const attr = data.attributes;

  const doc = {
    _type: 'siteSettings',
    _id: 'siteSettings',
    about: attr.about,
    // Add other fields as needed
  };

  await client.createOrReplace(doc);
  console.log('Successfully migrated site settings');
}

async function runMigration() {
  try {
    await migrateProjects();
    await migrateQuotes();
    await migrateSiteSettings();
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();
