import type { AssistantChatMessage, ChatMessage, LinkedRecord } from '../types';

export const LINKED_RECORD: LinkedRecord = { code: 'WO-1042', title: 'Supply fan vibration' };

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    role: 'user',
    text: 'Review the overdue AHU-03 work order. What needs attention first, and what should I include in the technician handover?',
    record: LINKED_RECORD,
  },
  {
    id: 2,
    role: 'assistant',
    basis: 'Based on 3 linked records',
    text: 'Prioritize inspection, not a remote diagnosis. The latest service note mentions belt wear. Have a technician assess the unit before deciding whether it can remain in service.',
    note: 'No live vibration readings or isolation status are attached. I can’t confirm severity or authorize continued operation.',
    sources: [
      { icon: '⚒', label: 'WO-1042 · Work order' },
      { icon: '❖', label: 'AS-0317-03 · Asset' },
      { icon: '▤', label: 'PM-0086 · PM plan' },
    ],
  },
];

const DEMO_NOTE = 'This is a demo assistant. I can’t read live sensor data or approve operating decisions.';

export function buildReply(id: number, record: LinkedRecord | null): AssistantChatMessage {
  return {
    id,
    role: 'assistant',
    basis: record ? 'Based on 1 linked record' : 'General guidance',
    text: record
      ? `Thanks — I’ve noted that against ${record.code}. Confirm the asset is safely isolated first, then log your findings in the work order so the technician handover stays complete.`
      : 'Thanks for the details. Share the asset, location and urgency, and link a work order if there is one, so I can suggest what to check first.',
    note: DEMO_NOTE,
  };
}
