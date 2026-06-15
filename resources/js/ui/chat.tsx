import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AiOutlineMessage, AiOutlineSend, AiOutlineUser, AiOutlineCustomerService, AiOutlineReload, AiOutlineClose, AiOutlineComment } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { routeApi } from '@/axiosConfig';
import { toast } from 'react-toastify';
import { useStateChatToggle } from '@/contexts/stateChatToggleContext';

interface Conversation {
    id: number,
    chat_id: number,
    message: string,
    user: string,
    created_at: string,
    updated_at: string
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

const CHAT_STORAGE_KEY = 'chat_conversations';
const MESSAGE_LIMIT = 50;
const END_CHAT_MESSAGE = 'End of chat.';

const ChatComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isEnding, setIsEnding] = useState(false);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [chatEnded, setChatEnded] = useState(false);
    const sessionChat = useRef('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const { stateToggleChat, setStateToggleChat } = useStateChatToggle()
    const { RouteGet, RoutePost } = routeApi();
    const chatUserType = useRef('');

    // Carregar conversas do localStorage
    const loadFromStorage = useCallback(() => {
        try {
            const stored = localStorage.getItem(CHAT_STORAGE_KEY);
            if (stored) {
                const data: LocalChatStorage = JSON.parse(stored);
                if (data.session === sessionChat.current) {
                    setConversations(data.conversations || []);

                    // Verificar se o chat já foi encerrado
                    const hasEndChatMessage = data.conversations.some(
                        msg => msg.message === END_CHAT_MESSAGE
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

    // Salvar conversas no localStorage
    const saveToStorage = useCallback((newConversations: Conversation[]) => {
        try {
            const storageData: LocalChatStorage = {
                session: sessionChat.current,
                userType: chatUserType.current,
                conversations: newConversations,
                lastUpdated: new Date().toISOString(),
                hasMore: newConversations.length >= MESSAGE_LIMIT,
                lastMessageId: newConversations[0]?.id || 0
            };
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(storageData));
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    }, []);

    // Limpar dados do chat
    const clearChatData = useCallback(() => {
        localStorage.removeItem('chatSession');
        localStorage.removeItem('chatUser');
        localStorage.removeItem(CHAT_STORAGE_KEY);
        setConversations([]);
        setHasUnreadMessages(false);
        setChatEnded(false);
        sessionChat.current = '';
    }, []);

    useEffect(() => {
        const url = new URL(window.location.href);
        const searchParams = url.searchParams;
        const chatSession = searchParams.get('session')
        if (chatSession) {
            localStorage.setItem('chatSession', chatSession)
            localStorage.setItem('chatUser', "support")
            localStorage.removeItem('chat_conversations')
            toggleChat()
        }

        if (stateToggleChat == true) {
            toggleChat()
        }

    }, [stateToggleChat])

    // Sincronizar entre abas
    const setupStorageSync = useCallback(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === CHAT_STORAGE_KEY && e.newValue !== e.oldValue) {
                if (!e.newValue) {
                    // Chat foi encerrado em outra aba
                    clearChatData();
                    setIsOpen(false);
                    toast.info('Chat encerrado em outra aba');
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [clearChatData]);

    // Função para tocar som de notificação
    const playNotificationSound = useCallback(() => {
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);

            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.3);
        } catch (error) {
            console.log('Audio context não suportado');
        }
    }, []);

    // Carregar mais mensagens
    const loadMoreMessages = async () => {
        if (isLoadingMore || conversations.length === 0) return;

        setIsLoadingMore(true);
        try {
            const oldestMessageId = conversations[conversations.length - 1].id;
            const response = await RouteGet(`/chat-messages/${sessionChat.current}?before=${oldestMessageId}&limit=20`);

            if (response.data && response.data.length > 0) {
                const newConversations = [...conversations, ...response.data];
                setConversations(newConversations);
                saveToStorage(newConversations);
            }
        } catch (error) {
            console.error('Erro ao carregar mais mensagens:', error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    // Verificar se está perto do topo para carregar mais mensagens
    const handleScroll = useCallback(() => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            const nearTop = scrollTop < 100;
            const nearBottom = scrollHeight - scrollTop - clientHeight < 100;

            if (nearTop && !isLoadingMore) {
                // loadMoreMessages();
            }
        }
    }, [isLoadingMore]);

    // Processar nova mensagem recebida
    const processNewMessage = useCallback((newMessage: Conversation) => {
        setConversations(prevConversations => {
            // Verificar se a mensagem já existe para evitar duplicatas
            const messageExists = prevConversations.some(msg => msg.id === newMessage.id);

            if (!messageExists) {
                const updatedConversations = [...prevConversations, newMessage];
                saveToStorage(updatedConversations);

                // Verificar se é mensagem de encerramento
                if (newMessage.message === END_CHAT_MESSAGE) {
                    setChatEnded(true);
                    playNotificationSound();
                    if (isOpen) {
                        toast.info('Chat encerrado pelo outro participante');
                    }
                    return updatedConversations;
                }

                // Verificar se é mensagem de suporte
                const isSupportMessage = newMessage.user === 'support';

                if (isSupportMessage) {
                    playNotificationSound();
                    if (!isOpen) {
                        setIsOpen(true);
                        setHasUnreadMessages(false);
                    }
                } else if (!isOpen) {
                    setHasUnreadMessages(true);
                }

                return updatedConversations;
            }
            return prevConversations;
        });
    }, [isOpen, playNotificationSound, saveToStorage]);

    // Iniciar novo chat
    const startNewChat = async () => {
        setIsLoading(true);
        try {
            const response = await RouteGet('/new-chat');
            const responseData = response.data;

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
            const storedConversations = loadFromStorage();
            setConversations(storedConversations);
        }
        setupStorageSync();
    }, [loadFromStorage, setupStorageSync]);

    useEffect(() => {
        if (isOpen && messagesEndRef.current && conversations.length > 0) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
        chatUserType.current = localStorage.getItem('chatUser') || '';
    }, [conversations, isOpen]);

    useEffect(() => {
        if (!sessionChat.current || chatEnded) return;

        const channel = window.Echo.channel(`Chat.${sessionChat.current}`);

        channel
            .listen('.chat.conversation', (e: MessageEvent) => {
                if (e.message) {
                    processNewMessage(e.message);
                }
            })
            .error((error: any) => {
                console.error('Erro no canal:', error);
                toast.error('Erro de conexão com o chat');
            });

        return () => {
            window.Echo.leave(`Chat.${sessionChat.current}`);
        };

    }, [sessionChat.current, processNewMessage, chatEnded]);


    const toggleChat = async () => {
        if (chatEnded) {
            clearChatData();
            setIsOpen(false);
            return;
        }

        if (!isOpen) {
            setIsLoading(true);
            try {
                const response = await RouteGet(`/new-chat/${localStorage.getItem('chatSession') || ''}`);
                const responseData = response.data;

                if (!localStorage.getItem('chatUser')) {
                    localStorage.setItem('chatUser', responseData.user);
                }
                localStorage.setItem('chatSession', responseData.session);
                sessionChat.current = responseData.session;

                if (responseData.data?.conversations) {
                    const recentMessages = responseData.data.conversations.slice(-MESSAGE_LIMIT);
                    setConversations(recentMessages);
                    const hasEndChatMessage = recentMessages.some(
                        msg => msg.message === END_CHAT_MESSAGE
                    );
                    if (hasEndChatMessage) {
                        setChatEnded(true);
                    } else {
                        saveToStorage(recentMessages)
                    }
                } else {
                    setConversations([]);
                    saveToStorage([]);
                }

                setHasUnreadMessages(false);
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

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isSending || chatEnded) return;

        setIsSending(true);
        try {
            await RoutePost(`/chat-conversation/${sessionChat.current}`, {
                message: message.trim(),
                session: sessionChat.current,
                user: localStorage.getItem('chatUser')
            });
            setMessage('');
        } catch (err) {
            console.error('Erro ao enviar mensagem:', err);
            toast.error('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            setIsSending(false);
        }
    };

    const handleEndChat = async () => {
        if (chatEnded) return;

        setIsEnding(true);
        try {
            // Enviar mensagem de encerramento
            await RoutePost(`/chat-conversation/${sessionChat.current}`, {
                message: END_CHAT_MESSAGE,
                session: sessionChat.current,
                user: localStorage.getItem('chatUser')
            });

            const response = await RoutePost(`/chat-end`, { session: sessionChat.current });
            if (response.data.type === 'success') {
                setChatEnded(true);
                toast.success(response.data.message, { position: 'top-right' });
                window.Echo.leave(`Chat.${sessionChat.current}`);
            }
        } catch (err) {
            console.error('Erro ao terminar chat:', err);
            toast.error('Erro ao terminar o chat. Tente novamente.');
        } finally {
            setIsEnding(false);
        }
    };

    const handleCloseChat = () => {
        if (chatEnded) {
            clearChatData();
        }
        setStateToggleChat(false)
        setIsOpen(false);
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Agrupar mensagens por data para melhor organização
    const groupMessagesByDate = () => {
        const grouped: { [key: string]: Conversation[] } = {};

        conversations.forEach(msg => {
            const date = new Date(msg.created_at).toDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(msg);
        });

        return grouped;
    };

    const groupedMessages = groupMessagesByDate();

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex flex-col items-end z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="w-[95vw] max-w-sm sm:max-w-md md:w-96 h-[85vh] max-h-[600px] bg-white rounded-2xl shadow-xl flex flex-col border border-gray-200 overflow-hidden"
                        style={{
                            margin: '1rem',
                            maxWidth: 'calc(100vw - 2rem)',
                            maxHeight: 'calc(100vh - 2rem)'
                        }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                                    <AiOutlineCustomerService className="text-lg sm:text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-300 text-sm sm:text-base">
                                        {chatEnded ? 'Chat Encerrado' : 'Suporte Online'}
                                    </h3>
                                    <p className="text-xs text-gray-300 opacity-80">
                                        {chatEnded ? 'Conversação finalizada' : 'Conectado'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {!chatEnded && (
                                    <button
                                        onClick={handleEndChat}
                                        disabled={isEnding}
                                        className="text-xs bg-white/20 hover:bg-white/30 disabled:opacity-50 transition-colors rounded-full px-3 py-1.5 flex items-center gap-1"
                                    >
                                        {isEnding ? (
                                            <AiOutlineReload className="animate-spin" />
                                        ) : (
                                            <AiOutlineClose />
                                        )}
                                        <span className="">Encerrar</span>
                                    </button>
                                )}
                                <button
                                    onClick={handleCloseChat}
                                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Área de Mensagens */}
                        <div
                            ref={messagesContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 p-3 sm:p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent bg-gray-50"
                        >
                            {isLoadingMore && (
                                <div className="flex justify-center py-2">
                                    <AiOutlineReload className="animate-spin text-blue-500" />
                                </div>
                            )}

                            {isLoading ? (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                    <p className="text-sm">Carregando conversa...</p>
                                </div>
                            ) : Object.keys(groupedMessages).length > 0 ? (
                                Object.entries(groupedMessages).map(([date, messages]) => (
                                    <div key={date}>
                                        <div className="flex justify-center my-3 sm:my-4">
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                {formatDate(messages[0].created_at)}
                                            </span>
                                        </div>
                                        {messages.map((msg) => {
                                            const isSupport = msg.user === 'support';
                                            const isEndChatMessage = msg.message === END_CHAT_MESSAGE;

                                            return (
                                                <div key={msg.id} className={`flex flex-col mb-3 sm:mb-4 ${isSupport ? "items-start" : "items-end"}`}>
                                                    <div className="flex items-end gap-2 max-w-xs">
                                                        {isSupport && !isEndChatMessage && (
                                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                <AiOutlineCustomerService className="text-blue-600 text-xs sm:text-sm" />
                                                            </div>
                                                        )}
                                                        <div className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl max-w-[70%] ${isEndChatMessage
                                                            ? "bg-yellow-100 border border-yellow-300 text-yellow-800 text-center italic"
                                                            : isSupport
                                                                ? "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                                                                : "bg-blue-500 text-gray-300 rounded-br-none"
                                                            }`}>
                                                            <p className={`${isSupport ? 'text-gray-800' : 'text-gray-200'} text-xs sm:text-sm break-words`}>
                                                                {isEndChatMessage ? '✅ Chat encerrado' : msg.message}
                                                            </p>
                                                            {!isEndChatMessage && (
                                                                <span className={`text-xs block mt-1 ${isEndChatMessage && isSupport ? 'text-gray-500' : 'text-blue-100'}`}>
                                                                    {formatTime(msg.created_at)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {!isSupport && !isEndChatMessage && (
                                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                <AiOutlineUser className="text-blue-600 text-xs sm:text-sm" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <AiOutlineMessage className="text-2xl sm:text-3xl mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">Nenhuma mensagem ainda</p>
                                    <p className="text-xs sm:text-sm">Inicie a conversa com nosso suporte!</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input de Mensagem ou Botão para Novo Chat */}
                        {chatEnded ? (
                            <div className="p-4 border-t border-gray-200 bg-white text-center">
                                <p className="text-sm text-gray-600 mb-3">Esta conversa foi encerrada</p>
                                {chatUserType.current === 'user' && (
                                    <button
                                        onClick={startNewChat}
                                        disabled={isLoading}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center justify-center mx-auto"
                                    >
                                        {isLoading ? (
                                            <AiOutlineReload className="animate-spin mr-2" />
                                        ) : (
                                            <AiOutlineComment className="mr-2" />
                                        )}
                                        Iniciar Novo Chat
                                    </button>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-gray-200 bg-white">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Digite sua mensagem..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        disabled={isSending}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSending || !message.trim()}
                                        className="p-2 sm:p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors flex items-center justify-center"
                                    >
                                        {isSending ? (
                                            <AiOutlineReload className="animate-spin text-sm sm:text-lg" />
                                        ) : (
                                            <AiOutlineSend className="text-sm sm:text-lg" />
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Botão de Abrir/Fechar Chat */}
            <motion.button
                onClick={toggleChat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-3 sm:p-4 rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors ${isOpen ? 'bg-gray-500' : 'bg-gradient-to-r from-blue-600 to-blue-700'
                    }`}
            >
                {hasUnreadMessages && !chatEnded && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse"
                    />
                )}
                {isLoading ? (
                    <AiOutlineReload className="animate-spin text-white text-lg sm:text-xl" />
                ) : isOpen ? (
                    <span className="text-white text-lg w-7 h-7 sm:text-xl">✕</span>
                ) : (
                    <AiOutlineMessage className="text-white text-lg sm:text-xl" />
                )}
            </motion.button>
        </div>
    );
};

export default ChatComponent;
