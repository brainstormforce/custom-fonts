const ListSkeleton = () => {
	return (
		<div className="border border-light bcf-font-list-wrap skeleton-wrap">
			{Array.from({ length: 5 }).map((_, index) => (
				<div
					key={index}
					className="flex items-center justify-between py-5 border-b border-light list-font-title"
				>
					<div className="flex items-center px-6">
						<div className="bg-gray-300 p-2 h-7 w-40 animate-pulse">
							{/* Heading Skeleton */}
						</div>
						<div className="ml-3 text-sm">
							<div className="bg-gray-300 p-3 w-16 animate-pulse">
								{/* Variation Text Skeleton */}
							</div>
						</div>
					</div>
					<div className="flex px-6">
						<div className="flex gap-x-6">
							<div className="bg-gray-300 p-3 h-1.5 w-12 animate-pulse">
								{/* Edit Skeleton */}
							</div>
							<div className="text-danger cursor-pointer">
								<div className="bg-gray-300 p-3 h-1.5 w-12 animate-pulse">
									{/* Delete Skeleton */}
								</div>
							</div>
						</div>
						<div className="ml-11 cursor-pointer">
							<div className="bg-gray-300 p-3 h-1.5 w-2 rounded-full animate-pulse">
								{/* Arrow Skeleton */}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default ListSkeleton;
