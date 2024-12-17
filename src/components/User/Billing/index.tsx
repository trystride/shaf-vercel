import Pricing from "@/paylink/PaylinkBilling";
// import Pricing from "@/paddle/PaddleBilling";
// import Pricing from "@/lemonSqueezy/LsBilling";

const Billing = () => {
	return (
		<>
			<Pricing isBilling={true} />
		</>
	);
};

export default Billing;
