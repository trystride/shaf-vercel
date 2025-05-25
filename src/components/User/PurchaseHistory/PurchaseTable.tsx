import { useTranslation } from '@/app/context/TranslationContext';

export default function PurchaseTable({ data }: any) {
	const t = useTranslation();
	return (
		<div className='rounded-10 bg-white shadow-1 dark:bg-gray-dark'>
			<div>
				<table className='w-full'>
					<thead className='border-b border-stroke dark:border-stroke-dark'>
						<tr>
							<th className='p-5 pl-7.5 text-right font-satoshi text-base font-medium tracking-[-.2px] text-body dark:text-gray-5 sm:min-w-[200px]'>
								{t.invoice.table.plan}
							</th>
							<th className='hidden p-5 text-right font-satoshi text-base font-medium tracking-[-.2px] text-body dark:text-gray-5 xl:table-cell'>
								{t.invoice.table.nextBillingDate}
							</th>
							<th className='hidden p-5 text-right font-satoshi text-base font-medium tracking-[-.2px] text-body dark:text-gray-5 md:table-cell'>
								{t.invoice.table.transactionId}
							</th>
							<th className='hidden p-5 text-right font-satoshi text-base font-medium tracking-[-.2px] text-body dark:text-gray-5 xl:table-cell'>
								{t.invoice.table.totalAmount}
							</th>
							<th className='hidden p-5 pr-7.5 text-right font-satoshi text-base font-medium tracking-[-.2px] text-body dark:text-gray-5'>
								{t.invoice.table.action}
							</th>
						</tr>
					</thead>

					<tbody>
						<tr className='border-b border-stroke last-of-type:border-none dark:border-stroke-dark'>
							<td className='p-5 pl-7.5 text-right tracking-[-.16px] text-dark dark:text-white'>
								<span className='text-body dark:text-gray-5 xl:hidden'>
									{t.invoice.table.name}:{' '}
								</span>
								{data?.nickname}
								<span className='block xl:hidden'>
									<span className='text-body dark:text-gray-5'>
										{t.invoice.table.nextBillingDate}:{' '}
									</span>
									{new Date(data?.currentPeriodEnd as Date).toDateString()}
								</span>
								<span className='block md:hidden'>
									<span className='text-body dark:text-gray-5'>
										{t.invoice.table.transactionId}:
									</span>
									{data?.subscriptionId}
								</span>
								<span className='block xl:hidden'>
									<span className='text-body dark:text-gray-5'>
										{t.invoice.table.amount}:
									</span>
									${data?.unit_amount / 100}{' '}
								</span>
								<span className='block xl:hidden'>
									<span className='text-body dark:text-gray-5'>
										{t.invoice.table.action}:
									</span>
									<button className='ml-auto flex h-8.5 items-center justify-center rounded-md bg-primary px-4.5 font-satoshi text-sm font-medium tracking-[-.1px] text-white duration-300 hover:bg-primary-dark'>
										{t.invoice.table.download}
									</button>
								</span>
							</td>
							<td className='hidden p-5 text-right tracking-[-.16px] text-dark dark:text-white xl:table-cell'>
								{new Date(data?.currentPeriodEnd as Date).toDateString()}
							</td>
							<td className='hidden p-5 text-right tracking-[-.16px] text-dark dark:text-white md:table-cell'>
								{data?.subscriptionId}
							</td>
							<td className='hidden p-5 text-right tracking-[-.16px] text-dark dark:text-white xl:table-cell'>
								${data?.unit_amount / 100}
							</td>
							<td className='hidden p-5 pr-7.5 text-right tracking-[-.16px] text-dark dark:text-white'>
								<button className='ml-auto flex h-8.5 items-center justify-center rounded-md bg-primary px-4.5 font-satoshi text-sm font-medium tracking-[-.1px] text-white duration-300 hover:bg-primary-dark'>
									{t.invoice.table.download}
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
