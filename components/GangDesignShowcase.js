'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Plus, Crown, ArrowRight, Loader2, Layout, Monitor, Smartphone, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Design 1: Classic Card ---
const DesignClassic = ({ joinCode, setJoinCode, createName, setCreateName, handleAction, isActionLoading }) => (
    <div className="h-full flex items-center justify-center p-4 bg-slate-950/50">
        <Card className="w-full max-w-md border-slate-800 shadow-xl bg-slate-900/80 backdrop-blur">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-amber-500" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">Classic Style</CardTitle>
                <CardDescription>Simple, clean, and functional.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <Tabs defaultValue="join" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-950/50">
                        <TabsTrigger value="join">Join Gang</TabsTrigger>
                        <TabsTrigger value="create">Create Gang</TabsTrigger>
                    </TabsList>
                    <TabsContent value="join" className="space-y-4">
                        <Input placeholder="G-XXXXXX" className="text-center uppercase font-mono tracking-widest bg-slate-950/50 border-slate-800" />
                        <Button className="w-full bg-amber-600 hover:bg-amber-700">Join Gang</Button>
                    </TabsContent>
                    <TabsContent value="create" className="space-y-4">
                        <Input placeholder="Gang Name" className="bg-slate-950/50 border-slate-800" />
                        <Button className="w-full bg-amber-600 hover:bg-amber-700">Create Gang</Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
);

// --- Design 2: Split Screen ---
const DesignSplit = () => (
    <div className="h-full flex items-center justify-center p-4 bg-slate-950">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
            <Card className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-all cursor-pointer group">
                <CardHeader>
                    <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-amber-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">Join Gang</CardTitle>
                    <CardDescription>Enter code to join an existing gang.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input placeholder="G-XXXXXX" className="h-12 text-lg text-center uppercase font-mono bg-slate-950/50 border-slate-800" />
                    <Button className="w-full h-12 bg-amber-600 hover:bg-amber-700">Join Now</Button>
                </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-all cursor-pointer group">
                <CardHeader>
                    <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-amber-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">Create Gang</CardTitle>
                    <CardDescription>Start your own legacy.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input placeholder="Gang Name" className="h-12 text-lg bg-slate-950/50 border-slate-800" />
                    <Button className="w-full h-12 bg-amber-600 hover:bg-amber-700">Create Now</Button>
                </CardContent>
            </Card>
        </div>
    </div>
);

// --- Design 3: Hero Split ---
const DesignHero = () => (
    <div className="h-full flex bg-slate-950">
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-amber-900/20 to-slate-950 relative overflow-hidden items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605218427306-635ba2439af2?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            <div className="relative z-10 text-center p-12">
                <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">DOMINATE<br />THE CITY</h1>
                <p className="text-xl text-amber-500 font-medium">Build your empire. Rule the streets.</p>
            </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 bg-slate-900 border-l border-slate-800">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-white">Get Started</h2>
                    <p className="text-slate-400">Choose your path to power.</p>
                </div>
                <Tabs defaultValue="join" className="w-full">
                    <TabsList className="w-full h-12 bg-slate-950 border border-slate-800 p-1">
                        <TabsTrigger value="join" className="flex-1 h-full data-[state=active]:bg-amber-600 data-[state=active]:text-white">Join</TabsTrigger>
                        <TabsTrigger value="create" className="flex-1 h-full data-[state=active]:bg-amber-600 data-[state=active]:text-white">Create</TabsTrigger>
                    </TabsList>
                    <TabsContent value="join" className="space-y-4 mt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Invite Code</label>
                            <Input placeholder="G-XXXXXX" className="h-12 bg-slate-950 border-slate-800" />
                        </div>
                        <Button className="w-full h-12 bg-white text-slate-950 hover:bg-slate-200 font-bold">Join Gang</Button>
                    </TabsContent>
                    <TabsContent value="create" className="space-y-4 mt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Gang Name</label>
                            <Input placeholder="Enter name" className="h-12 bg-slate-950 border-slate-800" />
                        </div>
                        <Button className="w-full h-12 bg-white text-slate-950 hover:bg-slate-200 font-bold">Create Gang</Button>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    </div>
);

