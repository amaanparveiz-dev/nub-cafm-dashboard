import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useLocale } from '../../context/LocaleContext';
import { buildReply, getInitialMessages, getLinkedRecord } from '../../data/chatData';
import type { Attachment, ChatMessage, LinkedRecord, User } from '../../types';
import { AssistantMessage, TypingIndicator, UserMessage } from './ChatMessages';

const REPLY_DELAY_MS = 900;
const MAX_INPUT_HEIGHT = 110;

export default function ChatPanel({ user }: { user: User }) {
  const { t, locale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialMessages(t));
  const [isReplying, setIsReplying] = useState(false);
  const [draft, setDraft] = useState('');
  const [linkedRecord, setLinkedRecord] = useState<LinkedRecord | null>(() => getLinkedRecord(t));
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showHistoryNote, setShowHistoryNote] = useState(false);

  const nextId = useRef(getInitialMessages(t).length + 1);
  const replyTimer = useRef<ReturnType<typeof setTimeout>>();
  const fabRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages(getInitialMessages(t));
    setLinkedRecord(getLinkedRecord(t));
    nextId.current = getInitialMessages(t).length + 1;
    setShowHistoryNote(false);
    setAttachments([]);
    setDraft('');
  }, [locale, t]);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    fabRef.current?.focus();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('chat-open', isOpen);
    return () => document.body.classList.remove('chat-open');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 120);
    const handleKey = (event: globalThis.KeyboardEvent) => event.key === 'Escape' && closePanel();
    document.addEventListener('keydown', handleKey);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, closePanel]);

  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [messages, isReplying, showHistoryNote, isOpen]);

  useEffect(() => () => clearTimeout(replyTimer.current), []);

  function send() {
    const text = draft.trim();
    if (!text || isReplying) return;
    const record = linkedRecord;

    setMessages((prev) => [...prev, { id: nextId.current++, role: 'user', text, record }]);
    setDraft('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setIsReplying(true);

    replyTimer.current = setTimeout(() => {
      setMessages((prev) => [...prev, buildReply(nextId.current++, record, t)]);
      setIsReplying(false);
    }, REPLY_DELAY_MS);
  }

  function handleDraftChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const input = event.target;
    setDraft(input.value);
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, MAX_INPUT_HEIGHT)}px`;
  }

  function handleDraftKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setAttachments((prev) => [...prev, { id: nextId.current++, name: file.name }]);
    event.target.value = '';
  }

  return (
    <>
      <button
        ref={fabRef}
        className="fab"
        type="button"
        aria-label={isOpen ? t('chat.close') : t('chat.open')}
        aria-expanded={isOpen}
        aria-controls="chat"
        onClick={() => setIsOpen((open) => !open)}
      >
        ✦
      </button>

      <section id="chat" className={`chat${isWide ? ' wide' : ''}${isOpen ? ' open' : ''}`} role="dialog" aria-label={t('chat.title')}>
        <div className="ci">
          <div className="ch-h">
            <div className="logo">✦</div>
            <h2>{t('chat.title')}</h2>
            <button className="ib exp" type="button" aria-label={t('chat.expand')} onClick={() => setIsWide((wide) => !wide)}>⤢</button>
            <button className="ib" type="button" aria-label={t('chat.closePanel')} onClick={closePanel}>✕</button>
          </div>

          <div className="cb" ref={bodyRef}>
            {messages.map((message) => (message.role === 'user'
              ? <UserMessage key={message.id} user={user} message={message} />
              : <AssistantMessage key={message.id} message={message} />))}
            {isReplying && <TypingIndicator />}
            <button className="hist" type="button" onClick={() => setShowHistoryNote(true)}>
              <span>▢</span><span style={{ flex: 1 }}>{t('chat.history')}</span><span>›</span>
            </button>
            {showHistoryNote && <div className="sysnote">{t('chat.noHistory')}</div>}
          </div>

          <div className="cf">
            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              placeholder={t('chat.placeholder')}
              aria-label={t('chat.message')}
              onChange={handleDraftChange}
              onKeyDown={handleDraftKeyDown}
            />
            <div className="cr">
              <div className="tools">
                <button className="att" type="button" onClick={() => fileRef.current?.click()}>📎 {t('chat.attach')}</button>
                <input ref={fileRef} type="file" hidden onChange={handleFileChange} />
                {attachments.map(({ id, name }) => (
                  <span className="tag" key={id}>
                    <span>📄 {name}</span>
                    <button type="button" aria-label={t('chat.removeFile', { name })} onClick={() => setAttachments((prev) => prev.filter((file) => file.id !== id))}>✕</button>
                  </span>
                ))}
                {linkedRecord && (
                  <span className="tag">
                    <span>🔗 {linkedRecord.code}</span>
                    <button type="button" aria-label={t('chat.removeRecord')} onClick={() => setLinkedRecord(null)}>✕</button>
                  </span>
                )}
              </div>
              <button className="send" type="button" disabled={isReplying} onClick={send}>{t('chat.send')} <span>↑</span></button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
