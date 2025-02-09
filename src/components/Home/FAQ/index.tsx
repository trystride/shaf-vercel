'use client';
import React, { useState } from 'react';
import FaqItem from './FaqItem';
import SectionHeader from '@/components/Common/SectionHeader';
import { useTranslation } from '@/lib/useTranslation';

const FAQ = () => {
	const { t } = useTranslation();
	const [activeFaq, setActiveFaq] = useState<number | string>(1);

	const handleFaqToggle = (id: number | string) => {
		activeFaq === id ? setActiveFaq(0) : setActiveFaq(id);
	};

	return (
		<section className='overflow-hidden bg-gray-1 py-17.5 dark:bg-black lg:py-22.5 xl:py-27.5'>
			{/* <!-- section title --> */}

			<SectionHeader
				title={t('faqs.title')}
				description={t('faqs.description')}
			/>

			<div className='mx-auto w-full max-w-[662px] px-4 sm:px-8 xl:px-0'>
				<div className='flex flex-col gap-4 '>
					{/* <!-- Accordion Item --> */}
					{(t('faqs') as any[])?.map((faq, key) => (
						<FaqItem
							key={key}
							faq={faq}
							handleFaqToggle={handleFaqToggle}
							activeFaq={activeFaq}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default FAQ;
