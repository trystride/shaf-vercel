'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ShareIcon, CalendarIcon, DownloadIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import DOMPurify from 'isomorphic-dompurify';
import { useTranslation } from '@/app/context/TranslationContext';

// Safe HTML rendering component
const SafeHTML: React.FC<{ html: string; className?: string }> = ({
	html,
	className,
}) => {
	// biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized by DOMPurify
	return (
		<div
			className={className}
			dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
		/>
	);
};

const sanitizeHtml = (html: string): string => {
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a'],
		ALLOWED_ATTR: ['href', 'target', 'class'],
	});
};

interface Announcement {
	Id: string;
	AnnId: string;
	ActionType: string;
	ActionTypeID: number;
	ActionTypeEn: string;
	CourtType: string;
	AnnouncementType: string;
	Status: string | null;
	RequestId: string;
	StatusId: number;
	Header: string;
	Comment: string | null;
	Body: string | null;
	PublishDate: string;
	debtorName: string;
	ActionDate: string | null;
	url: string;
	AnnCreatedDate: string | null;
	PageItems: unknown;
	debtorIdentifier: string;
	matchedKeyword: string;
}

export default function AnnouncementsPage() {
	const { data: session } = useSession();
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedKeyword, setSelectedKeyword] = useState<string>('all');
	const [keywords, setKeywords] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const t = useTranslation();
	// Create a safer way to access announcements translations
	const announcementsT = t.announcements || {};
	
	// Type guard to check if messages property exists
	const hasMessages = (obj: any): obj is { messages: Record<string, string> } => {
		return obj && typeof obj === 'object' && 'messages' in obj;
	};

	// Helper function to get the correct message from translations
	const getMessage = (key: string): string => {
		// Check if the message is in announcementsT.messages.{key} (Arabic structure)
		if (hasMessages(announcementsT) && key in announcementsT.messages) {
			// Use type assertion to handle the string indexing
			return (announcementsT.messages as Record<string, string>)[key];
		}
		// Otherwise check if it's directly in announcementsT.{key} (English structure)
		if (key in announcementsT) {
			const value = announcementsT[key as keyof typeof announcementsT];
			if (typeof value === 'string') {
				return value;
			}
		}
		// Fallback
		return key;
	};
	
	// Helper function to safely access any translation key
	const getTranslation = (key: string, fallback: string = key): string => {
		if (key in announcementsT) {
			const value = announcementsT[key as keyof typeof announcementsT];
			if (typeof value === 'string') {
				return value;
			}
		}
		return fallback;
	};
	
	// Helper function to safely access nested translation objects
	const getNestedTranslation = (obj: any, key1: string, key2: string | null = null, fallback: string): string => {
		// If obj is undefined or not an object, return fallback
		if (!obj || typeof obj !== 'object') {
			return fallback;
		}

		// If we're only looking for a single level (key2 is null)
		if (key2 === null) {
			if (key1 in obj) {
				const value = obj[key1];
				if (typeof value === 'string') {
					return value;
				}
			}
			return fallback;
		}

		// For two levels of nesting
		if (key1 in obj && typeof obj[key1] === 'object' && obj[key1] !== null && key2 in obj[key1]) {
			const value = obj[key1][key2];
			if (typeof value === 'string') {
				return value;
			}
		}

		return fallback;
	};

	const formatDate = (date: string) => {
		try {
			const d = new Date(date);
			return d.toLocaleDateString('ar-SA', {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				calendar: 'islamic',
			});
		} catch (error) {
			console.error('Error formatting date:', error);
			return 'Invalid Date';
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			if (!session) return;

			setLoading(true);
			try {
				const [announcementsRes, keywordsRes] = await Promise.all([
					fetch('/api/user/announcements', {
						cache: 'no-store',
					}),
					fetch('/api/user/keywords', {
						cache: 'no-store',
					}),
				]);

				if (!announcementsRes.ok || !keywordsRes.ok) {
					const announcementsError = !announcementsRes.ok
						? await announcementsRes.json()
						: null;
					const keywordsError = !keywordsRes.ok
						? await keywordsRes.json()
						: null;

					console.error('Error fetching data:', {
						announcements: announcementsError || announcementsRes.statusText,
						keywords: keywordsError || keywordsRes.statusText,
					});

					toast.error(
						announcementsError?.error || getNestedTranslation(announcementsT, 'errors', 'fetchFailed', 'Failed to fetch announcements')
					);
					return;
				}

				const [announcementsData, keywordsData] = await Promise.all([
					announcementsRes.json(),
					keywordsRes.json(),
				]);

				if (Array.isArray(announcementsData)) {
					setAnnouncements(announcementsData);
				} else {
					console.error(
						'Invalid announcements data format:',
						announcementsData
					);
					toast.error(getNestedTranslation(announcementsT, 'errors', 'invalidData', 'Invalid data format'));
				}

				if (Array.isArray(keywordsData)) {
					setKeywords(keywordsData.map((k) => k.term));
				} else {
					console.error('Invalid keywords data format:', keywordsData);
					toast.error(getNestedTranslation(announcementsT, 'errors', 'keywordsFailed', 'Failed to load keywords'));
				}
			} catch (error) {
				console.error('Error in fetchData:', error);
				toast.error(getNestedTranslation(announcementsT, 'errors', 'generalError', 'An error occurred while loading data'));
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [session, t]);

	const filteredAnnouncements = announcements.filter((ann) =>
		selectedKeyword === 'all' ? true : ann.matchedKeyword === selectedKeyword
	);

	const paginatedAnnouncements = filteredAnnouncements.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handleShare = async (announcement: Announcement) => {
		try {
			const shareUrl = `https://bankruptcy.gov.sa/ar/Announcements/Pages/announcementDetails.aspx?AdID=${announcement.url}`;
			if (navigator.share) {
				await navigator.share({
					title: announcement.Header,
					text: announcement.Comment || '',
					url: shareUrl,
				});
			} else {
				await navigator.clipboard.writeText(shareUrl);
				// You might want to add a toast notification here
			}
		} catch (error) {
			console.error('Error sharing:', error);
		}
	};

	const exportToCSV = () => {
		if (announcements.length === 0) return;

		// Define CSV headers and map announcement data
		const headers = [
			'رقم الإعلان',
			'العنوان',
			'نوع الإجراء',
			'المحكمة',
			'تاريخ النشر',
			'الكلمة المفتاحية المطابقة',
			'الرابط',
		];

		const csvData = announcements.map((announcement) => [
			announcement.AnnId,
			announcement.Header,
			announcement.ActionType,
			announcement.CourtType,
			new Date(announcement.PublishDate).toLocaleDateString('ar-SA'),
			announcement.matchedKeyword,
			`https://bankruptcy.gov.sa/ar/Announcements/Pages/announcementDetails.aspx?AdID=${announcement.url}`,
		]);

		// Create CSV content
		const csvContent = [
			headers.join(','),
			...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
		].join('\n');

		// Create and trigger download
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);

		link.setAttribute('href', url);
		link.setAttribute(
			'download',
			`${getNestedTranslation(announcementsT, 'export', 'filename', 'announcements')}_${new Date().toISOString().split('T')[0]}.csv`
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<>
			<Toaster position='top-center' />
			<div className='container mx-auto space-y-6 py-6'>
				<div className='mb-8 flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<h1 className='text-2xl font-semibold text-gray-700'>
							{getNestedTranslation(announcementsT, 'title', null, 'Announcements')}
						</h1>
						{announcements.length > 0 && (
							<Button
								variant='outline'
								size='sm'
								className='border-[#00A7B1] text-[#00A7B1] hover:bg-[#00A7B1] hover:text-white'
								onClick={exportToCSV}
							>
								<DownloadIcon className='mr-2 h-4 w-4' />
								{getNestedTranslation(announcementsT, 'export', 'button', 'Export to CSV')}
							</Button>
						)}
					</div>
					<div className='w-[200px]'>
						<Select
							value={selectedKeyword}
							onValueChange={(value) => {
								setSelectedKeyword(value);
								setCurrentPage(1);
							}}
						>
							<SelectTrigger className='w-full border-gray-200 bg-white focus:ring-[#00A7B1] focus:ring-offset-0'>
								<div className='flex items-center gap-2'>
									<span className='text-gray-600'>{getNestedTranslation(announcementsT, 'filter', 'label', 'Filter by keyword')}</span>
									<span className='font-medium text-gray-900'>
										{selectedKeyword === 'all'
											? getNestedTranslation(announcementsT, 'filter', 'allKeywords', 'All keywords')
											: selectedKeyword}
									</span>
								</div>
							</SelectTrigger>
							<SelectContent
								align='end'
								className='w-[200px] border border-gray-200 bg-white shadow-lg'
							>
								<SelectItem
									value='all'
									className='px-3 py-2 text-gray-900 hover:bg-[#00A7B1]/5 focus:bg-[#00A7B1]/5'
								>
									<div className='flex items-center gap-2'>
										<span className='font-medium'>{getNestedTranslation(announcementsT, 'filter', 'allKeywords', 'All keywords')}</span>
									</div>
								</SelectItem>
								<div className='max-h-[200px] overflow-auto'>
									{keywords.map((keyword) => (
										<SelectItem
											key={keyword}
											value={keyword}
											className='px-3 py-2 text-gray-900 hover:bg-[#00A7B1]/5 focus:bg-[#00A7B1]/5'
										>
											<div className='flex items-center gap-2'>
												<Badge
													variant='secondary'
													className='bg-[#00A7B1]/10 text-[#00A7B1] hover:bg-[#00A7B1]/20'
												>
													{keyword}
												</Badge>
											</div>
										</SelectItem>
									))}
								</div>
							</SelectContent>
						</Select>
					</div>
				</div>

				{loading ? (
					<div className='grid gap-4'>
						{[...Array(3)].map((_, i) => (
							<Card key={i} className='bg-white'>
								<CardContent className='p-6'>
									<div className='mb-4 flex items-center justify-between'>
										<Skeleton className='h-4 w-32' />
										<Skeleton className='h-4 w-48' />
									</div>
									<Skeleton className='mb-4 h-6 w-2/3' />
									<Skeleton className='h-20 w-full' />
								</CardContent>
							</Card>
						))}
					</div>
				) : (
					<div className='grid gap-4'>
						{paginatedAnnouncements.map((announcement) => (
							<Card
								key={announcement.Id}
								className='mb-4 border border-gray-100 bg-white transition-shadow hover:shadow-md'
							>
								<CardContent className='p-6'>
									<div className='text-right'>
										<div className='mb-3 flex justify-end'>
											<Badge
												variant='secondary'
												className='bg-[#00A7B1]/10 text-[#00A7B1] hover:bg-[#00A7B1]/20'
											>
												{announcement.matchedKeyword}
											</Badge>
										</div>
										<div className='mb-4 flex items-center justify-between text-sm text-gray-500'>
											<div className='flex items-center'>
												<Button
													type='button'
													onClick={() => handleShare(announcement)}
													className='text-gray-600 hover:text-gray-800'
													title={getNestedTranslation(announcementsT, 'card', 'share', 'Share')}
												>
													<ShareIcon className='h-4 w-4' />
												</Button>
											</div>
											<div className='flex items-center gap-2 text-right'>
												<CalendarIcon className='h-4 w-4' />
												<span className='text-gray-600' dir='rtl'>
													{formatDate(announcement.PublishDate)}
												</span>
											</div>
										</div>
										<div className='mb-2 text-sm text-gray-600'>
											{announcement.ActionType}
										</div>
										<h3 className='mb-4 cursor-pointer text-xl font-semibold text-[#00A7B1] hover:text-[#008288]'>
											{announcement.Header}
										</h3>
										{announcement.Comment && (
											<div className='relative'>
												<SafeHTML
													className='mb-2 text-sm leading-relaxed text-gray-600'
													html={`${announcement.Comment} <a href="https://bankruptcy.gov.sa/ar/Announcements/Pages/announcementDetails.aspx?AdID=${announcement.url}" 
                              class="text-[#00A7B1] hover:text-[#008288]">
                              ${getNestedTranslation(announcementsT, 'card', 'readMore', 'Read More')}
                          </a>`}
												/>
											</div>
										)}
										{announcement.Body && (
											<SafeHTML
												className='mt-4 text-gray-700'
												html={announcement.Body}
											/>
										)}
										<p className='mt-2 text-sm text-gray-500' dir='rtl'>
											{getNestedTranslation(announcementsT, 'card', 'matchedKeyword', 'Matched keyword')} ${announcement.matchedKeyword}
										</p>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}

				{!loading && paginatedAnnouncements.length > 0 && (
					<div className='mt-6 flex justify-center gap-2'>
						<Button
							variant='outline'
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							disabled={currentPage === 1}
							className='border-[#00A7B1] text-[#00A7B1] hover:bg-[#00A7B1] hover:text-white'
						>
							{getNestedTranslation(announcementsT, 'pagination', 'previous', 'Previous')}
						</Button>
						<div className='mx-4 flex items-center text-sm text-gray-600' dir='rtl'>
							{getNestedTranslation(announcementsT, 'pagination', 'page', 'Page')} {currentPage} {getNestedTranslation(announcementsT, 'pagination', 'of', 'of')}{' '}
							{Math.ceil(filteredAnnouncements.length / itemsPerPage)}
						</div>
						<Button
							variant='outline'
							onClick={() =>
								setCurrentPage((p) =>
									Math.min(
										Math.ceil(filteredAnnouncements.length / itemsPerPage),
										p + 1
									)
								)
							}
							disabled={
								currentPage ===
								Math.ceil(filteredAnnouncements.length / itemsPerPage)
							}
							className='border-[#00A7B1] text-[#00A7B1] hover:bg-[#00A7B1] hover:text-white'
						>
							{getNestedTranslation(announcementsT, 'pagination', 'next', 'Next')}
						</Button>
					</div>
				)}

				{!loading && filteredAnnouncements.length === 0 && (
					<div className='py-12 text-center'>
						<p className='text-gray-500'>{getTranslation('noResults')}</p>
					</div>
				)}
			</div>
		</>
	);
}
