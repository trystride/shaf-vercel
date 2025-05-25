'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import {
	Building2,
	Shield,
	Zap,
	BarChart,
	Globe,
	Search,
	Bell as BellIcon,
	Briefcase,
	LineChart,
	ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { useTranslation } from '@/app/context/TranslationContext';

const features = [
	{
		id: 'f1',
		title: 'Custom Keyword Tracking',
		description:
			'Set up personalized alerts for company names, business entities, or specific terms',
		icon: BellIcon,
	},
	{
		id: 'f2',
		title: 'Real-Time Updates',
		description:
			'Receive instant notifications when your keywords appear in bankruptcy announcements',
		icon: Zap,
	},
	{
		id: 'f3',
		title: 'Multi-Source Coverage',
		description:
			'Monitor announcements from bankruptcy.gov.sa and leading Saudi newspapers',
		icon: Globe,
	},
	{
		id: 'f4',
		title: 'Intelligent Matching',
		description:
			'Advanced algorithms ensure you never miss relevant announcements',
		icon: BarChart,
	},
];

const sources = [
	{
		id: 's1',
		logo: '/images/network/Al-Jazirah-01.svg',
		name: 'Al-Jazirah',
	},
	{
		id: 's2',
		logo: '/images/network/373394.svg',
		name: 'Ministry of Justice',
	},
	{
		id: 's3',
		logo: '/images/network/Alyawm-01.svg',
		name: 'Alyawm',
	},
	{
		id: 's4',
		logo: '/images/network/374031.svg',
		name: 'Al Riyadh',
	},
	{
		id: 's5',
		logo: '/images/network/Makkah-Almujarramah-01.svg',
		name: 'Makkah',
	},
	{
		id: 's6',
		logo: '/images/network/moj.svg',
		name: 'Ministry of Commerce',
	},
	{
		id: 's7',
		logo: '/images/network/390238.svg',
		name: 'Eisar',
	},
	{
		id: 's8',
		logo: '/images/network/bankruptcy.svg',
		name: 'Ajel',
	},
];

const securityFeatures = [
	{
		id: 'sf1',
		title: 'Secure Authentication',
		description: 'Enterprise-grade user authentication and authorization',
	},
	{
		id: 'sf2',
		title: 'Data Encryption',
		description: 'End-to-end encryption for all sensitive data',
	},
	{
		id: 'sf3',
		title: 'Privacy-First',
		description: 'Built with privacy by design principles',
	},
	{
		id: 'sf4',
		title: 'Regulatory Compliance',
		description: 'Compliant with local Saudi Arabian regulations',
	},
];

const targetAudience = [
	{ id: 'ta1', title: 'Legal Professionals', icon: LineChart },
	{ id: 'ta2', title: 'Business Intelligence Teams', icon: LineChart },
	{ id: 'ta3', title: 'Risk Management Departments', icon: Shield },
	{ id: 'ta4', title: 'Financial Institutions', icon: Building2 },
	{ id: 'ta5', title: 'Business Owners', icon: Briefcase },
	{ id: 'ta6', title: 'Market Researchers', icon: Search },
];

const faqs = [
	{
		id: 'fq1',
		question: 'How often is the data updated?',
		answer:
			'Our system fetches new announcements every 2 hours from all sources, ensuring you stay up-to-date with the latest information.',
	},
	{
		id: 'fq2',
		question: 'What sources do you monitor?',
		answer:
			"We currently monitor bankruptcy.gov.sa and major Saudi newspapers. We're continuously expanding our sources to include more publications and social media platforms.",
	},
	{
		id: 'fq3',
		question: 'How do I get started?',
		answer:
			'Simply sign up for an account, add your keywords, and start receiving alerts. The setup process takes less than 5 minutes.',
	},
	{
		id: 'fq4',
		question: 'Can I customize my notifications?',
		answer:
			'Yes, you can choose how and when you receive notifications. Options include email alerts, dashboard notifications, and more.',
	},
];

