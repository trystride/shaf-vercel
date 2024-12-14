import Hero from "./Hero";
import Features from "./Features";
import FeaturesWithImage from "./FeaturesWithImage";
import Counter from "./Counter";
import CallToAction from "./CallToAction";
import Testimonials from "./Testimonials";
import Pricing from "./Pricing";
import FAQ from "./FAQ";
import Blog from "./Blog";
import Newsletter from "./Newsletter";

import { integrations } from "../../../integrations.config";

const Home = () => {
	return (
		<>
			<Hero />
			<Features />
			<FeaturesWithImage />
			<Counter />
			<CallToAction />
			<Testimonials />
			<Pricing />
			<FAQ />
			<Newsletter />
			{integrations?.isSanityEnabled && <Blog />}
		</>
	);
};

export default Home;
