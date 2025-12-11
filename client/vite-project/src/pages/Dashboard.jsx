import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { walletService, bookingService } from '../services/api';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Paper,
    Chip,
    Avatar,
    Stack,
    useTheme,
    CircularProgress,
    Divider
} from '@mui/material';
import {
    AccountBalanceWallet as WalletIcon,
    DirectionsCar as CarIcon,
    Work as WorkIcon,
    History as HistoryIcon,
    Person as PersonIcon,
    TrendingUp,
    ArrowForward,
    LocalShipping,
    Assessment
} from '@mui/icons-material';
import gsap from 'gsap';

const Dashboard = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setLoading(true);
            Promise.allSettled([
                walletService.getBalance(user.id),
                (user.role === 'driver' || user.role === 'Driver')
                    ? bookingService.getDriverBookings(user.id)
                    : bookingService.getCustomerBookings(user.id)
            ]).then((results) => {
                // Handle Wallet
                if (results[0].status === 'fulfilled') {
                    setBalance(results[0].value.data);
                }

                // Handle Bookings
                if (results[1].status === 'fulfilled') {
                    setRecentBookings(results[1].value.data.slice(0, 3));
                }

                setLoading(false);
            });
        }
    }, [user]);



    const isDriver = user?.role === 'driver' || user?.role === 'Driver';

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: '#ffffffff',
                background: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #000000 100%)'
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress
                        size={60}
                        thickness={4}
                        sx={{
                            color: '#00d4ff',
                            filter: 'drop-shadow(0 0 10px #00d4ff)'
                        }}
                    />
                    <Typography variant="h6" sx={{ color: '#fff', mt: 3, fontWeight: 300 }}>
                        Loading your dashboard...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                color: '#fff',
                background: 'radial-gradient(circle at 20% 20%, #0f0f23 0%, #000000 50%, #000000 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 80% 80%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }
            }}
        >
            <Container maxWidth="lg" sx={{ pt: 14, pb: 6, position: 'relative', zIndex: 1 }}>
                {/* Header Section */}
                <Box className="dashboard-header" sx={{ mb: 6 }}>
                    <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                                border: '3px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="h3"
                                component="h1"
                                fontWeight="700"
                                sx={{
                                    mb: 1,
                                    background: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    letterSpacing: '-0.02em'
                                }}
                            >
                                Welcome back, {user?.name}
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Chip
                                    label={user?.role?.toUpperCase()}
                                    sx={{
                                        background: isDriver
                                            ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                                            : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem',
                                        height: 28,
                                        boxShadow: isDriver
                                            ? '0 4px 15px rgba(245, 87, 108, 0.4)'
                                            : '0 4px 15px rgba(0, 242, 254, 0.4)',
                                        border: 'none'
                                    }}
                                />
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        fontWeight: 300
                                    }}
                                >
                                    Here's your activity overview
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>
                </Box>

                <Grid container spacing={4}>
                    {/* Wallet Card - Redesigned */}
                    <Grid item xs={12} md={4}>
                        <Card
                            sx={{
                                height: '100%',
                                minHeight: 280,
                                background: '#2a2a2a',
                                borderRadius: 4,
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                border: '2px solid rgba(128, 128, 128, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                                }
                            }}
                        >
                            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 4, position: 'relative', zIndex: 1 }}>
                                <Box sx={{ mb: 'auto' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                        <Typography
                                            variant="overline"
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.8)',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                letterSpacing: '0.1em'
                                            }}
                                        >
                                            WALLET BALANCE
                                        </Typography>
                                        <Avatar
                                            sx={{
                                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                                backdropFilter: 'blur(10px)',
                                                width: 48,
                                                height: 48
                                            }}
                                        >
                                            <WalletIcon sx={{ fontSize: 28 }} />
                                        </Avatar>
                                    </Box>
                                    <Typography
                                        variant="h2"
                                        fontWeight="800"
                                        sx={{
                                            color: '#fff',
                                            mb: 1,
                                            textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                                            letterSpacing: '-0.02em'
                                        }}
                                    >
                                        ₹{balance.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        Available to spend
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        mt: 3,
                                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                                        color: '#667eea',
                                        fontWeight: 'bold',
                                        fontSize: '0.95rem',
                                        py: 1.5,
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                                        '&:hover': {
                                            bgcolor: '#fff',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 25px rgba(0, 0, 0, 0.3)'
                                        }
                                    }}
                                    onClick={() => navigate('/wallet')}
                                    endIcon={<ArrowForward />}
                                >
                                    Manage Wallet
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Action Card - Redesigned */}
                    <Grid item xs={12} md={4}>
                        <Card
                            className="dashboard-card"
                            sx={{
                                height: '100%',
                                minHeight: 280,
                                background: '#2a2a2a',
                                borderRadius: 4,
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                border: '2px solid rgba(128, 128, 128, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)',
                                    pointerEvents: 'none'
                                }
                            }}
                        >
                            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 4, position: 'relative', zIndex: 1 }}>
                                <Box sx={{ mb: 'auto' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                        <Typography
                                            variant="overline"
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.8)',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                letterSpacing: '0.1em'
                                            }}
                                        >
                                            {isDriver ? 'WORK STATUS' : 'QUICK ACTION'}
                                        </Typography>
                                        <Avatar
                                            sx={{
                                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                                backdropFilter: 'blur(10px)',
                                                width: 48,
                                                height: 48
                                            }}
                                        >
                                            {isDriver ? <WorkIcon sx={{ fontSize: 28 }} /> : <CarIcon sx={{ fontSize: 28 }} />}
                                        </Avatar>
                                    </Box>
                                    <Typography
                                        variant="h4"
                                        fontWeight="700"
                                        sx={{
                                            color: '#fff',
                                            mb: 1.5,
                                            textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                                        }}
                                    >
                                        {isDriver ? 'Ready to drive?' : 'Need a ride?'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
                                        {isDriver ? 'Check your assigned trips and track your earnings.' : 'Book a comfortable ride to your destination instantly.'}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        mt: 3,
                                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                                        color: isDriver ? '#f5576c' : '#00f2fe',
                                        fontWeight: 'bold',
                                        fontSize: '0.95rem',
                                        py: 1.5,
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                                        '&:hover': {
                                            bgcolor: '#fff',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 25px rgba(0, 0, 0, 0.3)'
                                        }
                                    }}
                                    onClick={() => navigate(isDriver ? '/driver-dashboard' : '/book-ride')}
                                    endIcon={<ArrowForward />}
                                >
                                    {isDriver ? 'View Trips' : 'Book Now'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Recent Activity - Redesigned */}
                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                height: '100%',
                                minHeight: 280,
                                p: 4,
                                borderRadius: 4,
                                background: '#2a2a2a',
                                border: '2px solid rgba(128, 128, 128, 0.3)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography
                                    variant="h6"
                                    fontWeight="700"
                                    sx={{
                                        color: '#fff',
                                        fontSize: '1.25rem'
                                    }}
                                >
                                    Recent Activity
                                </Typography>
                                <Avatar
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        width: 40,
                                        height: 40
                                    }}
                                >
                                    <HistoryIcon sx={{ fontSize: 22, color: 'rgba(255, 255, 255, 0.7)' }} />
                                </Avatar>
                            </Box>

                            {recentBookings.length > 0 ? (
                                <Stack spacing={2} sx={{ mb: 3 }}>
                                    {recentBookings.map((booking, index) => (
                                        <Box
                                            key={booking.id}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    background: 'rgba(255, 255, 255, 0.08)',
                                                    transform: 'translateX(5px)'
                                                }
                                            }}
                                        >
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                <Typography
                                                    variant="subtitle2"
                                                    noWrap
                                                    sx={{
                                                        maxWidth: '65%',
                                                        color: '#fff',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {booking.dropoffLocation}
                                                </Typography>
                                                <Chip
                                                    label={booking.status}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: booking.status === 'accepted'
                                                            ? 'rgba(76, 175, 80, 0.2)'
                                                            : booking.status === 'completed'
                                                                ? 'rgba(33, 150, 243, 0.2)'
                                                                : 'rgba(255, 152, 0, 0.2)',
                                                        color: booking.status === 'accepted'
                                                            ? '#4caf50'
                                                            : booking.status === 'completed'
                                                                ? '#2196f3'
                                                                : '#ff9800',
                                                        border: '1px solid',
                                                        borderColor: booking.status === 'accepted'
                                                            ? 'rgba(76, 175, 80, 0.4)'
                                                            : booking.status === 'completed'
                                                                ? 'rgba(33, 150, 243, 0.4)'
                                                                : 'rgba(255, 152, 0, 0.4)',
                                                        fontWeight: 600,
                                                        fontSize: '0.7rem'
                                                    }}
                                                />
                                            </Box>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.5)',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {new Date(booking.bookingTime).toLocaleDateString(undefined, {
                                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 5 }}>
                                    <HistoryIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                                        No recent activity found
                                    </Typography>
                                </Box>
                            )}

                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{
                                    mt: 'auto',
                                    color: '#fff',
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                    fontWeight: 600,
                                    py: 1.2,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    '&:hover': {
                                        borderColor: 'rgba(255, 255, 255, 0.4)',
                                        background: 'rgba(255, 255, 255, 0.05)'
                                    }
                                }}
                                onClick={() => navigate('/trips')}
                            >
                                View All History
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Dashboard;
