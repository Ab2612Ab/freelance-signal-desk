/**
 * Future API service layer.
 *
 * Today the app is frontend-only: every call resolves against the local
 * adapter, which reads/writes browser localStorage via the store. If a real
 * backend is added later, implement `LeadService` with a remote adapter and
 * swap it in `getLeadService()` — UI code does not need to change.
 *
 * There is intentionally NO Upwork, email, WhatsApp or AI integration here.
 */
import type { Lead, LeadInput } from "@/lib/types";
import { actions, getState } from "@/lib/store";

export interface LeadService {
  list(): Promise<Lead[]>;
  create(input: LeadInput): Promise<Lead>;
  update(id: string, patch: Partial<Lead>): Promise<void>;
  remove(ids: string[]): Promise<void>;
}

export const localLeadAdapter: LeadService = {
  async list() { return getState().leads; },
  async create(input) { return actions.addLead(input); },
  async update(id, patch) { actions.updateLead(id, patch); },
  async remove(ids) { actions.deleteLeads(ids); },
};

export function getLeadService(): LeadService {
  return localLeadAdapter;
}
