import React from "react";

export default function ToggleSwitch({
    defaultChecked,
    toggleFunction,
}: {
    defaultChecked: boolean;
    toggleFunction: () => void;
}) {
    return (
        <label className="bg-muted has-[:checked]:bg-primary relative inline-block h-7 w-14 cursor-pointer rounded-full transition [-webkit-tap-highlight-color:_transparent]">
            <input
                className="peer sr-only"
                id="AcceptConditions"
                type="checkbox"
                defaultChecked={defaultChecked}
                onChange={toggleFunction}
            />
            <span className="absolute inset-y-0 start-0 m-1 size-5 rounded-full bg-gray-300 ring-[6px] ring-white transition-all ring-inset peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"></span>
        </label>
    );
}
