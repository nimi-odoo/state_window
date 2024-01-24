/** @odoo-module */

import { registry } from "@web/core/registry";
import { Many2OneGridRow, many2OneGridRow } from "@web_grid/components/many2one_grid_row/many2one_grid_row";
import { MilestoneDataDisplay } from "./milestone_data_display"; 
import { useStateWindowMilestoneProps } from "../hooks/useStateWindowMilestoneProps";  

export class StateWindowMany2OneGridRow extends Many2OneGridRow {
    static template = "state_window_mps_grid.StateWindowMany2OneGridRow";

    static components = {
        ...Many2OneGridRow.components,
        MilestoneDataDisplay,
    };

    static props = {
        ...Many2OneGridRow.props,
        milestoneData: { type: Object, optional: true },
    };

    setup() {
        super.setup(...arguments);
        this.stateWindowMilestoneProps = useStateWindowMilestoneProps();
    }

    get milestoneProps() {
        return {
            ...this.stateWindowMilestoneProps.props,
            // name: this.props.name,
        }
    }

}

export const stateWindowMany2OneGridRow = {
    ...many2OneGridRow,
    component: StateWindowMany2OneGridRow,
};

registry.category("grid_components").add("state_window_milestone_many2one", stateWindowMany2OneGridRow);
