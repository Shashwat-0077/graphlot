import ChartForm from "@/components/forms/new-chart-form";
import { parseSlug } from "@/utils/pathSlugsOps";

type Props = {
    params: Promise<{
        collection_slug: string;
    }>;
};

export default async function NewChart({ params }: Props) {
    const { collection_slug } = await params;

    if (collection_slug === null || collection_slug === undefined) {
        return <div>Invalid path</div>;
    }

    const { id } = parseSlug(collection_slug);

    return (
        <div className="container mx-auto max-w-5xl py-10">
            <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">
                Create New Chart
            </h1>
            <ChartForm collectionId={id} />
        </div>
    );
}
