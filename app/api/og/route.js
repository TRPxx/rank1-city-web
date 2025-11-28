import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        // ?name=TeeGa&gang=Mafia&invite=10
        const name = searchParams.get('name') || 'Citizen';
        const gang = searchParams.get('gang');
        const invite = searchParams.get('invite') || '0';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0f172a',
                        backgroundImage: 'radial-gradient(circle at 25px 25px, #334155 2%, transparent 0%), radial-gradient(circle at 75px 75px, #334155 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                        color: 'white',
                        fontFamily: 'sans-serif',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {/* Logo Placeholder */}
                        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(to bottom right, #3b82f6, #06b6d4)' }} />
                        <h1 style={{ fontSize: 60, fontWeight: 900, background: 'linear-gradient(to right, #3b82f6, #06b6d4)', backgroundClip: 'text', color: 'transparent' }}>
                            Rank1 City
                        </h1>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
                        <div style={{ fontSize: 30, color: '#94a3b8' }}>INVITED BY</div>
                        <div style={{ fontSize: 70, fontWeight: 'bold', marginTop: 0 }}>{name}</div>

                        {gang && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20, background: '#1e293b', padding: '10px 30px', borderRadius: 50 }}>
                                <span style={{ fontSize: 30 }}>🛡️</span>
                                <span style={{ fontSize: 30, color: '#38bdf8' }}>{gang} Gang</span>
                            </div>
                        )}
                    </div>

                    <div style={{ position: 'absolute', bottom: 40, display: 'flex', gap: 40 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: 24, color: '#94a3b8' }}>Invited</span>
                            <span style={{ fontSize: 40, fontWeight: 'bold' }}>{invite}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: 24, color: '#94a3b8' }}>Server Status</span>
                            <span style={{ fontSize: 40, fontWeight: 'bold', color: '#4ade80' }}>Online</span>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
