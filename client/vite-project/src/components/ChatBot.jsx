import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    TextField,
    Fab,
    Avatar,
    Stack,
    Fade,
    useTheme,
    InputAdornment,
} from '@mui/material';
import {
    Chat as ChatIcon,
    Close as CloseIcon,
    Send as SendIcon,
    SmartToy as BotIcon,
    Person as PersonIcon,
} from '@mui/icons-material';

const ChatBot = () => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! 👋 How can I help you today?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputText('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse = {
                id: Date.now() + 1,
                text: "Thanks for your message! I'm just a demo bot for now, but I look nice, right? 😊",
                sender: 'bot',
            };
            setMessages((prev) => [...prev, botResponse]);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Action Button to toggle chat */}
            <Fab
                color="primary"
                aria-label="chat"
                onClick={handleToggle}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1000,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary?.main || theme.palette.primary.dark})`,
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </Fab>

            {/* Chat Window */}
            <Fade in={isOpen}>
                <Paper
                    elevation={12}
                    sx={{
                        position: 'fixed',
                        bottom: 90,
                        right: 24,
                        width: { xs: 'calc(100% - 48px)', sm: 350 },
                        height: 500,
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 1000,
                        overflow: 'hidden',
                        borderRadius: 4,
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: 2,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        }}
                    >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    width: 32,
                                    height: 32
                                }}
                            >
                                <BotIcon fontSize="small" />
                            </Avatar>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Support Assistant
                            </Typography>
                        </Stack>
                        <IconButton
                            size="small"
                            onClick={handleToggle}
                            sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Messages Area */}
                    <Box
                        sx={{
                            flex: 1,
                            p: 2,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : '#f5f5f5',
                        }}
                    >
                        {messages.map((msg) => (
                            <Box
                                key={msg.id}
                                sx={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    gap: 1,
                                }}
                            >
                                {msg.sender === 'bot' && (
                                    <Avatar
                                        sx={{ width: 24, height: 24, bgcolor: theme.palette.primary.main, mb: 0.5 }}
                                    >
                                        <BotIcon sx={{ fontSize: 14 }} />
                                    </Avatar>
                                )}
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        borderBottomRightRadius: msg.sender === 'user' ? 0 : 2,
                                        borderBottomLeftRadius: msg.sender === 'bot' ? 0 : 2,
                                        bgcolor:
                                            msg.sender === 'user'
                                                ? theme.palette.primary.main
                                                : theme.palette.background.paper,
                                        color:
                                            msg.sender === 'user'
                                                ? theme.palette.primary.contrastText
                                                : theme.palette.text.primary,
                                    }}
                                >
                                    <Typography variant="body2">{msg.text}</Typography>
                                </Paper>
                                {msg.sender === 'user' && (
                                    <Avatar
                                        sx={{ width: 24, height: 24, bgcolor: theme.palette.secondary?.main || 'grey', mb: 0.5 }}
                                    >
                                        <PersonIcon sx={{ fontSize: 14 }} />
                                    </Avatar>
                                )}
                            </Box>
                        ))}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input Area */}
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: theme.palette.background.paper,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Type a message..."
                            size="small"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            InputProps={{
                                sx: { borderRadius: 3 },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            color="primary"
                                            onClick={handleSend}
                                            disabled={!inputText.trim()}
                                            edge="end"
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Paper>
            </Fade>
        </>
    );
};

export default ChatBot;
