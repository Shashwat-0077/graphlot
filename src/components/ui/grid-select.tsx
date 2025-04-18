import React from "react";

import { GridType } from "@/constants";

const GridSelect = ({
    // eslint-disable-next-line
    grid_type,
    // eslint-disable-next-line
    setGridType,
}: {
    grid_type: GridType;
    setGridType: (grid_type: GridType) => void;
}) => {
    // TODO : design select
    return <div>GridSelect</div>;
};

export { GridSelect };
