'use client';
import React from 'react';
import CountUp from './CountUp';

const Counter = () => {
	return (
		<section className='counter-section pb-17.5 pt-17.5 lg:pb-22.5 xl:pb-27.5 relative overflow-hidden'>
			<div className='absolute left-1/2 top-0 h-px w-full max-w-[1170px] -translate-x-1/2 bg-gradient-to-r from-[#D7D7D7]/0 via-[#D7D7D7] to-[#D7D7D7]/0 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800'></div>

			<div className='mx-auto w-full  px-4 sm:px-8 xl:px-0'>
				<h2 className='mb-12.5 text-heading-5 text-center font-satoshi font-bold -tracking-[1.2px] text-black dark:text-white'>
					Numbers speaking for themselves
				</h2>

				<div className='lg:gap-12.5 xl:gap-17.5 flex flex-col items-center justify-center gap-7.5 sm:flex-row'>
					<div className='w-[250px] text-center '>
						<h3 className='text-heading-4 lg:text-heading-2 mb-2.5 font-satoshi font-bold -tracking-[1.6px] text-primary xl:text-[55px] xl:leading-[1.05]'>
							<CountUp targetNumber={20} />
							<span className='-ml-3'>+</span>
						</h3>
						<p className='text-lg font-medium -tracking-[0.2px]'>
							Integrations
						</p>
					</div>

					{/* <!-- divider --> */}
					<div className='h-px w-20 bg-stroke dark:bg-stroke-dark sm:h-20 sm:w-px'></div>

					<div className='w-[250px] text-center'>
						<h3 className='text-heading-4 lg:text-heading-2 mb-2.5 font-satoshi font-bold -tracking-[1.6px] text-primary xl:text-[55px] xl:leading-[1.05]'>
							<CountUp targetNumber={100} />
							<span className='-ml-3'>+</span>
						</h3>
						<p className='text-lg font-medium -tracking-[0.2px]'>
							UI Components and Pages
						</p>
					</div>

					{/* <!-- divider --> */}
					<div className='h-px w-20 bg-stroke dark:bg-stroke-dark sm:h-20 sm:w-px'></div>

					<div className='w-[250px] text-center'>
						<h3 className='text-heading-4 lg:text-heading-2 mb-2.5 font-satoshi font-bold -tracking-[1.6px] text-primary xl:text-[55px] xl:leading-[1.05]'>
							<CountUp targetNumber={12000} />

							<span className='-ml-3'>+</span>
						</h3>
						<p className='text-lg font-medium -tracking-[0.2px]'>USD Saved</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Counter;
