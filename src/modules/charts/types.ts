export type ChartViewComponentType = ({
    chartName,
    notion_table_id,
}: {
    chartName: string;
    notion_table_id: string;
}) => React.JSX.Element;

export type ChartConfigComponentType = ({
    notion_table_id,
}: {
    notion_table_id: string;
}) => React.JSX.Element;

export type StateProviderType = ({
    children,
}: {
    children: React.ReactNode;
}) => React.JSX.Element;