// --- Design 4: Glassmorphism ---
const DesignGlass = () => (
    <div className="h-full flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-slate-950/60"></div>

        <Card className="w-full max-w-lg bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl relative z-10">
            <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
                    <Crown className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-white">Gang System</CardTitle>
                <CardDescription className="text-slate-300">Experience the next level of roleplay.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-24 flex flex-col gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-500/50 hover:text-amber-400 transition-all">
                        <Users className="w-6 h-6" />
                        <span className="font-bold">Join Gang</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-500/50 hover:text-amber-400 transition-all">
                        <Plus className="w-6 h-6" />
                        <span className="font-bold">Create Gang</span>
                    </Button>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-transparent px-2 text-slate-400">Or</span>
                    </div>
                </div>
                <Input placeholder="Enter Invite Code Directly" className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 text-center" />
            </CardContent>
        </Card>
    </div>
);

// --- Design 5: Cyberpunk / Neon ---
const DesignNeon = () => (
    <div className="h-full flex items-center justify-center p-4 bg-black">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative h-full bg-black border border-slate-800 p-8 rounded-lg flex flex-col items-center text-center hover:bg-slate-950 transition-colors">
                    <h3 className="text-4xl font-black text-white mb-2 tracking-tighter italic">JOIN</h3>
                    <p className="text-amber-500 font-mono text-sm mb-8">&lt;SYSTEM.CONNECT /&gt;</p>
                    <Input placeholder="CODE: G-XXXX" className="bg-slate-900/50 border-amber-900/50 text-amber-500 font-mono text-center mb-4 focus:border-amber-500 focus:ring-amber-500/20" />
                    <Button className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold font-mono rounded-none skew-x-[-10deg]">INITIATE_LINK</Button>
                </div>
            </div>

            <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative h-full bg-black border border-slate-800 p-8 rounded-lg flex flex-col items-center text-center hover:bg-slate-950 transition-colors">
                    <h3 className="text-4xl font-black text-white mb-2 tracking-tighter italic">CREATE</h3>
                    <p className="text-cyan-500 font-mono text-sm mb-8">&lt;SYSTEM.BUILD /&gt;</p>
                    <Input placeholder="NAME: UNKNOWN" className="bg-slate-900/50 border-cyan-900/50 text-cyan-500 font-mono text-center mb-4 focus:border-cyan-500 focus:ring-cyan-500/20" />
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono rounded-none skew-x-[-10deg]">EXECUTE_NEW</Button>
                </div>
            </div>
        </div>
    </div>
);

// --- Design 6: Minimalist Typography ---
const DesignMinimal = () => (
    <div className="h-full flex items-center justify-center bg-white text-black p-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
        <div className="absolute bottom-0 right-0 w-full h-2 bg-black"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl h-[80%] gap-12">
            <div className="group relative flex items-center justify-center border-r-2 border-transparent hover:border-black transition-all duration-500 cursor-pointer">
                <h1 className="text-8xl md:text-9xl font-black tracking-tighter group-hover:scale-110 transition-transform duration-500">JOIN</h1>
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Input placeholder="CODE" className="text-4xl font-black text-center border-b-4 border-black border-t-0 border-x-0 rounded-none focus:ring-0 placeholder:text-gray-300 w-64" />
                    <Button variant="link" className="text-xl font-bold mt-4 underline decoration-4 underline-offset-4">ENTER &rarr;</Button>
                </div>
            </div>
            <div className="group relative flex items-center justify-center cursor-pointer">
                <h1 className="text-8xl md:text-9xl font-black tracking-tighter group-hover:scale-110 transition-transform duration-500 text-gray-300 group-hover:text-black">CREATE</h1>
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Input placeholder="NAME" className="text-4xl font-black text-center border-b-4 border-black border-t-0 border-x-0 rounded-none focus:ring-0 placeholder:text-gray-300 w-64" />
                    <Button variant="link" className="text-xl font-bold mt-4 underline decoration-4 underline-offset-4">ESTABLISH &rarr;</Button>
                </div>
            </div>
        </div>
    </div>
);

