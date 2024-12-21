'use client';
import React from 'react';
import Breadcrumbs from '../Common/Breadcrumbs';
import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
	return (
		<section className='relative overflow-hidden pb-20 pt-20 md:pt-28'>
			{/* Breadcrumb with improved spacing */}
			<div className='mb-12'>
				<Breadcrumbs title='Contact Us' pages={['Home', 'Contact']} />
			</div>

			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='grid gap-10 lg:grid-cols-2'>
					{/* Contact Form */}
					<div className='rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-900 sm:p-10'>
						<h2 className='mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
							Get in Touch
						</h2>
						<p className='mb-8 text-gray-600 dark:text-gray-400'>
							Have a question or need assistance? Fill out the form below and
							our team will get back to you shortly.
						</p>

						<form className='space-y-6'>
							<div>
								<label
									htmlFor='fullName'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300'
								>
									Full Name
								</label>
								<input
									type='text'
									name='fullName'
									id='fullName'
									placeholder='Enter your full name'
									className='mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition duration-200 placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400'
								/>
							</div>

							<div>
								<label
									htmlFor='email'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300'
								>
									Email
								</label>
								<input
									type='email'
									name='email'
									id='email'
									placeholder='Enter your email'
									className='mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition duration-200 placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400'
								/>
							</div>

							<div>
								<label
									htmlFor='message'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300'
								>
									Message
								</label>
								<textarea
									name='message'
									id='message'
									rows={5}
									placeholder='Type your message'
									className='mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition duration-200 placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400'
								></textarea>
							</div>

							<button
								type='submit'
								className='inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-white shadow-sm transition duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2'
							>
								Send Message
							</button>
						</form>
					</div>

					{/* Contact Information */}
					<div className='relative rounded-2xl bg-gray-900 p-8 text-white sm:p-10'>
						<h2 className='mb-8 text-3xl font-bold tracking-tight'>
							Contact Information
						</h2>
						<p className='mb-12 text-gray-400'>
							Don&apos;t hesitate to reach out if you have any questions.
						</p>

						<div className='space-y-8'>
							<div className='flex items-start space-x-4'>
								<MapPin className='h-6 w-6 flex-shrink-0 text-primary' />
								<div>
									<h3 className='font-medium'>Our Location</h3>
									<p className='mt-1 text-gray-400'>
										123 Riyadh Avenue, Office 203
										<br />
										Riyadh, Kingdom of Saudi Arabia
									</p>
								</div>
							</div>

							<div className='flex items-start space-x-4'>
								<Phone className='h-6 w-6 flex-shrink-0 text-primary' />
								<div>
									<h3 className='font-medium'>Phone</h3>
									<p className='mt-1 text-gray-400'>+966 (11) 234-5678</p>
								</div>
							</div>

							<div className='flex items-start space-x-4'>
								<Mail className='h-6 w-6 flex-shrink-0 text-primary' />
								<div>
									<h3 className='font-medium'>Email</h3>
									<p className='mt-1 text-gray-400'>info@shaf.sa</p>
								</div>
							</div>
						</div>

						{/* Background Pattern */}
						<div className='absolute bottom-0 right-0 -z-10 opacity-10'>
							<Image
								src='/images/support/support-grid-02.svg'
								alt='background pattern'
								width={368}
								height={368}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Contact;
