import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export interface SanityImageSource {
  asset: {
    _ref: string;
    _type?: 'reference';
  };
}

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'n6io5ify',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-03-08', 
  useCdn: false, 
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source as any);
}

export async function fetchProjects(category?: string) {
  let query = '*[_type == "project"]';
  
  if (category) {
    query = `*[_type == "project" && category == "${category}"]`;
  }
  
  query += ' | order(_createdAt desc)';

  try {
    const projects = await client.fetch(query);
    return projects;
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    throw error;
  }
}

export async function fetchLastUpdate() {
  const query = '*[] | order(_updatedAt desc)[0]._updatedAt';
  const lastUpdate = await client.fetch(query);
  return lastUpdate;
}