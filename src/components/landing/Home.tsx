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

const steps = [
	{
		id: 'st1',
		name: 'Set Your Keywords',
		description:
			'Add company names, business entities, or specific terms you want to track.',
		icon: Search,
	},
	{
		id: 'st2',
		name: 'Automated Monitoring',
		description:
			'Our system continuously monitors multiple sources for your keywords.',
		icon: BellIcon,
	},
	{
		id: 'st3',
		name: 'Instant Notifications',
		description: 'Receive real-time alerts when your keywords are mentioned.',
		icon: Zap,
	},
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
	return (
		<>
			<Header />
			{/* Hero Section */}
			<section className='relative isolate pt-14'>
				<div className='py-24 sm:py-32'>
					<div className='mx-auto max-w-7xl px-6 lg:px-8'>
						<div className='mx-auto max-w-2xl text-center'>
							<h1 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl'>
								Stay Ahead with{' '}
								<span className='relative whitespace-nowrap'>
									<span className='relative bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent'>
										Real-Time
									</span>
								</span>{' '}
								Business Intelligence
							</h1>
							<p className='mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400'>
								Transform the way you track important business announcements
								across Saudi Arabia&apos;s most trusted sources.
							</p>
							<div className='mt-10 flex items-center justify-center gap-x-6'>
								<Link href='/auth/signup'>
									<Button
										size='lg'
										className='rounded-full bg-indigo-600 px-8 py-6 text-lg font-medium text-white shadow-lg transition-all duration-200 hover:bg-indigo-500 hover:shadow-xl'
									>
										Get Started
										<ArrowRight className='ml-2 h-5 w-5' />
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Logo Cloud / Network Section */}
			<section
				id='network'
				className='relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-16 dark:from-gray-800 dark:to-gray-900 sm:py-24'
			>
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:bg-[url('/grid-dark.svg')]"></div>

				<div className='relative mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl text-center'>
						<h2 className='bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-300 sm:text-4xl'>
							Our Growing Network
						</h2>
						<p className='mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400'>
							Trusted sources across Saudi Arabia&apos;s media landscape
						</p>
					</div>

					<div className='relative mx-auto mt-16 h-24 w-full max-w-5xl overflow-hidden rounded-xl bg-white dark:bg-gray-800'>
						<div className='absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent dark:from-gray-800'></div>
						<div className='absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent dark:from-gray-800'></div>
						<div className='animate-scroll flex'>
							{/* First set of logos */}
							{sources.map((source) => (
								<div
									key={source.id}
									className='group mx-8 flex h-24 w-48 flex-none items-center justify-center'
								>
									<div className='relative flex h-full w-full items-center justify-center grayscale transition-all duration-300 hover:grayscale-0'>
										<Image
											src={source.logo}
											alt={source.name}
											width={200}
											height={100}
											className='max-h-12 w-auto'
										/>
										<div className='absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-gray-900'>
											{source.name}
										</div>
									</div>
								</div>
							))}
							{/* Duplicate set of logos for seamless loop */}
							{sources.map((source) => (
								<div
									key={source.id}
									className='group mx-8 flex h-24 w-48 flex-none items-center justify-center'
								>
									<div className='relative flex h-full w-full items-center justify-center grayscale transition-all duration-300 hover:grayscale-0'>
										<Image
											src={source.logo}
											alt={source.name}
											width={200}
											height={100}
											className='max-h-12 w-auto'
										/>
										<div className='absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-gray-900'>
											{source.name}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Security Features Section */}
			<section id='security' className='bg-white py-24 dark:bg-gray-900'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl lg:text-center'>
						<h2 className='text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400'>
							ENTERPRISE-GRADE SECURITY
						</h2>
						<p className='mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
							Your Data, Our Priority
						</p>
						<p className='mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400'>
							Built with security and privacy at its core, ensuring your
							sensitive business data remains protected
						</p>
					</div>
					<div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
						<dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-4'>
							{securityFeatures.map((feature) => (
								<div key={feature.id} className='relative pl-16'>
									<dt className='text-base font-semibold leading-7 text-gray-900 dark:text-white'>
										<div className='absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600'>
											<Shield
												className='h-6 w-6 text-white'
												aria-hidden='true'
											></Shield>
										</div>
										{feature.title}
									</dt>
									<dd className='mt-2 text-base leading-7 text-gray-600 dark:text-gray-400'>
										{feature.description}
									</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</section>

			{/* Perfect For Section */}
			<section
				id='target-audience'
				className='bg-gray-50 py-24 dark:bg-gray-800'
			>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl lg:text-center'>
						<h2 className='text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400'>
							PERFECT FOR
						</h2>
						<p className='mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
							Tailored for Your Industry
						</p>
						<p className='mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400'>
							Designed to meet the specific needs of various business
							professionals and organizations
						</p>
					</div>
					<div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
						<dl className='grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6'>
							{targetAudience.map((audience) => (
								<div
									key={audience.id}
									className='group relative rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:bg-indigo-50 dark:bg-gray-900 dark:ring-gray-800 dark:hover:bg-gray-800'
								>
									<dt>
										<div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 transition-colors duration-200 group-hover:bg-indigo-200 dark:bg-indigo-900 dark:group-hover:bg-indigo-800'>
											<audience.icon
												className='h-8 w-8 text-indigo-600 dark:text-indigo-400'
												aria-hidden='true'
											></audience.icon>
										</div>
										<p className='mt-6 text-sm font-semibold leading-6 text-gray-900 dark:text-white'>
											{audience.title}
										</p>
									</dt>
								</div>
							))}
						</dl>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section
				id='features'
				className='bg-white py-24 dark:bg-gray-900 sm:py-32'
			>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl text-center'>
						<h2 className='text-4xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-5xl'>
							Precision Monitoring
						</h2>
					</div>
					<div className='mx-auto mt-16 max-w-7xl'>
						<div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
							{features.map((feature) => (
								<Card
									key={feature.id}
									className='relative overflow-hidden rounded-3xl p-8 transition-all duration-200 hover:shadow-lg dark:bg-gray-800/50'
								>
									<div className='relative z-10'>
										<div className='mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20'>
											<feature.icon className='h-8 w-8 text-indigo-600 dark:text-indigo-400' />
										</div>
										<h3 className='mb-3 text-xl font-semibold text-slate-900 dark:text-white'>
											{feature.title}
										</h3>
										<p className='text-slate-600 dark:text-slate-400'>
											{feature.description}
										</p>
									</div>
								</Card>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* How it Works Section */}
			<section id='how-it-works' className='bg-gray-50 py-24 dark:bg-gray-800'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl lg:text-center'>
						<h2 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl'>
							How It Works
						</h2>
						<p className='mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400'>
							Get started in minutes with our simple three-step process
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
			<section id='faq' className='bg-white py-24 dark:bg-gray-900'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-4xl divide-y divide-gray-900/10 dark:divide-gray-100/10'>
						<h2 className='mb-16 text-center text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white'>
							Frequently Asked Questions
						</h2>
						<Accordion type='single' collapsible className='w-full'>
							{faqs.map((faq) => (
								<AccordionItem key={faq.id} value={`item-${faq.id}`}>
									<AccordionTrigger className='text-left text-lg font-semibold text-gray-900 dark:text-white'>
										{faq.question}
									</AccordionTrigger>
									<AccordionContent className='text-gray-600 dark:text-gray-400'>
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
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
									Get Started
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
