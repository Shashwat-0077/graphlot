import { NewChartForm } from "@/modules/BasicChart/components/NewChartForm";

type Props = {
    params: Promise<{
        collection_slug: string;
    }>;
};

export default async function NewChart({ params }: Props) {
    const { collection_slug } = await params;

    if (collection_slug === null) {
        return <div>Invalid path</div>;
    }

    return (
        <div>
            <NewChartForm collection_slug={collection_slug} />
        </div>
    );
}
