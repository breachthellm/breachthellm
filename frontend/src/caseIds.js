// Placeholder case-ID formatting, not derived from real data. The base value
// matches the case ID this app already showed for level index 0 before this
// became index-driven. Will need real wiring once the backend tracks case
// identifiers.
export function placeholderCaseId(index) {
  return `VS-2026-${String(114 + index).padStart(4, '0')}`;
}
