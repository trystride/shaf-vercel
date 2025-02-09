import { Price } from '@/types/priceItem';

export const pricingData: Price[] = [
	{
		priceId: 'price_1ObHbkLtGdPVhGLem0CLA5iT',
		unit_amount: 9 * 100, // $9/month
		nickname: 'المبتدئ',
		description: 'مثالي للأفراد والمشاريع الصغيرة',
		subtitle: 'للأفراد',
		includes: [
			'مراقبة كلمتين رئيسيتين',
			'إشعارات فورية',
			'لوحة تحليلات أساسية',
			'تنبيهات البريد الإلكتروني',
			'سجل الإعلانات لمدة 7 أيام',
		],
		icon: `/images/pricing/pricing-icon-01.svg`,
	},
	{
		priceId: 'price_1ObHcJLtGdPVhGLeBp9hB4nv',
		unit_amount: 29 * 100, // $29/month
		nickname: 'المحترف',
		description: 'مثالي للشركات والفرق النامية',
		subtitle: 'الأكثر شعبية',
		includes: [
			'مراقبة 10 كلمات رئيسية',
			'تحليلات وتقارير متقدمة',
			'إشعارات ذات أولوية',
			'تكامل مع Slack',
			'سجل الإعلانات لمدة 30 يوماً',
			'الوصول إلى API',
		],
		icon: `/images/pricing/pricing-icon-02.svg`,
		icon2: `/images/pricing/pricing-icon-02-2.svg`,
		active: true,
	},
	{
		priceId: 'price_1ObHcXLtGdPVhGLejTMpdiT8',
		unit_amount: 99 * 100, // $99/month
		nickname: 'المؤسسات',
		description: 'للمؤسسات التي تحتاج إلى تغطية قصوى',
		subtitle: 'للفرق الكبيرة',
		includes: [
			'كلمات رئيسية غير محدودة',
			'حلول تحليلات مخصصة',
			'مدير حساب مخصص',
			'تكاملات مخصصة',
			'سجل غير محدود',
			'دعم ذو أولوية',
			'تطوير ميزات مخصصة',
		],
		icon: `/images/pricing/pricing-icon-03.svg`,
	},
];