// --- Design 7: Interactive 3D Cards ---
const Design3D = () => (
    <div className="h-full flex items-center justify-center p-8 bg-slate-900 perspective-1000">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
            <motion.div
                whileHover={{ rotateY: 10, rotateX: -5, scale: 1.05 }}
                className="h-96 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl flex flex-col justify-between cursor-pointer border-4 border-white/10"
            >
                <div>
                    <Users className="w-16 h-16 mb-4 opacity-80" />
                    <h2 className="text-4xl font-bold mb-2">JOIN SQUAD</h2>
                    <p className="text-indigo-200">Enter the fray with your allies.</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                    <Input placeholder="G-CODE" className="bg-transparent border-none text-white placeholder:text-indigo-300 text-2xl font-bold text-center focus:ring-0" />
                </div>
            </motion.div>

            <motion.div
                whileHover={{ rotateY: -10, rotateX: -5, scale: 1.05 }}
                className="h-96 bg-gradient-to-br from-pink-600 to-rose-700 rounded-3xl p-8 text-white shadow-2xl flex flex-col justify-between cursor-pointer border-4 border-white/10"
            >
                <div>
                    <Crown className="w-16 h-16 mb-4 opacity-80" />
                    <h2 className="text-4xl font-bold mb-2">START EMPIRE</h2>
                    <p className="text-pink-200">Begin your reign today.</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                    <Input placeholder="NAME" className="bg-transparent border-none text-white placeholder:text-pink-300 text-2xl font-bold text-center focus:ring-0" />
                </div>
            </motion.div>
        </div>
    </div>
);

