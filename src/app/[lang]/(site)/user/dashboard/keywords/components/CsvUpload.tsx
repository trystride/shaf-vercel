import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Upload } from 'lucide-react';

export function CsvUpload({
	onUploadComplete,
}: {
	onUploadComplete: () => void;
}) {
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Check file type
		if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
			toast.error('Please upload a CSV or TXT file');
			return;
		}

		setIsUploading(true);
		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch('/api/user/keywords/bulk-upload', {
				method: 'POST',
				body: formData,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to upload keywords');
			}

			toast.success(
				`Added ${data.added} keywords. Skipped ${data.skipped} duplicates or invalid entries.`
			);
			onUploadComplete();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Failed to upload keywords'
			);
		} finally {
			setIsUploading(false);
			// Reset the input
			e.target.value = '';
		}
	};

	return (
		<div className='flex items-center gap-2'>
			<input
				ref={fileInputRef}
				type='file'
				accept='.csv,.txt'
				onChange={handleFileChange}
				className='hidden'
				disabled={isUploading}
			/>
			<button
				onClick={handleClick}
				disabled={isUploading}
				className='inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
			>
				<Upload className='mr-2 h-4 w-4' />
				{isUploading ? 'Uploading...' : 'Upload CSV'}
			</button>
		</div>
	);
}
