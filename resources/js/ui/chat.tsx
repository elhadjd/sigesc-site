import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
    AiOutlineMessage,
    AiOutlineSend,
    AiOutlineReload,
    AiOutlineClose,
    AiOutlineComment,
} from 'react-icons/ai';
import { BsWhatsapp } from 'react-icons/bs';
import { FaRobot } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { routeApi } from '@/axiosConfig';
import { toast } from 'react-toastify';
import { useStateChatToggle } from '@/contexts/stateChatToggleContext';
import {
    SIGESC_WHATSAPP_DISPLAY,
    SIGESC_WHATSAPP_URL,
} from '@/services/public/domains';

interface Conversation {
    id: number;
    chat_id: number;
    message: string;
    user: string;
    created_at: string;
    updated_at: string;
}

interface MessageEvent {
    message: Conversation;
}

interface LocalChatStorage {
    session: string;
    userType: string;
    conversations: Conversation[];
    lastUpdated: string;
    hasMore: boolean;
    lastMessageId: number;
}

interface WhatsAppInfo {
    display: string;
    url: string;
    digits?: string;
}

const CHAT_STORAGE_KEY = 'chat_conversations';
const MESSAGE_LIMIT = 50;
const END_CHAT_MESSAGE = 'End of chat.';

function linkifyMessage(text: string): React.ReactNode[] {
    const parts = text.split(/(https?:\/\/[^\s]+)/g);
    return parts.map((part, index) => {
        if (/^https?:\/\//.test(part)) {
            const isWa = /wa\.me\//i.test(part);
            return (
                <a
                    key={`${part}-${index}`}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                        isWa
                            ? 'mt-1 inline-flex items-center gap-1.5 break-all font-semibold text-emerald-700 underline underline-offset-2'
                            : 'break-all font-medium text-sky-700 underline underline-offset-2'
                    }
                >
                    {isWa ? (
                        <>
                            <BsWhatsapp className="inline shrink-0" />
                            Abrir WhatsApp
                        </>
                    ) : (
                        part
                    )}
                </a>
            );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
    });
}

const ChatComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isEnding, setIsEnding] = useState(false);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const [chatEnded, setChatEnded] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [whatsapp, setWhatsapp] = useState<WhatsAppInfo>({
        display: SIGESC_WHATSAPP_DISPLAY,
        url: SIGESC_WHATSAPP_URL,
    });
    const sessionChat = useRef('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { stateToggleChat, setStateToggleChat } = useStateChatToggle();
    const { RouteGet, RoutePost } = routeApi();
    const chatUserType = useRef('');

    const loadFromStorage = useCallback(() => {
        try {
            const stored = localStorage.getItem(CHAT_STORAGE_KEY);
            if (stored) {
                const data: LocalChatStorage = JSON.parse(stored);
                if (data.session === sessionChat.current) {
                    setConversations(data.conversations || []);
                    const hasEndChatMessage = data.conversations.some(
                        (msg) => msg.message === END_CHAT_MESSAGE
                    );
                    if (hasEndChatMessage) {
                        setChatEnded(true);
                    }
                    return data.conversations || [];
                }
            }
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
        }
        return [];
    }, []);

    const saveToStorage = useCallback((newConversations: Conversation[]) => {
        try {
            const storageData: LocalChatStorage = {
                session: sessionChat.current,
                userType: chatUserType.current,
                conversations: newConversations,
                lastUpdated: new Date().toISOString(),
                hasMore: newConversations.length >= MESSAGE_LIMIT,
                lastMessageId: newConversations[0]?.id || 0,
            };
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(storageData));
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    }, []);

    const clearChatData = useCallback(() => {
        localStorage.removeItem('chatSession');
        localStorage.removeItem('chatUser');
        localStorage.removeItem(CHAT_STORAGE_KEY);
        setConversations([]);
        setHasUnreadMessages(false);
        setChatEnded(false);
        setIsTyping(false);
        sessionChat.current = '';
    }, []);

    const upsertMessages = useCallback(
        (incoming: Conversation | Conversation[]) => {
            const list = Array.isArray(incoming) ? incoming : [incoming];
            setConversations((prev) => {
                const map = new Map(prev.map((m) => [m.id, m]));
                list.forEach((m) => {
                    if (m?.id) map.set(m.id, m);
                });
                const next = Array.from(map.values()).sort((a, b) => a.id - b.id);
                saveToStorage(next);
                if (next.some((m) => m.message === END_CHAT_MESSAGE)) {
                    setChatEnded(true);
                }
                return next;
            });
        },
        [saveToStorage]
    );

    useEffect(() => {
        const url = new URL(window.location.href);
        const chatSession = url.searchParams.get('session');
        if (chatSession) {
            localStorage.setItem('chatSession', chatSession);
            localStorage.setItem('chatUser', 'support');
            localStorage.removeItem('chat_conversations');
            void toggleChat();
        }

        if (stateToggleChat === true) {
            void toggleChat();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateToggleChat]);

    const setupStorageSync = useCallback(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === CHAT_STORAGE_KEY && e.newValue !== e.oldValue) {
                if (!e.newValue) {
                    clearChatData();
                    setIsOpen(false);
                    toast.info('Chat encerrado em outra aba');
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [clearChatData]);

    const playNotificationSound = useCallback(() => {
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.25, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.25);
            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.25);
        } catch {
            /* ignore */
        }
    }, []);

    const processNewMessage = useCallback(
        (newMessage: Conversation) => {
            if (!newMessage?.id) return;
            upsertMessages(newMessage);
            if (newMessage.message === END_CHAT_MESSAGE) {
                playNotificationSound();
                if (isOpen) toast.info('Chat encerrado');
                return;
            }
            if (newMessage.user === 'support') {
                playNotificationSound();
                setIsTyping(false);
                if (!isOpen) {
                    setIsOpen(true);
                    setHasUnreadMessages(false);
                }
            } else if (!isOpen) {
                setHasUnreadMessages(true);
            }
        },
        [isOpen, playNotificationSound, upsertMessages]
    );

    const applyAssistantMeta = (payload: any) => {
        const wa = payload?.assistant?.whatsapp;
        if (wa?.url && wa?.display) {
            setWhatsapp({ display: wa.display, url: wa.url, digits: wa.digits });
        }
    };

    const startNewChat = async () => {
        setIsLoading(true);
        try {
            const response = await RouteGet('/new-chat');
            const responseData = response.data;
            applyAssistantMeta(responseData);
            localStorage.setItem('chatUser', responseData.user);
            localStorage.setItem('chatSession', responseData.session);
            sessionChat.current = responseData.session;

            if (responseData.data?.conversations) {
                const recentMessages = responseData.data.conversations.slice(-MESSAGE_LIMIT);
                setConversations(recentMessages);
                saveToStorage(recentMessages);
            } else {
                setConversations([]);
                saveToStorage([]);
            }

            setChatEnded(false);
            setHasUnreadMessages(false);
        } catch (err) {
            console.error('Erro ao iniciar novo chat:', err);
            toast.error('Erro ao iniciar novo chat. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('chatSession')) {
            sessionChat.current = localStorage.getItem('chatSession') || '';
            setConversations(loadFromStorage());
        }
        setupStorageSync();
    }, [loadFromStorage, setupStorageSync]);

    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            const id = window.setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 80);
            return () => window.clearTimeout(id);
        }
        chatUserType.current = localStorage.getItem('chatUser') || '';
    }, [conversations, isOpen, isTyping]);

    useEffect(() => {
        if (!sessionChat.current || chatEnded || !window.Echo) return;

        const channel = window.Echo.channel(`Chat.${sessionChat.current}`);
        channel
            .listen('.chat.conversation', (e: MessageEvent) => {
                if (e.message) processNewMessage(e.message);
            })
            .error((error: any) => {
                console.error('Erro no canal:', error);
            });

        return () => {
            window.Echo.leave(`Chat.${sessionChat.current}`);
        };
    }, [sessionChat.current, processNewMessage, chatEnded]);

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    const toggleChat = async () => {
        if (chatEnded) {
            clearChatData();
            setIsOpen(false);
            return;
        }

        if (!isOpen) {
            setIsLoading(true);
            try {
                const response = await RouteGet(
                    `/new-chat/${localStorage.getItem('chatSession') || ''}`
                );
                const responseData = response.data;
                applyAssistantMeta(responseData);

                if (!localStorage.getItem('chatUser')) {
                    localStorage.setItem('chatUser', responseData.user);
                }
                localStorage.setItem('chatSession', responseData.session);
                sessionChat.current = responseData.session;

                if (responseData.data?.conversations) {
                    const recentMessages = responseData.data.conversations.slice(-MESSAGE_LIMIT);
                    setConversations(recentMessages);
                    const hasEndChatMessage = recentMessages.some(
                        (msg: Conversation) => msg.message === END_CHAT_MESSAGE
                    );
                    if (hasEndChatMessage) {
                        setChatEnded(true);
                    } else {
                        saveToStorage(recentMessages);
                    }
                } else {
                    setConversations([]);
                    saveToStorage([]);
                }

                setHasUnreadMessages(false);
                window.setTimeout(() => inputRef.current?.focus(), 250);
            } catch (err) {
                console.error('Erro ao carregar chat:', err);
                toast.error('Erro ao carregar o chat. Tente novamente.');
            } finally {
                setIsLoading(false);
            }
        } else {
            setHasUnreadMessages(false);
        }
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!message.trim() || isSending || chatEnded) return;

        const text = message.trim();
        setMessage('');
        setIsSending(true);
        setIsTyping(true);

        try {
            const response = await RoutePost(`/chat-conversation/${sessionChat.current}`, {
                message: text,
                session: sessionChat.current,
                user: localStorage.getItem('chatUser') || 'user',
            });

            applyAssistantMeta(response.data);
            const batch: Conversation[] = [];
            if (response.data?.user_message) batch.push(response.data.user_message);
            if (response.data?.assistant_message) batch.push(response.data.assistant_message);
            if (batch.length) upsertMessages(batch);
        } catch (err) {
            console.error('Erro ao enviar mensagem:', err);
            toast.error('Erro ao enviar mensagem. Tente novamente.');
            setMessage(text);
        } finally {
            setIsSending(false);
            setIsTyping(false);
        }
    };

    const handleEndChat = async () => {
        if (chatEnded) return;
        setIsEnding(true);
        try {
            const response = await RoutePost(`/chat-end`, {
                session: sessionChat.current,
                user: localStorage.getItem('chatUser') || 'user',
            });
            if (response.data.type === 'success') {
                setChatEnded(true);
                toast.success(response.data.message || 'Chat encerrado', { position: 'top-right' });
                if (window.Echo) window.Echo.leave(`Chat.${sessionChat.current}`);
            }
        } catch (err) {
            console.error('Erro ao terminar chat:', err);
            toast.error('Erro ao terminar o chat. Tente novamente.');
        } finally {
            setIsEnding(false);
        }
    };

    const handleCloseChat = () => {
        if (chatEnded) clearChatData();
        setStateToggleChat(false);
        setIsOpen(false);
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });
    };

    const visibleMessages = useMemo(
        () => conversations.filter((m) => m.message !== END_CHAT_MESSAGE || chatEnded),
        [conversations, chatEnded]
    );

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void handleSendMessage();
        }
    };

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-end p-3 sm:p-5">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        role="dialog"
                        aria-label="Assistente SIGESC"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 24 }}
                        transition={{ duration: 0.22 }}
                        className="pointer-events-auto flex w-full flex-col overflow-hidden border border-slate-200/80 bg-[#f7fafb] text-[#12202a] shadow-[0_24px_80px_-28px_rgba(8,47,56,.55)] sm:max-w-[26rem]"
                        style={
                            {
                                height: 'min(100dvh - 1rem, 40rem)',
                                maxHeight: 'calc(100dvh - 1rem)',
                                '--chat-ink': '#12202a',
                                '--chat-deep': '#0c3d4a',
                                '--chat-accent': '#0d9488',
                            } as React.CSSProperties
                        }
                    >
                        <header className="shrink-0 bg-[var(--chat-deep)] px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-white sm:px-5">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                                            <FaRobot className="text-lg text-teal-200" />
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className="truncate text-base font-semibold leading-tight">
                                                {chatEnded ? 'Conversa encerrada' : 'Assistente SIGESC'}
                                            </h3>
                                            <p className="truncate text-sm text-white/70">
                                                {chatEnded
                                                    ? 'Pode iniciar outra conversa'
                                                    : isTyping
                                                      ? 'A escrever…'
                                                      : 'Respostas sobre o software'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-1">
                                    {!chatEnded && (
                                        <button
                                            type="button"
                                            onClick={handleEndChat}
                                            disabled={isEnding}
                                            className="rounded-md px-2.5 py-2 text-sm text-white/85 transition hover:bg-white/10 disabled:opacity-50"
                                        >
                                            {isEnding ? (
                                                <AiOutlineReload className="animate-spin" />
                                            ) : (
                                                'Encerrar'
                                            )}
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleCloseChat}
                                        aria-label="Fechar chat"
                                        className="rounded-md p-2 text-white/90 transition hover:bg-white/10"
                                    >
                                        <AiOutlineClose className="text-lg" />
                                    </button>
                                </div>
                            </div>

                            <a
                                href={whatsapp.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-3 py-2.5 text-base font-semibold text-[#052e16] transition hover:bg-[#2fe472]"
                            >
                                <BsWhatsapp className="text-xl" />
                                WhatsApp {whatsapp.display}
                            </a>
                        </header>

                        <div
                            ref={messagesContainerRef}
                            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4"
                        >
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
                                    <AiOutlineReload className="animate-spin text-2xl text-teal-600" />
                                    <p className="text-base">A preparar o assistente…</p>
                                </div>
                            ) : visibleMessages.length > 0 ? (
                                visibleMessages.map((msg) => {
                                    const isSupport = msg.user === 'support';
                                    const isEnd = msg.message === END_CHAT_MESSAGE;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isSupport ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div
                                                className={`max-w-[88%] px-3.5 py-2.5 text-base leading-relaxed ${
                                                    isEnd
                                                        ? 'bg-amber-50 text-amber-900'
                                                        : isSupport
                                                          ? 'bg-white text-[var(--chat-ink)] shadow-sm ring-1 ring-slate-200/80'
                                                          : 'bg-[var(--chat-deep)] text-white'
                                                }`}
                                            >
                                                <div className="whitespace-pre-wrap break-words">
                                                    {isEnd
                                                        ? 'Conversa encerrada'
                                                        : linkifyMessage(msg.message)}
                                                </div>
                                                {!isEnd && (
                                                    <span
                                                        className={`mt-1.5 block text-xs ${
                                                            isSupport ? 'text-slate-400' : 'text-white/60'
                                                        }`}
                                                    >
                                                        {formatTime(msg.created_at)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-2 py-10 text-center text-slate-500">
                                    <AiOutlineMessage className="mx-auto mb-2 text-3xl text-slate-300" />
                                    <p className="text-base">Pergunte sobre o SIGESC</p>
                                </div>
                            )}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white px-4 py-3 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200/80">
                                        Assistente a escrever…
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {chatEnded ? (
                            <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                                <p className="mb-3 text-center text-base text-slate-600">
                                    Esta conversa terminou.
                                </p>
                                {chatUserType.current !== 'support' && (
                                    <button
                                        type="button"
                                        onClick={startNewChat}
                                        disabled={isLoading}
                                        className="flex w-full items-center justify-center gap-2 bg-[var(--chat-deep)] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#0a3340]"
                                    >
                                        {isLoading ? (
                                            <AiOutlineReload className="animate-spin" />
                                        ) : (
                                            <AiOutlineComment />
                                        )}
                                        Nova conversa
                                    </button>
                                )}
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSendMessage}
                                className="shrink-0 border-t border-slate-200 bg-white px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4"
                            >
                                <div className="flex items-end gap-2">
                                    <textarea
                                        ref={inputRef}
                                        rows={1}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={onKeyDown}
                                        disabled={isSending}
                                        placeholder="Escreva a sua pergunta…"
                                        className="max-h-32 min-h-[3rem] flex-1 resize-none border border-slate-200 bg-[#f7fafb] px-3.5 py-3 text-base leading-normal text-[var(--chat-ink)] outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/25 disabled:opacity-60"
                                        style={{ fontSize: '16px' }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSending || !message.trim()}
                                        aria-label="Enviar"
                                        className="inline-flex h-12 w-12 shrink-0 items-center justify-center bg-[var(--chat-accent)] text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                                    >
                                        {isSending ? (
                                            <AiOutlineReload className="animate-spin text-xl" />
                                        ) : (
                                            <AiOutlineSend className="text-xl" />
                                        )}
                                    </button>
                                </div>
                                <p className="mt-2 text-center text-xs text-slate-400">
                                    Prefere humano?{' '}
                                    <a
                                        href={whatsapp.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-emerald-700 underline"
                                    >
                                        WhatsApp {whatsapp.display}
                                    </a>
                                </p>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                type="button"
                onClick={() => void toggleChat()}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                aria-label={isOpen ? 'Fechar assistente' : 'Abrir assistente SIGESC'}
                className={`pointer-events-auto relative mb-[max(0px,env(safe-area-inset-bottom))] ml-auto flex h-14 w-14 items-center justify-center rounded-full shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 ${
                    isOpen
                        ? 'bg-slate-600'
                        : 'bg-[linear-gradient(135deg,#0c3d4a_0%,#0d9488_100%)]'
                }`}
            >
                {hasUnreadMessages && !chatEnded && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-rose-500"
                    />
                )}
                {isLoading ? (
                    <AiOutlineReload className="animate-spin text-2xl text-white" />
                ) : isOpen ? (
                    <AiOutlineClose className="text-2xl text-white" />
                ) : (
                    <AiOutlineMessage className="text-2xl text-white" />
                )}
            </motion.button>
        </div>
    );
};

export default ChatComponent;
