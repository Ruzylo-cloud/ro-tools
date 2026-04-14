'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import styles from './page.module.css';

const ICONS = {
  store: '\u{1F3EA}', district: '\u{1F4CD}', company: '\u{1F30E}', leadership: '\u{2B50}',
  ro: '\u{1F451}', star: '\u{2728}', dm: '\u{1F4CB}', megaphone: '\u{1F4E3}',
  shield: '\u{1F6E1}', lock: '\u{1F512}', group: '\u{1F465}', dmIcon: '\u{1F4AC}',
};

const QUICK_REACTIONS = ['\u{1F44D}', '\u{2764}\u{FE0F}', '\u{1F602}', '\u{1F64F}', '\u{1F525}', '\u{2705}'];

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(/[\s@]/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

export default function MessagingPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('pinned'); // pinned | created
  const [autoChannels, setAutoChannels] = useState([]);
  const [userChannels, setUserChannels] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [userRole, setUserRole] = useState('crew');
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesScrollerRef = useRef(null);
  const inputRef = useRef(null);
  const pollRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  const lastMessageStateRef = useRef({ channelId: null, lastId: null, count: 0 });

  const isNearBottom = useCallback((el) => {
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }, []);

  // Load channels
  const loadChannels = useCallback(async () => {
    try {
      const res = await fetch('/api/messaging/channels');
      if (!res.ok) return;
      const data = await res.json();
      setAutoChannels(data.autoChannels || []);
      setUserChannels(data.userChannels || []);
      setUnreadCounts(data.unreadCounts || {});
      setUserRole(data.role || 'crew');
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { loadChannels(); }, [loadChannels]);

  // Load messages for active channel
  const loadMessages = useCallback(async (channelId) => {
    if (!channelId) return;
    setMsgLoading(true);
    try {
      const res = await fetch(`/api/messaging/messages?channelId=${encodeURIComponent(channelId)}&limit=100`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages || []);
    } catch { /* ignore */ }
    finally { setMsgLoading(false); }
  }, []);

  useEffect(() => {
    if (activeChannel) {
      shouldAutoScrollRef.current = true;
      loadMessages(activeChannel.id);
      setMobileSidebarOpen(false);
    }
  }, [activeChannel, loadMessages]);

  // Poll for new messages every 5s
  useEffect(() => {
    if (!activeChannel) return;
    pollRef.current = setInterval(() => {
      loadMessages(activeChannel.id);
      loadChannels(); // refresh unreads
    }, 5000);
    return () => clearInterval(pollRef.current);
  }, [activeChannel, loadMessages, loadChannels]);

  useEffect(() => {
    const el = messagesScrollerRef.current;
    if (!el) return;
    const handleScroll = () => {
      shouldAutoScrollRef.current = isNearBottom(el);
    };
    handleScroll();
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [activeChannel, isNearBottom]);

  // Auto-scroll on channel changes and only when the user is already near the bottom
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const prev = lastMessageStateRef.current;
    const channelId = activeChannel?.id || null;
    const channelChanged = prev.channelId !== channelId;
    const newestChanged = prev.lastId !== (lastMessage?.id || null) || prev.count !== messages.length;

    if (channelChanged || (newestChanged && shouldAutoScrollRef.current)) {
      messagesEndRef.current?.scrollIntoView({ behavior: channelChanged ? 'auto' : 'smooth' });
    }

    lastMessageStateRef.current = {
      channelId,
      lastId: lastMessage?.id || null,
      count: messages.length,
    };
  }, [messages, activeChannel]);

  // Send message
  const handleSend = async () => {
    if (!input.trim() || !activeChannel || sending) return;
    const perm = activeChannel.permission || 'full';
    if (perm !== 'full') return;
    setSending(true);
    try {
      const res = await fetch('/api/messaging/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', channelId: activeChannel.id, content: input.trim() }),
      });
      if (res.ok) {
        setInput('');
        shouldAutoScrollRef.current = true;
        await loadMessages(activeChannel.id);
        inputRef.current?.focus();
      }
    } catch { /* ignore */ }
    finally { setSending(false); }
  };

  // Edit message
  const handleEdit = async (msgId) => {
    if (!editContent.trim()) return;
    try {
      await fetch('/api/messaging/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'edit', messageId: msgId, content: editContent.trim() }),
      });
      setEditingId(null);
      setEditContent('');
      await loadMessages(activeChannel.id);
    } catch { /* ignore */ }
  };

  // Delete message
  const handleDelete = async (msgId) => {
    try {
      await fetch('/api/messaging/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', messageId: msgId }),
      });
      await loadMessages(activeChannel.id);
    } catch { /* ignore */ }
  };

  // React to message
  const handleReact = async (msgId, emoji) => {
    try {
      await fetch('/api/messaging/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'react', messageId: msgId, emoji }),
      });
      await loadMessages(activeChannel.id);
    } catch { /* ignore */ }
  };

  // Create group/DM
  const handleCreateGroup = async () => {
    const members = groupMembers.split(',').map(m => m.trim()).filter(Boolean);
    if (members.length === 0) return;
    const type = members.length === 1 ? 'dm' : 'group';
    try {
      const res = await fetch('/api/messaging/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name: groupName || undefined, members }),
      });
      if (res.ok) {
        const data = await res.json();
        setShowNewGroup(false);
        setGroupName('');
        setGroupMembers('');
        await loadChannels();
        setTab('created');
        setActiveChannel({ ...data.channel, permission: 'full', scope: type });
      }
    } catch { /* ignore */ }
  };

  // Key handler for input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentPermission = activeChannel?.permission || 'full';
  const displayChannels = tab === 'pinned' ? autoChannels : userChannels;

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${!mobileSidebarOpen ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className={styles.sidebarTitle}>Messages</h2>
            {activeChannel && (
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer', display: 'none' }}
                className="mobileToggle"
              >
                {mobileSidebarOpen ? '\u2715' : '\u2630'}
              </button>
            )}
          </div>
          <div className={styles.tabBar}>
            <button className={`${styles.tab} ${tab === 'pinned' ? styles.tabActive : ''}`} onClick={() => setTab('pinned')}>
              Pinned Chats
            </button>
            <button className={`${styles.tab} ${tab === 'created' ? styles.tabActive : ''}`} onClick={() => setTab('created')}>
              Groups & DMs
            </button>
          </div>
        </div>

        <div className={styles.channelList}>
          {displayChannels.map(ch => {
            const unread = unreadCounts[ch.id] || 0;
            const isActive = activeChannel?.id === ch.id;
            const scope = ch.scope || ch.type || 'company';
            const iconKey = ch.icon || (ch.type === 'dm' ? 'dmIcon' : 'group');
            return (
              <button
                key={ch.id}
                className={`${styles.channelItem} ${isActive ? styles.channelItemActive : ''}`}
                onClick={() => setActiveChannel(ch)}
              >
                <div className={styles.channelIcon} data-scope={scope}>
                  {ICONS[iconKey] || ICONS.company}
                </div>
                <div className={styles.channelMeta}>
                  <div className={styles.channelName}>{ch.name || ch.members?.filter(m => m !== user?.email).join(', ') || 'Chat'}</div>
                  {ch.permission && ch.permission !== 'full' && (
                    <div className={styles.channelPerm}>
                      {ch.permission === 'react' ? 'Read & React only' : 'Read only'}
                    </div>
                  )}
                </div>
                {unread > 0 && <div className={styles.unreadBadge}>{unread > 99 ? '99+' : unread}</div>}
              </button>
            );
          })}
          {displayChannels.length === 0 && (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--gray-400)', fontSize: 13 }}>
              {tab === 'pinned' ? 'No channels available for your role.' : 'No groups or DMs yet.'}
            </div>
          )}
        </div>

        {tab === 'created' && (
          <button className={styles.newGroupBtn} onClick={() => setShowNewGroup(true)}>
            + New Group or DM
          </button>
        )}
      </div>

      {/* Chat area */}
      <div className={styles.chatArea}>
        {!activeChannel ? (
          <div className={styles.emptyChat}>
            <div className={styles.emptyChatIcon}>{'\u{1F4AC}'}</div>
            <div className={styles.emptyChatText}>Select a channel to start chatting</div>
          </div>
        ) : (
          <>
            <div className={styles.chatHeader}>
              <button
                onClick={() => setMobileSidebarOpen(true)}
                style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer', padding: 0, marginRight: 4 }}
              >
                {'\u2190'}
              </button>
              <div className={styles.chatHeaderName}>{activeChannel.name || 'Chat'}</div>
              {currentPermission !== 'full' && (
                <div className={styles.chatHeaderPerm}>
                  {currentPermission === 'react' ? 'Read & React' : 'Read Only'}
                </div>
              )}
            </div>

            <div ref={messagesScrollerRef} className={styles.chatMessages}>
              {msgLoading && messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: 32, color: 'var(--gray-400)' }}>Loading messages...</div>
              )}
              {!msgLoading && messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: 32, color: 'var(--gray-400)', fontSize: 13 }}>
                  No messages yet. Be the first to say something!
                </div>
              )}
              {messages.map(msg => {
                const isOwn = msg.sender === user?.email;
                const isEditing = editingId === msg.id;
                return (
                  <div key={msg.id} className={styles.messageRow}>
                    <div className={styles.messageAvatar}>
                      {msg.senderPhoto ? (
                        <img src={msg.senderPhoto} alt="" referrerPolicy="no-referrer" />
                      ) : getInitials(msg.senderName)}
                    </div>
                    <div className={styles.messageBody}>
                      <div>
                        <span className={styles.messageSender}>{msg.senderName}</span>
                        <span className={styles.messageTime}>{formatTime(msg.createdAt)}</span>
                        {msg.editedAt && <span className={styles.messageEdited}>(edited)</span>}
                      </div>
                      {isEditing ? (
                        <div>
                          <textarea
                            className={styles.editInput}
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEdit(msg.id); } if (e.key === 'Escape') { setEditingId(null); } }}
                            autoFocus
                          />
                          <div className={styles.editActions}>
                            <button className={styles.editSave} onClick={() => handleEdit(msg.id)}>Save</button>
                            <button className={styles.editCancel} onClick={() => setEditingId(null)}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.messageContent}>{msg.content}</div>
                      )}
                      {/* Reactions */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && !isEditing && (
                        <div className={styles.reactions}>
                          {Object.entries(msg.reactions).filter(([, users]) => users.length > 0).map(([emoji, users]) => (
                            <button
                              key={emoji}
                              className={`${styles.reactionBadge} ${users.includes(user?.email) ? styles.reactionBadgeMine : ''}`}
                              onClick={() => handleReact(msg.id, emoji)}
                            >
                              {emoji} <span className={styles.reactionCount}>{users.length}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Action buttons */}
                    {!isEditing && (
                      <div className={styles.messageActions}>
                        {currentPermission !== 'read' && QUICK_REACTIONS.slice(0, 3).map(emoji => (
                          <button key={emoji} className={styles.actionBtn} onClick={() => handleReact(msg.id, emoji)} title={`React ${emoji}`}>
                            {emoji}
                          </button>
                        ))}
                        {isOwn && currentPermission === 'full' && (
                          <>
                            <button className={styles.actionBtn} onClick={() => { setEditingId(msg.id); setEditContent(msg.content); }} title="Edit">
                              {'\u270F\uFE0F'}
                            </button>
                            <button className={styles.actionBtn} onClick={() => handleDelete(msg.id)} title="Delete">
                              {'\u{1F5D1}'}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            {currentPermission === 'full' ? (
              <div className={styles.chatInput}>
                <div className={styles.inputRow}>
                  <textarea
                    ref={inputRef}
                    className={styles.inputField}
                    placeholder="Type a message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                  />
                  <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim() || sending}>
                    {sending ? '...' : 'Send'}
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.reactOnlyNotice}>
                {currentPermission === 'react' ? 'You can read and react to messages in this channel.' : 'This channel is read-only.'}
              </div>
            )}
          </>
        )}
      </div>

      {/* New Group Modal */}
      {showNewGroup && (
        <div className={styles.modalOverlay} onClick={() => setShowNewGroup(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>New Group or DM</h3>
            <label className={styles.modalLabel}>Group Name (optional for DMs)</label>
            <input
              className={styles.modalInput}
              placeholder="e.g. Weekend Shift Crew"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
            />
            <label className={styles.modalLabel}>Members (comma-separated emails)</label>
            <input
              className={styles.modalInput}
              placeholder="e.g. john@jmvalley.com, jane@jmvalley.com"
              value={groupMembers}
              onChange={e => setGroupMembers(e.target.value)}
            />
            <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: -8, marginBottom: 8 }}>
              1 email = DM, 2+ emails = Group chat. You are added automatically.
            </div>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setShowNewGroup(false)}>Cancel</button>
              <button
                className={styles.modalConfirm}
                onClick={handleCreateGroup}
                disabled={!groupMembers.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