export default function Home() {
	const t = useTranslation();

	const steps = [
		{
			id: 'st1',
			name: t.steps?.[0]?.name ?? 'Set Up Keywords',
			description: t.steps?.[0]?.description ?? 'Define the terms and companies you want to monitor',
			icon: Search,
		},
		{
			id: 'st2',
			name: t.steps?.[1]?.name ?? 'Configure Alerts',
			description: t.steps?.[1]?.description ?? 'Choose how and when you want to receive notifications',
			icon: BellIcon,
		},
		{
			id: 'st3',
			name: t.steps?.[2]?.name ?? 'Stay Informed',
			description: t.steps?.[2]?.description ?? 'Get real-time updates when your keywords are mentioned',
			icon: Zap,
		},
	];

	return (
		<>
			<Header />

			{/* Hero Section */}
			<section className='relative isolate pt-14'>
				<div className='py-24 sm:py-32'>
					<div className='mx-auto max-w-7xl px-6 lg:px-8'>
						<div className='mx-auto max-w-2xl text-center'>
							<h1 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl'>
								{t.hero?.title ?? 'Stay Ahead with Real-Time Business Intelligence'}
							</h1>
							<p className='mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400'>
								{t.hero?.subtitle ?? 'Monitor critical business announcements across Saudi Arabia\'s most trusted sources'}
							</p>
							<div className='mt-10 flex items-center justify-center gap-x-6'>
								<Link href='/auth/signup'>
									<Button
										size='lg'
										className='rounded-full bg-indigo-600 px-8 py-6 text-lg font-medium text-white shadow-lg transition-all duration-200 hover:bg-indigo-500 hover:shadow-xl'
									>
										{t.common?.getStarted ?? 'Get Started'}
										<ArrowRight className='ml-2 h-5 w-5' />
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Network Section */}
			<section id="network" className='py-24 sm:py-32'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl text-center'>
						<h2 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
							{t.network?.title ?? 'Trusted by Leading Organizations'}
						</h2>
						<p className='mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400'>
							{t.network?.subtitle ?? 'Our network of trusted sources provides you with the most accurate and up-to-date information'}
						</p>
					</div>
					<div className='mx-auto mt-16 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5'>
						{sources.map((source) => (
							<div key={source.id} className="col-span-2 lg:col-span-1">
								<Image
									src={source.logo}
									alt={source.name}
									className='max-h-12 w-full object-contain'
									width={158}
									height={48}
								/>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Security Section */}
			<section id="security" className='py-24 sm:py-32 bg-gray-50 dark:bg-gray-900'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl text-center'>
						<h2 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
							{t.security?.title ?? 'Enterprise-Grade Security'}
						</h2>
						<p className='mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400'>
							{t.security?.subtitle ?? 'Your Data, Our Priority'}
						</p>
						<p className='mt-6 text-base leading-7 text-gray-600 dark:text-gray-400'>
							{t.security?.description ?? 'Built with security and privacy at its core, ensuring your sensitive business data is protected'}
						</p>
					</div>
					<div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
						<dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4'>
							{t.security?.features?.map((feature) => (
								<div key={feature.id} className='flex flex-col'>
									<dt className='text-base font-semibold leading-7 text-gray-900 dark:text-white'>
										{feature.title}
									</dt>
									<dd className='mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400'>
										<p className='flex-auto'>{feature.description}</p>
									</dd>
								</div>
							)) ?? securityFeatures.map((feature) => (
								<div key={feature.id} className='flex flex-col'>
									<dt className='text-base font-semibold leading-7 text-gray-900 dark:text-white'>
										{feature.title}
									</dt>
									<dd className='mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400'>
										<p className='flex-auto'>{feature.description}</p>
									</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</section>

			{/* Industry Section */}
			<section id="industry" className='py-24 sm:py-32'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl text-center'>
						<h2 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
							{t.industry?.title ?? 'Perfect For'}
						</h2>
						<p className='mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400'>
							{t.industry?.subtitle ?? 'Designed for Your Industry'}
						</p>
						<p className='mt-6 text-base leading-7 text-gray-600 dark:text-gray-400'>
							{t.industry?.description ?? 'Tailored to meet the specific needs of various professionals and business institutions'}
						</p>
					</div>
					<div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
						<dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3'>
							{t.industry?.categories?.map((category) => (
								<Card key={category.id} className='flex flex-col items-center text-center p-6 dark:bg-gray-800'>
									<h3 className='text-lg font-semibold leading-7 tracking-tight text-gray-900 dark:text-white'>
										{category.title}
									</h3>
								</Card>
							)) ?? targetAudience.map((category) => (
								<Card key={category.id} className='flex flex-col items-center text-center p-6 dark:bg-gray-800'>
									<h3 className='text-lg font-semibold leading-7 tracking-tight text-gray-900 dark:text-white'>
										{category.title}
									</h3>
								</Card>
							))}
						</dl>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section
				id='features'
				className='mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32'
			>
				<div className='mx-auto max-w-2xl lg:text-center'>
					<h2 className='text-base font-semibold leading-7 text-indigo-600'>
						{t.features?.[0]?.title ?? features[0].title}
					</h2>
					<p className='mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
						{t.features?.[0]?.description ?? features[0].description}
					</p>
				</div>

				<div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
					<dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4'>
						{(t.features ?? features).map((feature) => (
							<Card
								key={feature.id}
								className='flex flex-col dark:bg-gray-900'
							>
								<div className='flex items-center gap-x-4 p-6'>
									{feature.icon && (
										<feature.icon className='h-6 w-6 text-indigo-600' />
									)}
									<h3 className='text-base font-semibold leading-7 tracking-tight text-gray-900 dark:text-white'>
										{feature.title}
									</h3>
								</div>
								<div className='p-6 pt-0 text-base leading-7 text-gray-600 dark:text-gray-400'>
									{feature.description}
								</div>
							</Card>
						))}
					</dl>
				</div>
			</section>

			{/* How it Works Section */}
			<section id='how-it-works' className='bg-gray-50 py-24 dark:bg-gray-900'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl text-center'>
						<h2 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
							{t.stepsSection.title}
						</h2>
						<p className='mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400'>
							{t.stepsSection.subtitle}
						</p>
					</div>
					<div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
						<dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3'>
							{steps.map((step) => (
								<div key={step.id} className='flex flex-col'>
									<dt className='flex items-center gap-x-3 text-xl font-semibold leading-7 text-gray-900 dark:text-white'>
										<div className='flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-600'>
											<step.icon
												className='h-6 w-6 text-white'
												aria-hidden='true'
											></step.icon>
										</div>
										{step.name}
									</dt>
									<dd className='mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400'>
										<p className='flex-auto'>{step.description}</p>
									</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section
				id='faq'
				className='mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40'
			>
				<div className='mx-auto max-w-4xl divide-y divide-gray-900/10 dark:divide-gray-700'>
					<h2 className='text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white'>
						{t.faqSection.title}
					</h2>
					<dl className='mt-10 space-y-6 divide-y divide-gray-900/10 dark:divide-gray-700'>
						{t.faqs.map((faq) => (
							<Accordion key={faq.id} type='single' collapsible>
								<AccordionItem value={faq.id}>
									<AccordionTrigger className='text-right'>
										{faq.question}
									</AccordionTrigger>
									<AccordionContent className='text-right'>
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						))}
					</dl>
				</div>
			</section>

			{/* CTA Section */}
			<section className='relative isolate overflow-hidden bg-gradient-to-b from-indigo-600 to-purple-600'>
				<div className='mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8'>
					<div className='mx-auto max-w-2xl text-center'>
						<h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
							Start Monitoring Today
						</h2>
						<p className='mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100'>
							Don&apos;t miss critical business announcements. Sign up now and
							stay ahead of market movements.
						</p>
						<div className='mt-10 flex items-center justify-center gap-x-6'>
							<Link href='/auth/signup'>
								<Button
									size='lg'
									className='rounded-full bg-white px-8 py-6 text-lg font-medium text-indigo-600 hover:bg-indigo-50'
								>
									{t.common.getStarted}
									<ArrowRight className='ml-2 h-5 w-5' />
								</Button>
							</Link>
						</div>
					</div>
				</div>
				<div
					className='absolute -top-24 right-0 -z-10 transform-gpu blur-3xl'
					aria-hidden='true'
				>
					<div className='aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25' />
				</div>
			</section>
		</>
	);
}
