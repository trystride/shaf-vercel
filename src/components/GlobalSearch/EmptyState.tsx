import React from "react";
import { connectHits } from "react-instantsearch-dom";
import { integrations, messages } from "../../../integrations.config";

const EmptyState = ({ hits }: any) => {
	return (
		<>
			{!integrations?.isAlgoliaEnabled ? (
				<div className='p-8'>{messages.algolia}</div>
			) : hits?.length == 0 ? (
				<div className='p-8'>
					<p className='text-body-color text-center text-base'>
						No items found...
					</p>
				</div>
			) : null}
		</>
	);
};

export default connectHits(EmptyState);
