/** @odoo-module */

import { gridView } from "@web_grid/views/grid_view";
import { registry } from "@web/core/registry";
import { StateWindowGridModel } from "./state_window_grid_model";
import { StateWindowGridRenderer } from "./state_window_grid_renderer";


export const stateWindowGridView = {
    ...gridView,
    Model: StateWindowGridModel,
    Renderer: StateWindowGridRenderer,
};

registry.category("views").add('state_window_grid', stateWindowGridView);
