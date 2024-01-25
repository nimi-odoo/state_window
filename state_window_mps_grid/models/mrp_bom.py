from odoo import api, fields, models, _

class MrpBom(models.Model):
    _name = "mrp.bom"
    _inherit = ["mrp.bom", "state.window.mps.grid.mixin"]
