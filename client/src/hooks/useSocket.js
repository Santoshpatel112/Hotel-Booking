import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Custom hook for Socket.IO connection and real-time updates
 * Manages WebSocket connection, authentication, and event handling
 */
export const useSocket = (options = {}) => {
    const { user } = useAuth();
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [liveMetrics, setLiveMetrics] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    const {
        autoConnect = true,
        enableNotifications = true,
        enableDashboard = false
    } = options;

    // Initialize socket connection
    const connect = () => {
        if (!user?.token) {
            console.log('🔌 Cannot connect: No authentication token');
            return;
        }

        try {
            console.log('🔌 Initializing Socket.IO connection...');
            
            socketRef.current = io('http://localhost:8000', {
                auth: {
                    token: user.token
                },
                transports: ['websocket', 'polling'],
                timeout: 20000,
                autoConnect: false
            });

            const socket = socketRef.current;

            // Connection event handlers
            socket.on('connect', () => {
                console.log('✅ Socket.IO connected successfully');
                setIsConnected(true);
                setConnectionError(null);
                reconnectAttempts.current = 0;

                if (enableNotifications) {
                    toast.success('Real-time connection established', {
                        icon: '🔌',
                        duration: 2000
                    });
                }

                // Subscribe to dashboard updates if user is admin
                if (user.isAdmin && enableDashboard) {
                    socket.emit('subscribe-dashboard');
                }
            });

            socket.on('disconnect', (reason) => {
                console.log('🔌 Socket.IO disconnected:', reason);
                setIsConnected(false);
                
                if (enableNotifications && reason !== 'io client disconnect') {
                    toast.error('Real-time connection lost', {
                        icon: '⚠️',
                        duration: 3000
                    });
                }
            });

            socket.on('connect_error', (error) => {
                console.error('❌ Socket.IO connection error:', error);
                setConnectionError(error.message);
                reconnectAttempts.current++;

                if (reconnectAttempts.current >= maxReconnectAttempts) {
                    socket.disconnect();
                    if (enableNotifications) {
                        toast.error('Failed to establish real-time connection', {
                            icon: '❌',
                            duration: 5000
                        });
                    }
                }
            });

            // Dashboard update handlers
            socket.on('dashboard-update', (data) => {
                console.log('📊 Dashboard update received:', data);
                setDashboardData(data.data);
            });

            socket.on('live-metrics', (data) => {
                console.log('📈 Live metrics received:', data);
                setLiveMetrics(data.data);
            });

            socket.on('activity-update', (activity) => {
                console.log('🔔 New activity:', activity);
                setRecentActivity(prev => [activity, ...prev.slice(0, 9)]); // Keep latest 10
                
                if (enableNotifications) {
                    toast.success(activity.message, {
                        icon: getActivityIcon(activity.type),
                        duration: 4000
                    });
                }
            });

            socket.on('system-notification', (notification) => {
                console.log('📢 System notification:', notification);
                
                if (enableNotifications) {
                    const toastFunction = getToastFunction(notification.type);
                    toastFunction(notification.message, {
                        icon: getNotificationIcon(notification.type),
                        duration: 5000
                    });
                }
            });

            socket.on('dashboard-refreshed', (data) => {
                if (enableNotifications) {
                    toast.success('Dashboard refreshed', {
                        icon: '🔄',
                        duration: 2000
                    });
                }
            });

            // Connect the socket
            socket.connect();

        } catch (error) {
            console.error('❌ Socket initialization error:', error);
            setConnectionError(error.message);
        }
    };

    // Disconnect socket
    const disconnect = () => {
        if (socketRef.current) {
            console.log('🔌 Disconnecting Socket.IO...');
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    };

    // Emit events
    const emit = (event, data) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit(event, data);
        } else {
            console.warn('⚠️ Socket not connected, cannot emit:', event);
        }
    };

    // Request dashboard refresh
    const refreshDashboard = () => {
        emit('refresh-dashboard');
    };

    // Request live data
    const requestLiveData = () => {
        emit('request-live-data');
    };

    // Auto-connect on mount if enabled
    useEffect(() => {
        if (autoConnect && user?.token) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [user?.token, autoConnect]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
        connectionError,
        dashboardData,
        liveMetrics,
        recentActivity,
        connect,
        disconnect,
        emit,
        refreshDashboard,
        requestLiveData
    };
};

// Helper functions
function getActivityIcon(type) {
    switch (type) {
        case 'booking':
            return '📅';
        case 'user':
            return '👤';
        case 'payment':
            return '💳';
        case 'hotel':
            return '🏨';
        default:
            return '📊';
    }
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return '✅';
        case 'warning':
            return '⚠️';
        case 'error':
            return '❌';
        case 'info':
            return 'ℹ️';
        default:
            return '🔔';
    }
}

function getToastFunction(type) {
    switch (type) {
        case 'success':
            return toast.success;
        case 'warning':
            return toast;
        case 'error':
            return toast.error;
        case 'info':
        default:
            return toast;
    }
}

export default useSocket;