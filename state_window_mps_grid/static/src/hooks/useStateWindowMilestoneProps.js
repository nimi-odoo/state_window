/** @odoo-module */

import { useComponent } from "@odoo/owl";

export function useStateWindowMilestoneProps() {
    const comp = useComponent();
    return {
        get props() {
            if (comp.resId && comp.props.milestoneData && comp.resId in comp.props.milestoneData) {
                return comp.props.milestoneData[comp.resId];
            } else {
                return {};
            }
        },
    };
}
