import type { AssistantChatMessage, User, UserChatMessage } from '../../types';
import { getInitials } from '../../utils/format';

export function UserMessage({ user, message }: { user: User; message: UserChatMessage }) {
  const { text, record } = message;
  return (
    <div className="um">
      <div className="who">{user.name}<div className="av">{getInitials(user.name)}</div></div>
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
  const { basis, text, note, sources } = message;
  return (
    <div className="am">
      <div className="nm"><div className="logo s">✦</div><b>NUB assistant</b> {basis}</div>
      <div className="acard">
        <p>{text}</p>
        <div className="note"><i>ⓘ</i><span>{note}</span></div>
        {sources && (
          <>
            <div className="src">Sources · {sources.length} records</div>
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
  return (
    <div className="am">
      <div className="typing" role="status" aria-label="NUB assistant is typing"><i /><i /><i /></div>
    </div>
  );
}