// --- Design 8: Sidebar Navigation ---
const DesignSidebar = () => {
    const [activeTab, setActiveTab] = useState('join');
    return (
        <div className="h-full flex bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
            <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Gang Menu</div>
                <Button
                    variant={activeTab === 'join' ? 'secondary' : 'ghost'}
                    className="justify-start"
                    onClick={() => setActiveTab('join')}
                >
                    <Users className="w-4 h-4 mr-2" /> Join Gang
                </Button>
                <Button
                    variant={activeTab === 'create' ? 'secondary' : 'ghost'}
                    className="justify-start"
                    onClick={() => setActiveTab('create')}
                >
                    <Plus className="w-4 h-4 mr-2" /> Create Gang
                </Button>
                <div className="mt-auto p-4 bg-slate-950 rounded-lg border border-slate-800">
                    <p className="text-xs text-slate-400">Need help? Contact support via Discord.</p>
                </div>
            </div>
            <div className="flex-1 p-12 flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {activeTab === 'join' ? 'Join an Existing Gang' : 'Create a New Gang'}
                    </h2>
                    <p className="text-slate-400 mb-8">
                        {activeTab === 'join' ? 'Enter the unique code provided by a gang leader.' : 'Set up your organization profile and invite members.'}
                    </p>

                    {activeTab === 'join' ? (
                        <div className="space-y-4">
                            <Input placeholder="G-XXXXXX" className="bg-slate-900 border-slate-800 h-12" />
                            <Button className="w-full h-12">Join Gang</Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Input placeholder="Gang Name" className="bg-slate-900 border-slate-800 h-12" />
                            <Button className="w-full h-12">Create Gang</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Design 9: Step-by-Step Wizard ---
const DesignWizard = () => {
    const [step, setStep] = useState(0); // 0: Choice, 1: Join, 2: Create

    return (
        <div className="h-full flex items-center justify-center p-4 bg-slate-100 text-slate-900">
            <Card className="w-full max-w-2xl shadow-2xl border-0 overflow-hidden">
                <div className="h-2 bg-blue-600 w-full"></div>
                <CardContent className="p-12 text-center">
                    {step === 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h2 className="text-3xl font-bold mb-8">What would you like to do?</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <button onClick={() => setStep(1)} className="p-8 rounded-2xl border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all group text-left">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Join a Gang</h3>
                                    <p className="text-slate-500 text-sm">I have an invite code.</p>
                                </button>
                                <button onClick={() => setStep(2)} className="p-8 rounded-2xl border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all group text-left">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Create a Gang</h3>
                                    <p className="text-slate-500 text-sm">I want to lead my own.</p>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <button onClick={() => setStep(0)} className="text-sm text-slate-400 hover:text-slate-600 mb-8 flex items-center justify-center gap-1">
                                &larr; Back
                            </button>
                            <h2 className="text-2xl font-bold mb-2">Enter Invite Code</h2>
                            <p className="text-slate-500 mb-8">Ask your gang leader for the code.</p>
                            <Input placeholder="G-XXXXXX" className="text-center text-2xl tracking-widest h-16 mb-6 max-w-xs mx-auto" />
                            <Button size="lg" className="w-full max-w-xs bg-blue-600 hover:bg-blue-700">Join Now</Button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <button onClick={() => setStep(0)} className="text-sm text-slate-400 hover:text-slate-600 mb-8 flex items-center justify-center gap-1">
                                &larr; Back
                            </button>
                            <h2 className="text-2xl font-bold mb-2">Name Your Gang</h2>
                            <p className="text-slate-500 mb-8">Choose a unique name for your organization.</p>
                            <Input placeholder="Gang Name" className="text-center text-2xl h-16 mb-6 max-w-xs mx-auto" />
                            <Button size="lg" className="w-full max-w-xs bg-blue-600 hover:bg-blue-700">Create Now</Button>
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

// --- Design 10: Floating Islands ---
const DesignFloating = () => (
    <div className="h-full flex items-center justify-center p-4 bg-sky-900 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

        {/* Join Island */}
        <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[15%] top-[20%] w-80 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[2rem] text-center shadow-[0_0_50px_rgba(0,0,0,0.3)]"
        >
            <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Join Us</h3>
            <Input placeholder="Code" className="bg-white/20 border-none text-white placeholder:text-white/50 text-center mb-2" />
            <Button className="w-full bg-cyan-500 hover:bg-cyan-400 rounded-xl">Fly In</Button>
        </motion.div>

        {/* Create Island */}
        <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-[15%] bottom-[20%] w-80 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[2rem] text-center shadow-[0_0_50px_rgba(0,0,0,0.3)]"
        >
            <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Create New</h3>
            <Input placeholder="Name" className="bg-white/20 border-none text-white placeholder:text-white/50 text-center mb-2" />
            <Button className="w-full bg-purple-500 hover:bg-purple-400 rounded-xl">Launch</Button>
        </motion.div>

        {/* Center Decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h1 className="text-[10rem] font-black text-white/5 select-none">SKY</h1>
        </div>
    </div>
);

export default function GangDesignShowcase(props) {
    const [currentDesign, setCurrentDesign] = useState(1);

    const designs = [
        { id: 1, name: 'Classic', component: DesignClassic, icon: Layout },
        { id: 2, name: 'Split Cards', component: DesignSplit, icon: Monitor },
        { id: 3, name: 'Hero Split', component: DesignHero, icon: Smartphone },
        { id: 4, name: 'Glassmorphism', component: DesignGlass, icon: Palette },
        { id: 5, name: 'Cyberpunk', component: DesignNeon, icon: Monitor },
        { id: 6, name: 'Minimalist', component: DesignMinimal, icon: Layout },
        { id: 7, name: '3D Cards', component: Design3D, icon: Monitor },
        { id: 8, name: 'Sidebar', component: DesignSidebar, icon: Layout },
        { id: 9, name: 'Wizard', component: DesignWizard, icon: Smartphone },
        { id: 10, name: 'Floating', component: DesignFloating, icon: Palette },
    ];

    const ActiveComponent = designs.find(d => d.id === currentDesign)?.component || DesignClassic;

    return (
        <div className="h-full flex flex-col">
            {/* Design Switcher Bar */}
            <div className="h-16 border-b border-slate-800 bg-slate-950 flex items-center px-4 gap-2 overflow-x-auto shrink-0">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Select Design:</span>
                {designs.map((design) => (
                    <Button
                        key={design.id}
                        variant={currentDesign === design.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentDesign(design.id)}
                        className={`gap-2 ${currentDesign === design.id ? 'bg-amber-600 hover:bg-amber-700' : 'border-slate-800 hover:bg-slate-900'}`}
                    >
                        <design.icon className="w-4 h-4" />
                        {design.name}
                    </Button>
                ))}
            </div>

            {/* Design Preview Area */}
            <div className="flex-1 overflow-hidden relative bg-slate-950">
                <ActiveComponent {...props} />
            </div>
        </div>
    );
}
