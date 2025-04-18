import React from "react";

export default function ToggleSwitch({
    defaultChecked,
    toggleFunction,
}: {
    defaultChecked: boolean;
    toggleFunction: () => void;
}) {
    return (
        <label className="relative inline-block h-7 w-14 cursor-pointer rounded-full bg-background-light transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-primary">
            <input
                className="peer sr-only"
                id="AcceptConditions"
                type="checkbox"
                defaultChecked={defaultChecked}
                onChange={toggleFunction}
            />
            <span className="absolute inset-y-0 start-0 m-1 size-5 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"></span>
        </label>
    );
}
