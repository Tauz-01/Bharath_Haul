import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Chip,
    Avatar,
    Stack,
    CircularProgress,
    Divider,
    Paper
} from '@mui/material';
import {
    Person as PersonIcon,
    Phone as PhoneIcon,
    Business as BusinessIcon,
    LocationOn as LocationIcon,
    LocalShipping as TruckIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as MoneyIcon,
    CheckCircle as AcceptIcon,
    Cancel as RejectIcon
} from '@mui/icons-material';

const DriverDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOnline, setIsOnline] = useState(false);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await bookingService.getDriverBookings(user.id);
            setBookings(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            setError('Failed to load bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const handleAccept = async (bookingId) => {
        try {
            await bookingService.accept(bookingId, user.id);
            fetchBookings(); 
        } catch (err) {
            alert('Failed to accept booking. Please try again.');
        }
    };

    const handleReject = async (bookingId) => {
        try {
            await bookingService.reject(bookingId);
            fetchBookings(); 
        } catch (err) {
            alert('Failed to reject booking. Please try again.');
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return { bg: 'rgba(255, 152, 0, 0.2)', color: '#ff9800', border: 'rgba(255, 152, 0, 0.4)' };
            case 'accepted':
                return { bg: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', border: 'rgba(76, 175, 80, 0.4)' };
            case 'completed':
                return { bg: 'rgba(33, 150, 243, 0.2)', color: '#2196f3', border: 'rgba(33, 150, 243, 0.4)' };
            case 'rejected':
                return { bg: 'rgba(244, 67, 54, 0.2)', color: '#f44336', border: 'rgba(244, 67, 54, 0.4)' };
            default:
                return { bg: 'rgba(158, 158, 158, 0.2)', color: '#9e9e9e', border: 'rgba(158, 158, 158, 0.4)' };
        }
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: '#000',
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
                        Loading your bookings...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#000',
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
                { }
                <Box sx={{ mb: 6 }}>
                    <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
                        <Avatar
                            sx={{
                                width: 70,
                                height: 70,
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                boxShadow: '0 8px 32px rgba(245, 87, 108, 0.4)',
                                border: '3px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <TruckIcon sx={{ fontSize: 40 }} />
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
                                Driver Dashboard
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    fontWeight: 300
                                }}
                            >
                                Manage your bookings and view customer details
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                onClick={() => setIsOnline(!isOnline)}
                                sx={{
                                    background: isOnline
                                        ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                                        : 'linear-gradient(135deg, #757575 0%, #616161 100%)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    px: 3,
                                    py: 1.5,
                                    boxShadow: isOnline
                                        ? '0 4px 15px rgba(76, 175, 80, 0.4)'
                                        : '0 4px 15px rgba(117, 117, 117, 0.4)',
                                    '&:hover': {
                                        background: isOnline
                                            ? 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)'
                                            : 'linear-gradient(135deg, #616161 0%, #424242 100%)',
                                    }
                                }}
                            >
                                {isOnline ? '🟢 Online' : '⚫ Offline'}
                            </Button>
                            <Chip
                                label={`${bookings.length} Booking${bookings.length !== 1 ? 's' : ''}`}
                                sx={{
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    height: 36,
                                    px: 2,
                                    boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)'
                                }}
                            />
                        </Box>
                    </Stack>
                </Box>

                { }
                {error && (
                    <Paper
                        sx={{
                            p: 3,
                            mb: 4,
                            bgcolor: 'rgba(244, 67, 54, 0.1)',
                            border: '1px solid rgba(244, 67, 54, 0.3)',
                            borderRadius: 2
                        }}
                    >
                        <Typography color="error">{error}</Typography>
                    </Paper>
                )}

                { }
                {bookings.length === 0 ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 8,
                            textAlign: 'center',
                            bgcolor: '#2a2a2a',
                            border: '2px solid rgba(128, 128, 128, 0.3)',
                            borderRadius: 4
                        }}
                    >
                        <TruckIcon sx={{ fontSize: 80, color: 'rgba(255, 255, 255, 0.2)', mb: 3 }} />
                        <Typography variant="h5" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                            No Bookings Yet
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            You don't have any bookings at the moment. Check back later!
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {bookings.map((booking) => {
                            const statusStyle = getStatusColor(booking.status);
                            return (
                                <Grid size={{ xs: 12 }} key={booking.id}>
                                    <Card
                                        sx={{
                                            background: '#2a2a2a',
                                            borderRadius: 3,
                                            border: '2px solid rgba(128, 128, 128, 0.3)',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                                                borderColor: 'rgba(255, 255, 255, 0.2)'
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 4 }}>
                                            {/* Header with Status */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                                <Typography variant="h5" fontWeight="700" sx={{ color: '#fff' }}>
                                                    Booking #{booking.id}
                                                </Typography>
                                                <Chip
                                                    label={booking.status?.toUpperCase()}
                                                    sx={{
                                                        bgcolor: statusStyle.bg,
                                                        color: statusStyle.color,
                                                        border: '1px solid',
                                                        borderColor: statusStyle.border,
                                                        fontWeight: 700,
                                                        fontSize: '0.85rem',
                                                        px: 1
                                                    }}
                                                />
                                            </Box>

                                            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                                            <Grid container spacing={3}>
                                                {/* Customer Information */}
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <Paper
                                                        elevation={0}
                                                        sx={{
                                                            p: 3,
                                                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                            borderRadius: 2
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="overline"
                                                            sx={{
                                                                color: 'rgba(255, 255, 255, 0.6)',
                                                                fontWeight: 600,
                                                                letterSpacing: '0.1em',
                                                                mb: 2,
                                                                display: 'block'
                                                            }}
                                                        >
                                                            Customer Details
                                                        </Typography>
                                                        <Stack spacing={2}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Avatar sx={{ bgcolor: 'rgba(102, 126, 234, 0.2)', width: 40, height: 40 }}>
                                                                    <PersonIcon sx={{ color: '#667eea' }} />
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                                        Name
                                                                    </Typography>
                                                                    <Typography variant="body1" fontWeight="600" sx={{ color: '#fff' }}>
                                                                        {booking.customer?.name || 'N/A'}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Avatar sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', width: 40, height: 40 }}>
                                                                    <PhoneIcon sx={{ color: '#4caf50' }} />
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                                        Phone
                                                                    </Typography>
                                                                    <Typography variant="body1" fontWeight="600" sx={{ color: '#fff' }}>
                                                                        {booking.customer?.phone || 'N/A'}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                            {booking.customer?.companyName && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                    <Avatar sx={{ bgcolor: 'rgba(255, 152, 0, 0.2)', width: 40, height: 40 }}>
                                                                        <BusinessIcon sx={{ color: '#ff9800' }} />
                                                                    </Avatar>
                                                                    <Box>
                                                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                                            Company
                                                                        </Typography>
                                                                        <Typography variant="body1" fontWeight="600" sx={{ color: '#fff' }}>
                                                                            {booking.customer.companyName}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            )}
                                                        </Stack>
                                                    </Paper>
                                                </Grid>

                                                {/* Booking Details */}
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <Paper
                                                        elevation={0}
                                                        sx={{
                                                            p: 3,
                                                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                            borderRadius: 2
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="overline"
                                                            sx={{
                                                                color: 'rgba(255, 255, 255, 0.6)',
                                                                fontWeight: 600,
                                                                letterSpacing: '0.1em',
                                                                mb: 2,
                                                                display: 'block'
                                                            }}
                                                        >
                                                            Trip Details
                                                        </Typography>
                                                        <Stack spacing={2}>
                                                            <Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 1 }}>
                                                                    <LocationIcon sx={{ color: '#4caf50', fontSize: 20, mt: 0.5 }} />
                                                                    <Box>
                                                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                                            Pickup
                                                                        </Typography>
                                                                        <Typography variant="body2" fontWeight="600" sx={{ color: '#fff' }}>
                                                                            {booking.pickupLocation}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                                                                    <LocationIcon sx={{ color: '#f44336', fontSize: 20, mt: 0.5 }} />
                                                                    <Box>
                                                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                                            Dropoff
                                                                        </Typography>
                                                                        <Typography variant="body2" fontWeight="600" sx={{ color: '#fff' }}>
                                                                            {booking.dropLocation}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <Box>
                                                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                                        Load Type
                                                                    </Typography>
                                                                    <Typography variant="body2" fontWeight="600" sx={{ color: '#fff' }}>
                                                                        {booking.loadType}
                                                                    </Typography>
                                                                </Box>
                                                                <Box>
                                                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                                        Weight
                                                                    </Typography>
                                                                    <Typography variant="body2" fontWeight="600" sx={{ color: '#fff' }}>
                                                                        {booking.loadWeight} kg
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <Box>
                                                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                                        Fare
                                                                    </Typography>
                                                                    <Typography variant="h6" fontWeight="700" sx={{ color: '#4caf50' }}>
                                                                        ₹{booking.price}
                                                                    </Typography>
                                                                </Box>
                                                                <Box>
                                                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                                        Booked On
                                                                    </Typography>
                                                                    <Typography variant="body2" fontWeight="600" sx={{ color: '#fff' }}>
                                                                        {new Date(booking.createdAt).toLocaleDateString()}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Stack>
                                                    </Paper>
                                                </Grid>
                                            </Grid>

                                            {/* Action Buttons */}
                                            {booking.status?.toLowerCase() === 'pending' && (
                                                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<RejectIcon />}
                                                        onClick={() => handleReject(booking.id)}
                                                        sx={{
                                                            color: '#f44336',
                                                            borderColor: 'rgba(244, 67, 54, 0.5)',
                                                            fontWeight: 600,
                                                            px: 3,
                                                            '&:hover': {
                                                                borderColor: '#f44336',
                                                                bgcolor: 'rgba(244, 67, 54, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<AcceptIcon />}
                                                        onClick={() => handleAccept(booking.id)}
                                                        sx={{
                                                            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                                            color: '#fff',
                                                            fontWeight: 700,
                                                            px: 4,
                                                            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                                                            '&:hover': {
                                                                background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                                                                boxShadow: '0 6px 20px rgba(76, 175, 80, 0.5)'
                                                            }
                                                        }}
                                                    >
                                                        Accept Booking
                                                    </Button>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default DriverDashboard;
