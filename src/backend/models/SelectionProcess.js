const mongoose = require("mongoose");

const SelectionProcessSchema = new mongoose.Schema(
  {
    messageDate: { type: Date, required: true },
    scheduledDate: { type: Date, required: true },
    time: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    confirmedPresence: { type: String, enum: ["Sim", "Não", "Pendente"], default: "Pendente" },
    attended: { type: String, enum: ["Sim", "Não", "Pendente"], default: "Pendente" },
    source: { type: String, default: "", trim: true },
    approved: { type: String, enum: ["Sim", "Não", "Pendente"], default: "Pendente" },
    scheduledBy: { type: String, default: "", trim: true },
    attendedBy: { type: String, default: "", trim: true },
    hired: { type: String, enum: ["Sim", "Não", "Pendente"], default: "Pendente" },
    notes: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

SelectionProcessSchema.index({ name: "text", role: "text", source: "text", notes: "text" });

module.exports = mongoose.model("SelectionProcess", SelectionProcessSchema);
