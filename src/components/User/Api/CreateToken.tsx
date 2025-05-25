'use client';
import Card from '@/components/Common/Dashboard/Card';
import FormButton from '@/components/Common/Dashboard/FormButton';
import InputGroup from '@/components/Common/Dashboard/InputGroup';
import { createApiKey } from '@/actions/api-key';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from '@/app/context/TranslationContext';

export default function CreateToken() {
	const ref = useRef<HTMLFormElement>(null);
	const t = useTranslation();

	return (
		<div className='lg:w-2/6'>
			<Card>
				<div className='mb-6'>
					<h3 className='mb-2.5 font-satoshi text-custom-2xl font-bold tracking-[-.5px] text-dark dark:text-white'>
						{t.api.createToken.title}
					</h3>
					<p className='text-body'>{t.api.createToken.description}</p>
				</div>

				<form
					ref={ref}
					action={async (formData) => {
						try {
							await createApiKey(formData.get('token') as string);
							toast.success(t.api.createToken.success);
						} catch (error) {
							toast.error(t.api.createToken.error);
						}

						ref.current?.reset();
					}}
					className='space-y-5.5'
				>
					<InputGroup
						label={t.api.createToken.tokenName}
						name='token'
						placeholder={t.api.createToken.tokenNamePlaceholder}
						type='text'
						required={true}
					/>

					<FormButton>{t.api.createToken.createButton}</FormButton>
				</form>
			</Card>
		</div>
	);
}
