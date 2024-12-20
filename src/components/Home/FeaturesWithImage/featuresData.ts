import { FeatureWithImg } from '@/types/featureWithImg';

const featureItemData: FeatureWithImg[] = [
	{
		id: 1,
		title: 'Modern User Interface',
		description:
			'Clean and intuitive design that enhances user experience and productivity.',
		checklist: [
			'Responsive design',
			'Intuitive navigation',
			'Modern components',
		],
		image: '/images/features/feature-01.png',
	},
	{
		id: 2,
		title: 'Seamless Integration',
		description:
			'Easy integration with existing systems and third-party services.',
		checklist: ['API integration', 'Plugin support', 'Custom extensions'],
		image: '/images/features/feature-02.png',
	},
	{
		id: 3,
		title: 'Advanced Analytics',
		description:
			'Comprehensive analytics and reporting capabilities for data-driven decisions.',
		checklist: ['Real-time metrics', 'Custom reports', 'Data visualization'],
		image: '/images/features/feature-03.png',
	},
	{
		id: 4,
		title: 'Secure Platform',
		description:
			'Enterprise-grade security features to protect your data and privacy.',
		checklist: [
			'End-to-end encryption',
			'Role-based access',
			'Security audits',
		],
		image: '/images/features/feature-04.png',
	},
];

export default featureItemData;
