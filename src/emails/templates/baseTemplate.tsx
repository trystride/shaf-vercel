interface BaseTemplateProps {
	children: React.ReactNode;
	previewText?: string;
}

export const BaseTemplate: React.FC<BaseTemplateProps> = ({
	children,
	previewText = '',
}) => {
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Bankruptcy Monitor Notification</title>
	<meta name="color-scheme" content="light">
	<meta name="supported-color-schemes" content="light">
	${previewText && `<meta name="description" content="${previewText}">`}
	<style>
	body {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	line-height: 1.5;
	margin: 0;
	padding: 0;
	-webkit-font-smoothing: antialiased;
	color: #333333;
	}
	.container {
	max-width: 600px;
	margin: 0 auto;
	padding: 20px;
	background-color: #ffffff;
	}
	.header {
	text-align: center;
	padding: 20px 0;
	background-color: #f8f9fa;
	border-radius: 8px;
	margin-bottom: 20px;
	}
	.content {
	padding: 20px;
	background-color: #ffffff;
	border-radius: 8px;
	border: 1px solid #e9ecef;
	}
	.footer {
	text-align: center;
	padding: 20px;
	color: #6c757d;
	font-size: 12px;
	}
	.button {
	display: inline-block;
	padding: 10px 20px;
	background-color: #007bff;
	color: #ffffff;
	text-decoration: none;
	border-radius: 4px;
	margin: 10px 0;
	}
	.announcement {
	padding: 15px;
	margin: 10px 0;
	border: 1px solid #e9ecef;
	border-radius: 4px;
	}
	.keyword {
	display: inline-block;
	padding: 2px 8px;
	background-color: #e9ecef;
	border-radius: 4px;
	font-size: 12px;
	margin: 2px;
	}
	</style>
	</head>
	<body>
	<div class="container">
	<div class="header">
	<img src="https://your-domain.com/images/logo.png" alt="Bankruptcy Monitor" width="200" />
	</div>
	<div class="content">
	${children}
	</div>
	<div class="footer">
	<p>© ${new Date().getFullYear()} Bankruptcy Monitor. All rights reserved.</p>
	<p>
	You received this email because you are subscribed to bankruptcy announcements.
	<a href="{{unsubscribe_url}}">Manage preferences</a>
	</p>
	</div>
	</div>
	</body>
	</html>
	`;
};
