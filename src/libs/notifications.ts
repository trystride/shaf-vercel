import { Match, Keyword, Announcement, User } from '@prisma/client';
import axios from 'axios';

const PLUNK_API_URL = 'https://api.useplunk.com/v1/send';
const PLUNK_API_KEY = process.env.PLUNK_API_KEY;

type MatchWithDetails = {
	match: Match;
	keyword: Keyword & { user: User };
	announcement: Announcement;
};

export async function sendMatchNotifications(matches: MatchWithDetails[]) {
	// Group matches by user
	const userMatches = matches.reduce(
		(acc, match) => {
			const userId = match.keyword.user.id;
			if (!acc[userId]) {
				acc[userId] = {
					user: match.keyword.user,
					matches: [],
				};
			}
			acc[userId].matches.push(match);
			return acc;
		},
		{} as Record<string, { user: User; matches: MatchWithDetails[] }>
	);

	// Send notifications for each user
	for (const { user, matches } of Object.values(userMatches)) {
		try {
			await sendEmailNotification(user, matches);
		} catch (error) {
			console.error(`Failed to send notification to user ${user.id}:`, error);
		}
	}
}

async function sendEmailNotification(user: User, matches: MatchWithDetails[]) {
	const matchesByKeyword = matches.reduce(
		(acc, match) => {
			const keywordId = match.keyword.id;
			if (!acc[keywordId]) {
				acc[keywordId] = {
					keyword: match.keyword,
					announcements: [],
				};
			}
			acc[keywordId].announcements.push(match.announcement);
			return acc;
		},
		{} as Record<string, { keyword: Keyword; announcements: Announcement[] }>
	);

	const emailContent = generateEmailContent(matchesByKeyword);

	try {
		await axios.post(
			PLUNK_API_URL,
			{
				to: user.email,
				subject: 'New Bankruptcy Announcements Matching Your Keywords',
				body: emailContent,
			},
			{
				headers: {
					Authorization: `Bearer ${PLUNK_API_KEY}`,
					'Content-Type': 'application/json',
				},
			}
		);
	} catch (error) {
		console.error(
			'Error sending email via Plunk:',
			error instanceof Error ? error.message : 'Unknown error occurred'
		);
		throw error;
	}
}

function generateEmailContent(
	matchesByKeyword: Record<
		string,
		{ keyword: Keyword; announcements: Announcement[] }
	>
) {
	let content = `
    <h2>New Bankruptcy Announcements</h2>
    <p>We found new announcements matching your keywords:</p>
  `;

	for (const { keyword, announcements } of Object.values(matchesByKeyword)) {
		content += `
      <h3>Keyword: ${keyword.term}</h3>
      <ul>
        ${announcements
					.map(
						(announcement) => `
          <li>
            <strong>${announcement.title}</strong><br>
            ${announcement.description}<br>
            <small>Published: ${new Date(announcement.publishDate).toLocaleDateString()}</small>
            <br><a href="${announcement.announcementUrl}">View Announcement</a>
          </li>
        `
					)
					.join('')}
      </ul>
    `;
	}

	content += `
    <p>
      <small>
        To manage your keywords and notification settings, visit your 
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/user/dashboard/keywords">dashboard</a>.
      </small>
    </p>
  `;

	return content;
}
