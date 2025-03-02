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

export function getNullComponent<
    // eslint-disable-next-line
    Type extends (...args: any[]) => React.JSX.Element,
>(): Type {
    // We need to cast here because TypeScript can't verify that an empty component
    // will match all possible component signatures
    const NullComponent = (() => <></>) as Type;

    return NullComponent;
}
