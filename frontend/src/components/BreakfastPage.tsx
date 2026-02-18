import { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText
} from '@mui/material'
import { useMe } from '../UserProvider'
import {
    breakfastEventGetRegistrations,
    breakfastEventRegister
} from '../clients/breakfast/sdk.gen';
import { getParticipantList } from '../clients/breakfast/sdk.gen';
import { useServices } from '../ServiceProvider';
import { Client } from '../clients/breakfast/client/types'

export const BreakfastPage = () => {
    // Remove unused useServices import
    const user = useMe()
    const { breakfast } = useServices()
    const { api } = breakfast as { api: Client }
    

    const [eventId, setEventId] = useState<string>('')
    const [participantName, setParticipantName] = useState<string>(user.name || '')
    const [registrations, setRegistrations] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [participants, setParticipants] = useState<any[]>([]);
    const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');

    // Fetch registrations for the event
    const fetchRegistrations = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await breakfastEventGetRegistrations({
                client: api,
                path: {
                    id: eventId,
                }
            });
            setRegistrations(res.data || []);
        } catch (e) {
            setError('Failed to fetch registrations');
        } finally {
            setLoading(false);
        }
    }

    // Fetch all participants (handle pagination)
    const fetchParticipants = async () => {
        let allParticipants: any[] = [];
        let page = 1;
        let hasMore = true;
        do {
            const res = await getParticipantList({
                client: api,
                query: { page }
            });
            const list = res.data as { items: any[], totalPages?: number };
            allParticipants = allParticipants.concat(list.items);
            page++;
            hasMore = list.items.length > 0 && (list.totalPages ? page <= list.totalPages : true);
        } while (hasMore);
        setParticipants(allParticipants);
    };

    useEffect(() => {
        fetchParticipants();
    }, []);

    useEffect(() => {
        if (eventId) fetchRegistrations()
    }, [eventId])

    // Register as participant
    const register = async () => {
        setLoading(true);
        setError(null);
        try {
            await breakfastEventRegister({
                client: api,
                path: {
                    id: eventId,
                },
                body: {
                    participant: selectedParticipantId // Use selected participant @id
                }
            });
            fetchRegistrations();
        } catch (e) {
            setError('Registration failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" sx={{ mb: 2 }}>
                        Breakfast Registration
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Breakfast Event ID"
                            value={eventId}
                            onChange={e => setEventId(e.target.value)}
                            fullWidth
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Your Name"
                            value={participantName}
                            onChange={e => setParticipantName(e.target.value)}
                            fullWidth
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <select
                            value={selectedParticipantId}
                            onChange={e => setSelectedParticipantId(e.target.value)}
                            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                        >
                            <option value="">Select Participant</option>
                            {participants.map((p) => (
                                <option key={p["@id"]} value={p["@id"]}>
                                    {p.name || p["@id"]}
                                </option>
                            ))}
                        </select>
                    </Box>
                    <Button
                        variant="contained"
                        onClick={register}
                        disabled={!eventId || !selectedParticipantId || loading}
                    >
                        Register
                    </Button>
                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
                    )}
                </CardContent>
            </Card>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Registered Participants</Typography>
                <List>
                    {registrations.map((reg, idx) => (
                        <ListItem key={idx}>
                            <ListItemText primary={typeof reg.participant === 'string' ? reg.participant : reg.participant?.name || 'Unknown'} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    )
}
