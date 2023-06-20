const SkeletonSkins = ({ activeView, count }) => {
	return activeView === "list" ? (
		<ListSkeleton count={count} />
	) : (
		<GridSkeleton count={count} />
	);
};

const ListSkeleton = ({ count }) => {
	return (
		<div className="border border-light bcf-font-list-wrap">
			{Array.from({ length: count }).map((_, index) => (
				<div
					key={index}
					className="flex items-center justify-between py-5 border-b border-light list-font-title"
				>
					<div className="flex items-center px-6">
						<div className="bg-gray-300 p-2 h-10 w-40 animate-pulse">
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
							<div className="bg-gray-300 p-3 h-2 w-12 animate-pulse">
								{/* Edit Skeleton */}
							</div>
							<div className="text-danger cursor-pointer">
								<div className="bg-gray-300 p-3 h-2 w-12 animate-pulse">
									{/* Delete Skeleton */}
								</div>
							</div>
						</div>
						<div className="sm:ml-11 mobile:ml-2 cursor-pointer">
							<div className="bg-gray-300 p-3 h-2 w-2 rounded-full animate-pulse">
								{/* Arrow Skeleton */}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

const GridSkeleton = ({ count }) => {
	return (
		<div className="grid grid-cols-3 tablet:grid-cols-2 bcf-font-grid-wrap mobile:block">
			{Array.from({ length: count }).map((_, index) => (
				<div key={index} className="p-6">
					<div className="flex justify-between items-center">
						<div className="text-neutral">
							<div className="bg-gray-300 p-3 w-16 animate-pulse">
								{/* Variation Text Skeleton */}
							</div>
						</div>
						<div className="">
							<div className="flex gap-x-6">
								<div
									data-font_id="50"
									className="text-primary cursor-pointer"
								>
									<div className="bg-gray-300 p-3 h-2 w-12 animate-pulse">
										{/* Edit Skeleton */}
									</div>
								</div>
								<div className="text-danger cursor-pointer">
									<div className="bg-gray-300 p-3 h-2 w-12 animate-pulse">
										{/* Delete Skeleton */}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-6">
						<h1 className="text-5xl">
							<div className="bg-gray-300 p-2 h-10 w-40 animate-pulse">
								{/* Heading Skeleton */}
							</div>
						</h1>
					</div>
				</div>
			))}
		</div>
	);
};

export default SkeletonSkins;
