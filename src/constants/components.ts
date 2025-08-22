export type ChartViewComponent = (props: {
    chartId: string;
    userId: string;
}) => React.JSX.Element;

export type ChartConfigComponent = (props: {
    userId: string;
    chartId: string;
}) => React.JSX.Element;

export type ChartStateProvider = (props: {
    children: React.ReactNode;
    chartId: string;
}) => React.ReactNode;

export type DataSettings = (props: {
    chartId: string;
    userId: string;
}) => React.JSX.Element;

export type NoPropFunction = () => React.JSX.Element;
