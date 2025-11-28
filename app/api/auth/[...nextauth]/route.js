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
                    console.error("DISCORD_GUILD_ID is not set in environment variables.");
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
                        console.log("User is NOT in the required Discord server.");
                        return false;
                    }

                    return true;
                } catch (error) {
                    console.error("Error checking Discord guild:", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            session.user.id = token.sub;
            return session;
        },
    },
    pages: {
        error: '/auth/error',
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
