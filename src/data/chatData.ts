import type { Translate } from '../context/LocaleContext';
import type { AssistantChatMessage, ChatMessage, LinkedRecord } from '../types';

export function getLinkedRecord(t: Translate): LinkedRecord {
  return { code: 'WO-1042', title: t('chat.recordTitle') };
}

export function getInitialMessages(t: Translate): ChatMessage[] {
  const record = getLinkedRecord(t);
  return [
    {
      id: 1,
      role: 'user',
      text: t('chat.demoUser'),
      record,
    },
    {
      id: 2,
      role: 'assistant',
      basis: t('chat.demoBasis'),
      text: t('chat.demoReply'),
      note: t('chat.demoNote'),
      sources: [
        { icon: '⚒', label: t('chat.sourceWorkOrder', { code: 'WO-1042' }) },
        { icon: '❖', label: t('chat.sourceAsset', { code: 'AS-0317-03' }) },
        { icon: '▤', label: t('chat.sourcePlan', { code: 'PM-0086' }) },
      ],
    },
  ];
}

export function buildReply(id: number, record: LinkedRecord | null, t: Translate): AssistantChatMessage {
  return {
    id,
    role: 'assistant',
    basis: record ? t('chat.replyBasisRecord') : t('chat.replyBasisGeneral'),
    text: record
      ? t('chat.replyWithRecord', { code: record.code })
      : t('chat.replyGeneral'),
    note: t('chat.demoDisclaimer'),
  };
}
