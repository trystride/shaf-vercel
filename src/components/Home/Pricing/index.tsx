"use client";
import Pricing from "@/paylink/PaylinkBilling";
// import Pricing from "@/paddle/PaddleBilling";
// import Pricing from "@/lemonSqueezy/LsBilling";

const HomePricing = () => {
	return (
		<>
			<Pricing isBilling={false} />
		</>
	);
};

export default HomePricing;
