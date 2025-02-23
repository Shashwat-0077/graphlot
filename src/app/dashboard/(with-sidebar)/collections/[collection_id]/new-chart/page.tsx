import { NewChartForm } from "@/modules/charts/components/NewChartForm";
import { decodeFromUrl } from "@/utils/pathSerialization";

type Props = {
    params: Promise<{
        collection_id: string;
    }>;
};

export default async function NewChart({ params }: Props) {
    const { collection_id: encodedId } = await params;

    const pathObj = decodeFromUrl(encodedId);

    if (pathObj === null) {
        return <div>Invalid path</div>;
    }

    return (
        <div>
            <NewChartForm collection_Id={pathObj.path} />
        </div>
    );
}
