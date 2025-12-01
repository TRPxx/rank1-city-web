import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            authorization: { params: { scope: 'identify guilds' } },
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account.provider === "discord") {
                const guildId = process.env.DISCORD_GUILD_ID;

                if (!guildId) {

                    return false;
                }

                try {
                    const response = await fetch(`https://discord.com/api/users/@me/guilds`, {
                        headers: {
                            Authorization: `Bearer ${account.access_token}`,
                        },
                    });

                    const guilds = await response.json();
                    const isMember = guilds.some((guild) => guild.id === guildId);

                    if (!isMember) {

                        return false;
                    }

                    return true;
                } catch (error) {

                    return false;
                }
            }
            return true;
        },
        async jwt({ token, account }) {
            // Initial sign in
            if (account) {
                const guildId = process.env.DISCORD_GUILD_ID;
                const ADMIN_ROLE_ID = '1413968718840463527';

                try {
                    // Fetch member details using Bot Token to check roles
                    const response = await fetch(`https://discord.com/api/guilds/${guildId}/members/${token.sub}`, {
                        headers: {
                            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                        },
                    });

                    if (response.ok) {
                        const member = await response.json();
                        const hasAdminRole = member.roles && member.roles.includes(ADMIN_ROLE_ID);
                        token.isAdmin = hasAdminRole;
                    } else {

                        token.isAdmin = false;
                    }
                } catch (error) {

                    token.isAdmin = false;
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.sub;
            session.user.isAdmin = token.isAdmin || false;
            return session;
        },
    },
    pages: {
        error: '/auth/error',
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
