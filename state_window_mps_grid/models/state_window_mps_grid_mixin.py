
from odoo import api, models
from odoo.tools import float_round


class StateWindowMpsGridMixin(models.AbstractModel):
    _name = 'state.window.mps.grid.mixin'
    _description = 'State Window MPS Grid mixin'

    @api.model
    def get_floor_and_quantity_needed(self, ids):
        """
        Method called by the milestone widgets on the frontend in gridview to get information
        about the quantity needed for each record.
        """
        records = self.search_read(
            self.get_floor_and_quantity_needed_domain(ids),
            ["id"] + self.get_milestone_fields(),
        )

        records_per_id = dict.fromkeys(ids, {})
        for record in records:
            records_per_id[record['id']] = {
                # "floor": record.floor,
                "quantity_needed": record["quantity_needed"],
            }
        return records_per_id

    def get_floor_and_quantity_needed_domain(self, ids):
        return [("id", "in", ids)]
