import Breadcrumb from '@/components/Common/Dashboard/Breadcrumb';
import CreateToken from '@/components/User/Api/CreateToken';
import TokenList from '@/components/User/Api/TokenList';
import { Metadata } from 'next';
import { getApiKeys } from '@/actions/api-key';

export const metadata: Metadata = {
	title: 'واجهة برمجة التطبيقات',
	description: 'صفحة مفتاح واجهة برمجة التطبيقات',
	// other discriptions
};

export default async function UserApiPage() {
	const tokens = await getApiKeys();

	return (
		<>
			<Breadcrumb pageTitle='واجهة برمجة التطبيقات' />
			<div className='flex flex-col gap-y-10 lg:flex-row lg:gap-x-8 lg:gap-y-4'>
				<CreateToken />
				<TokenList tokens={tokens} />
			</div>
		</>
	);
}
