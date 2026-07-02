import { Skeleton } from "@/components/ui/skeleton";

export const FollowedStoreCardSkeleton = () => {
	return (
		<div className="h-18 w-full rounded-xl bg-white p-4 flex items-center gap-2 border py-8">
			<div className="relative shrink-0">
				<Skeleton className="size-14 rounded-full" />
				<Skeleton className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full" />
			</div>

			<div className="flex-1 ml-3 flex flex-col justify-center space-y-2">
				<Skeleton className="h-4 w-40" />
				<Skeleton className="h-3 w-28" />
			</div>

			<Skeleton className="size-5 rounded-md" />
		</div>
	);
};