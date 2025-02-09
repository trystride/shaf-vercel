import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/useTranslation';

const Hero = () => {
	const { t } = useTranslation();
	return (
		<section className='relative z-10 overflow-hidden pb-16 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]'>
			<div className='container'>
				<div className='-mx-4 flex flex-wrap'>
					<div className='w-full px-4'>
						<div className='mx-auto max-w-[800px] text-center'>
							<h1 className='mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight'>
								{t('metadata.title')}
							</h1>
							<p className='text-body-color dark:text-body-color-dark mb-12 text-base font-medium !leading-relaxed sm:text-lg md:text-xl'>
								{t('metadata.description')}
							</p>
							<div className='flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
								<Link
									href='/signup'
									className='rounded-md bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80'
								>
									{t('common.getStarted')}
								</Link>
								<Link
									href='/docs'
									className='rounded-md bg-black/20 px-8 py-4 text-base font-semibold text-black duration-300 ease-in-out hover:bg-black/30 dark:bg-white/20 dark:text-white dark:hover:bg-white/30'
								>
									{t('common.documentation')}
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100'>
				<Image
					src='/images/hero/shape-1.svg'
					alt={t('common.decorativeShape')}
					width={364}
					height={201}
				/>
			</div>
			<div className='absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100'>
				<Image
					src='/images/hero/shape-2.svg'
					alt={t('common.decorativeShape')}
					width={364}
					height={201}
				/>
			</div>
		</section>
	);
};

export default Hero;
