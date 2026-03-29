const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export interface Guest {
    id: string;
    rfid_card_id: string;
    first_name: string;
    last_name: string;
    job_position?: string;
    branch_location?: string;
    join_date?: string;
    photo_url?: string;
    is_vip: boolean;
}

export interface TapResult {
    success: boolean;
    is_first_tap: boolean;
    tap_count: number;
    data: { tap_timestamps: string[] };
}

export async function fetchGuestByRfid(rfid: string): Promise<Guest> {
    const res = await fetch(`${API_BASE}/api/guests/rfid/${encodeURIComponent(rfid)}`);
    if (!res.ok) throw new Error(`Guest not found: ${rfid}`);
    const json = await res.json();
    return json.data as Guest;
}

export async function logTap(rfid: string): Promise<TapResult> {
    const res = await fetch(`${API_BASE}/api/checkins/tap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfid_card_id: rfid }),
    });
    if (!res.ok) throw new Error('Tap log failed');
    return res.json() as Promise<TapResult>;
}