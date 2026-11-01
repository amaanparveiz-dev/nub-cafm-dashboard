import { useLocale } from '../../context/LocaleContext';
import type { AssistantChatMessage, User, UserChatMessage } from '../../types';
import { displayName, getInitials } from '../../utils/format';

export function UserMessage({ user, message }: { user: User; message: UserChatMessage }) {
  const { locale } = useLocale();
  const { text, record } = message;
  const name = displayName(user, locale);
  return (
    <div className="um">
      <div className="who">{name}<div className="av">{getInitials(name)}</div></div>
      <div className="bub">
        {text}
        {record && (
          <>
            <br />
            <span className="chip m">⚒ {record.code} · {record.title} ↗</span>
          </>
        )}
      </div>
    </div>
  );
}

export function AssistantMessage({ message }: { message: AssistantChatMessage }) {
  const { t } = useLocale();
  const { basis, text, note, sources } = message;
  return (
    <div className="am">
      <div className="nm"><div className="logo s">✦</div><b>{t('chat.title')}</b> {basis}</div>
      <div className="acard">
        <p>{text}</p>
        <div className="note"><i>ⓘ</i><span>{note}</span></div>
        {sources && (
          <>
            <div className="src">{t('chat.sources', { n: sources.length })}</div>
            <div className="chips">
              {sources.map(({ icon, label }) => <span className="chip" key={label}>{icon} {label} ↗</span>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  const { t } = useLocale();
  return (
    <div className="am">
      <div className="typing" role="status" aria-label={t('chat.typing')}><i /><i /><i /></div>
    </div>
  );
}
