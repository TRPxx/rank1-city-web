export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!isAdmin(session)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // 'site' or 'preregister'

        let configData;
        if (type === 'site') {
            const filePath = path.join(process.cwd(), 'lib', 'config.json');
            const fileContent = await fs.readFile(filePath, 'utf-8');
            configData = JSON.parse(fileContent);
        } else if (type === 'preregister') {
            const filePath = path.join(process.cwd(), 'lib', 'preregister-config.json');
            const fileContent = await fs.readFile(filePath, 'utf-8');
            configData = JSON.parse(fileContent);
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        return NextResponse.json(configData);

    } catch (error) {
        console.error('Settings API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!isAdmin(session)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const { type, data } = body;

        if (!data) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

        let filePath;
        if (type === 'site') {
            filePath = path.join(process.cwd(), 'lib', 'config.json');
        } else if (type === 'preregister') {
            filePath = path.join(process.cwd(), 'lib', 'preregister-config.json');
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        // Write to file
        await fs.writeFile(filePath, JSON.stringify(data, null, 4), 'utf-8');

        // Clear cache
        revalidatePath('/');
        revalidatePath('/api/system/config');

        return NextResponse.json({ success: true, message: 'Settings saved successfully' });

    } catch (error) {
        console.error('Settings Save Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
