export const onScroll = () => {
	const sections = document.querySelectorAll('section[id]');
	const scrollY = window.pageYOffset;

	sections.forEach((current: any) => {
		const sectionHeight = current.offsetHeight;
		const sectionTop = current.offsetTop - 96;
		const sectionId = current.getAttribute('id');

		if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
			document
				.querySelector(`.menu-scroll[href*="${sectionId}"]`)
				?.classList.add(
					'bg-primary/5',
					'text-primary',
					'dark:bg-white/5',
					'dark:text-white'
				);
		} else {
			document
				.querySelector(`.menu-scroll[href*="${sectionId}"]`)
				?.classList.remove(
					'bg-primary/5',
					'text-primary',
					'dark:bg-white/5',
					'dark:text-white'
				);
		}
	});
};
