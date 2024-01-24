/** @odoo-module */

import { formatFloat } from "@web/core/utils/numbers";

import { Component } from "@odoo/owl";

export class MilestoneDataDisplay extends Component {
    static props = {
        floor: { type: Number, optional: true },
        quantity_needed: { type: Number, optional: true },
    };

    static template = "state_window_mps_grid.MilestoneDataDisplay";

    get floor() {
        return this.props.floor;
    }

    get quantityNeeded() {
        if (!this.props.quantity_needed) return
        return formatFloat(this.props.quantity_needed);
    }

}
