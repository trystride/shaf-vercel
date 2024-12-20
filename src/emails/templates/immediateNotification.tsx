import { BaseTemplate } from './baseTemplate';
import { Announcement, Keyword } from '@prisma/client';

interface ImmediateNotificationProps {
	announcements: (Announcement & { keyword: Keyword })[];
	userName?: string;
}

export const generateImmediateNotification = ({
	announcements,
	userName,
}: ImmediateNotificationProps) => {
	const content = `
	<h1>New Bankruptcy Announcements</h1>
	<p>Hello${userName ? ` ${userName}` : ''},</p>
	<p>We found new bankruptcy announcements that match your keywords:</p>
    
	${announcements
		.map(
			(announcement) => `
	<div class="announcement">
	<h2 style="margin: 0 0 10px 0;">${announcement.title}</h2>
	<p style="margin: 0 0 10px 0;">${announcement.description}</p>
	<div>
	<span class="keyword">Matched: ${announcement.keyword.term}</span>
	</div>
	${
		announcement.announcementUrl
			? `<a href="${announcement.announcementUrl}" class="button">View Full Announcement</a>`
			: ''
	}
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
		previewText: `New bankruptcy announcements matching your keywords`,
	});
};
