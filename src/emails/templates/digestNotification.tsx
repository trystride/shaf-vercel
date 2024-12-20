import { BaseTemplate } from './baseTemplate';
import { Announcement, Keyword } from '@prisma/client';
import { format } from 'date-fns';

interface DigestNotificationProps {
	announcements: (Announcement & { keyword: Keyword })[];
	userName?: string;
	frequency: 'DAILY' | 'WEEKLY';
	periodStart: Date;
	periodEnd: Date;
}

export const generateDigestNotification = ({
	announcements,
	userName,
	frequency,
	periodStart,
	periodEnd,
}: DigestNotificationProps) => {
	// Group announcements by keyword
	const groupedAnnouncements = announcements.reduce(
		(acc, curr) => {
			const keywordTerm = curr.keyword.term;
			if (!acc[keywordTerm]) {
				acc[keywordTerm] = [];
			}
			acc[keywordTerm].push(curr);
			return acc;
		},
		{} as Record<string, typeof announcements>
	);

	const periodText =
		frequency === 'DAILY'
			? format(periodStart, 'MMMM d, yyyy')
			: `${format(periodStart, 'MMMM d')} - ${format(periodEnd, 'MMMM d, yyyy')}`;

	const content = `
	<h1>${frequency.charAt(0) + frequency.slice(1).toLowerCase()} Bankruptcy Digest</h1>
	<p>Hello${userName ? ` ${userName}` : ''},</p>
	<p>Here's your ${frequency.toLowerCase()} digest of bankruptcy announcements for ${periodText}:</p>
    
	${Object.entries(groupedAnnouncements)
		.map(
			([keyword, announcements]) => `
	<div style="margin: 20px 0;">
	<h2 style="color: #666; font-size: 16px; margin-bottom: 10px;">
	Matches for keyword: <span class="keyword">${keyword}</span>
	</h2>
	${announcements
		.map(
			(announcement) => `
	<div class="announcement">
	<h3 style="margin: 0 0 10px 0;">${announcement.title}</h3>
	<p style="margin: 0 0 10px 0;">${announcement.description}</p>
	<p style="color: #666; font-size: 12px; margin: 0;">
	Published: ${format(announcement.publishDate, 'PPp')}
	</p>
	${
		announcement.announcementUrl
			? `<a href="${announcement.announcementUrl}" class="button">View Full Announcement</a>`
			: ''
	}
	</div>
	`
		)
		.join('')}
	</div>
	`
		)
		.join('')}
    
	<p style="margin-top: 20px;">
	You can manage your notification preferences in your 
	<a href="{{dashboard_url}}">dashboard settings</a>.
	</p>
	`;

	return BaseTemplate({
		children: content,
		previewText: `Your ${frequency.toLowerCase()} bankruptcy announcements digest`,
	});
};
