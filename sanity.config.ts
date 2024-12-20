import schemas from '@/sanity/schemas';
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';

const config = defineConfig({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: 'production',
	title: 'My Personal Website',
	apiVersion: '2023-03-09',
	basePath: '/studio',
	plugins: [deskTool()],
	schema: {
		types: schemas,
	},
});

export default config;
