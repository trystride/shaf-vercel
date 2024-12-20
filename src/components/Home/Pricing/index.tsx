'use client';
import { pricingData } from '@/pricing/pricingData';
import Image from 'next/image';

const HomePricing = () => {
	return (
		<section className='relative z-10 py-16 md:py-20 lg:py-28'>
			<div className='container'>
				<div className='w-full'>
					<div className='wow fadeInUp mb-8 text-center md:mb-12 lg:mb-16'>
						<h2 className='text-3xl font-extrabold text-black dark:text-white sm:text-4xl md:text-[45px]'>
							Simple Affordable Pricing
						</h2>
						<p className='text-body-color mx-auto mt-4 max-w-[600px] text-base md:text-lg'>
							Get started with our flexible pricing plans. Choose the plan that
							best suits your needs and scale as you grow.
						</p>
					</div>
				</div>

				<div className='grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3'>
					{pricingData.map((price, index) => (
						<div
							key={price.priceId}
							className='wow fadeInUp shadow-signUp relative z-10 rounded-md bg-white px-8 py-10 dark:bg-[#1D2144]'
							data-wow-delay={`0.${index + 1}s`}
						>
							<div className='flex items-center justify-between'>
								<h3 className='price mb-2 text-3xl font-bold text-black dark:text-white'>
									${price.unit_amount / 100}
									<span className='time text-body-color'>/mo</span>
								</h3>
								<h4 className='mb-2 text-xl font-bold text-dark dark:text-white'>
									{price.nickname}
								</h4>
							</div>
							<p className='text-body-color mb-7 text-base'>
								{price.description}
							</p>
							<div className='border-body-color mb-8 border-b border-opacity-10 pb-8 dark:border-white dark:border-opacity-10'>
								<h5 className='text-body-color mb-3 text-lg font-medium'>
									Features
								</h5>
								<ul className='space-y-4'>
									{price.includes.map((feature, featureIndex) => (
										<li
											key={featureIndex}
											className='text-body-color flex items-center text-base'
										>
											<svg
												width='8'
												height='8'
												viewBox='0 0 8 8'
												className='mr-3 fill-current text-primary'
											>
												<circle cx='4' cy='4' r='4' />
											</svg>
											{feature}
										</li>
									))}
								</ul>
							</div>
							<button className='hover:shadow-signUp flex w-full items-center justify-center rounded-md bg-primary p-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80'>
								Choose {price.nickname}
							</button>
							{price.icon && (
								<div className='absolute right-0 top-0 z-[-1]'>
									<Image
										src={price.icon}
										alt='pricing icon'
										width={126}
										height={93}
									/>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default HomePricing;
