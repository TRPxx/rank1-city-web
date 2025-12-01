'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from "date-fns";
import { Datepicker } from "flowbite-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, UserPlus, Mars, Venus, Users, ChevronRight, CheckCircle2, ScrollText, X } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [showTerms, setShowTerms] = useState(false);

    const [date, setDate] = useState(null);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        sex: 'm',
        height: ''
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
            return;
        }

        if (status === 'authenticated') {
            checkUserStatus();
        }
    }, [status, router]);

    const checkUserStatus = async () => {
        try {
            const res = await fetch('/api/user/check');
            const data = await res.json();

            if (data.status === 'found') {
                toast.info('คุณมีข้อมูลในระบบอยู่แล้ว');
                router.push('/profile');
            } else {
                setIsChecking(false);
            }
        } catch (error) {
            console.error('Error checking user:', error);
            toast.error('เกิดข้อผิดพลาดในการตรวจสอบข้อมูล');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSexChange = (value) => {
        setFormData(prev => ({ ...prev, sex: value }));
    };

    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!formData.firstname || !formData.lastname || !date || !formData.height) {
            toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        // Strict Regex: English only, no spaces
        const nameRegex = /^[a-zA-Z]+$/;

        // Trim before check
        const cleanFirstname = formData.firstname.trim();
        const cleanLastname = formData.lastname.trim();

        if (!nameRegex.test(cleanFirstname) || !nameRegex.test(cleanLastname)) {
            toast.error('ชื่อและนามสกุลต้องเป็นภาษาอังกฤษเท่านั้น (A-Z, a-z) ห้ามมีตัวเลข, ช่องว่าง หรืออักขระพิเศษ');
            return;
        }

        if (cleanFirstname.length < 2 || cleanFirstname.length > 20) {
            toast.error('ชื่อต้องมีความยาวระหว่าง 2 ถึง 20 ตัวอักษร');
            return;
        }

        if (cleanLastname.length < 2 || cleanLastname.length > 20) {
            toast.error('นามสกุลต้องมีความยาวระหว่าง 2 ถึง 20 ตัวอักษร');
            return;
        }

        if (parseInt(formData.height) < 100 || parseInt(formData.height) > 250) {
            toast.error('ส่วนสูงต้องอยู่ระหว่าง 100 - 250 ซม.');
            return;
        }

        if (!acceptedTerms) {
            toast.error('กรุณายอมรับข้อตกลงการใช้งาน');
            return;
        }

        // Proceed to register directly
        await handleConfirmRegister();
    };

    const handleConfirmRegister = async () => {
        setIsLoading(true);
        setShowTerms(false);

        const formattedDate = format(date, "dd/MM/yyyy");

        const submitData = {
            ...formData,
            dateofbirth: formattedDate
        };

        try {
            const res = await fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'เกิดข้อผิดพลาด');
            }

            toast.success('ลงทะเบียนสำเร็จ! ยินดีต้อนรับสู่ Rank1 City');
            router.push('/profile');

        } catch (error) {
            toast.error(error.message);
            setIsLoading(false);
        }
    };

    if (status === 'loading' || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const datepickerTheme = {
        root: {
            base: "relative",
            input: {
                base: "block w-full",
                field: {
                    base: "block w-full relative",
                    input: {
                        base: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        sizes: {
                            sm: "",
                            md: "",
                            lg: ""
                        },
                        colors: {
                            gray: "bg-background border-input text-foreground focus:border-ring focus:ring-ring dark:bg-background dark:border-input dark:text-foreground dark:focus:border-ring dark:focus:ring-ring placeholder:text-muted-foreground"
                        }
                    },
                    icon: {
                        base: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
                        svg: "h-4 w-4 text-muted-foreground"
                    }
                }
            }
        },
        popup: {
            root: {
                base: "absolute top-10 z-50 block pt-2",
                inline: "relative top-0 z-auto",
                inner: "inline-block rounded-md border border-border bg-popover p-4 shadow-md outline-none"
            },
            header: {
                base: "",
                title: "px-2 py-3 text-center font-semibold text-popover-foreground",
                selectors: {
                    base: "flex justify-between mb-2",
                    button: {
                        base: "text-sm rounded-md text-popover-foreground bg-popover font-semibold py-2.5 px-5 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                        prev: "",
                        next: "",
                        view: ""
                    }
                }
            },
            view: {
                base: "p-1"
            },
            footer: {
                base: "flex mt-2 space-x-2",
                button: {
                    base: "w-full rounded-md px-5 py-2 text-center text-sm font-medium focus:ring-2 focus:ring-ring",
                    today: "bg-primary text-primary-foreground hover:bg-primary/90",
                    clear: "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                }
            }
        },
        views: {
            days: {
                header: {
                    base: "grid grid-cols-7 mb-1",
                    title: "dow h-6 text-center text-sm font-medium leading-6 text-muted-foreground"
                },
                items: {
                    base: "grid w-64 grid-cols-7",
                    item: {
                        base: "block flex-1 cursor-pointer rounded-md border-0 text-center text-sm font-normal leading-9 text-foreground hover:bg-accent hover:text-accent-foreground",
                        selected: "bg-primary text-primary-foreground hover:bg-primary/90",
                        disabled: "text-muted-foreground opacity-50"
                    }
                }
            },
            months: {
                items: {
                    base: "grid w-64 grid-cols-4",
                    item: {
                        base: "block flex-1 cursor-pointer rounded-md border-0 text-center text-sm font-normal leading-9 text-foreground hover:bg-accent hover:text-accent-foreground",
                        selected: "bg-primary text-primary-foreground hover:bg-primary/90",
                        disabled: "text-muted-foreground opacity-50"
                    }
                }
            },
            years: {
                items: {
                    base: "grid w-64 grid-cols-4",
                    item: {
                        base: "block flex-1 cursor-pointer rounded-md border-0 text-center text-sm font-normal leading-9 text-foreground hover:bg-accent hover:text-accent-foreground",
                        selected: "bg-primary text-primary-foreground hover:bg-primary/90",
                        disabled: "text-muted-foreground opacity-50"
                    }
                }
            },
            decades: {
                items: {
                    base: "grid w-64 grid-cols-4",
                    item: {
                        base: "block flex-1 cursor-pointer rounded-md border-0 text-center text-sm font-normal leading-9 text-foreground hover:bg-accent hover:text-accent-foreground",
                        selected: "bg-primary text-primary-foreground hover:bg-primary/90",
                        disabled: "text-muted-foreground opacity-50"
                    }
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-background to-background z-0" />

            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4 pt-20 z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg"
                >
                    <Card className="border-border shadow-2xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                        <CardHeader className="space-y-1 text-center pb-8">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 transition-transform hover:rotate-0">
                                <UserPlus className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="text-3xl font-bold tracking-tight">ลงทะเบียนพลเมือง</CardTitle>
                            <CardDescription className="text-base">
                                กรอกข้อมูลเพื่อเริ่มต้นชีวิตใหม่ใน <span className="text-primary font-semibold">Rank1 City</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleRegister} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstname">ชื่อจริง</Label>
                                        <Input
                                            id="firstname"
                                            name="firstname"
                                            placeholder="ระบุชื่อจริง"
                                            value={formData.firstname}
                                            onChange={handleChange}
                                            required
                                            className="bg-background"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastname">นามสกุล</Label>
                                        <Input
                                            id="lastname"
                                            name="lastname"
                                            placeholder="ระบุนามสกุล"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            required
                                            className="bg-background"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>วันเดือนปีเกิด</Label>
                                    <Datepicker
                                        language="th-TH"
                                        labelTodayButton="วันนี้"
                                        labelClearButton="ล้างค่า"
                                        onChange={(date) => setDate(date)}
                                        showClearButton={false}
                                        showTodayButton={false}
                                        maxDate={new Date()}
                                        minDate={new Date("1900-01-01")}
                                        theme={datepickerTheme}
                                        className="w-full"
                                    />
                                    <p className="text-[0.8rem] text-muted-foreground">ใช้สำหรับระบุอายุของตัวละคร</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>เพศ</Label>
                                    <RadioGroup
                                        defaultValue="m"
                                        value={formData.sex}
                                        onValueChange={handleSexChange}
                                        className="grid grid-cols-3 gap-4"
                                    >
                                        <div>
                                            <RadioGroupItem value="m" id="sex-m" className="peer sr-only" />
                                            <Label
                                                htmlFor="sex-m"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all h-full"
                                            >
                                                <Mars className="w-8 h-8 mb-2 text-blue-500" />
                                                <span className="font-semibold text-sm">ชาย</span>
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="f" id="sex-f" className="peer sr-only" />
                                            <Label
                                                htmlFor="sex-f"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all h-full"
                                            >
                                                <Venus className="w-8 h-8 mb-2 text-pink-500" />
                                                <span className="font-semibold text-sm">หญิง</span>
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="o" id="sex-o" className="peer sr-only" />
                                            <Label
                                                htmlFor="sex-o"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all h-full"
                                            >
                                                <Users className="w-8 h-8 mb-2 text-purple-500" />
                                                <span className="font-semibold text-sm">ทางเลือก</span>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="height">ส่วนสูง (ซม.)</Label>
                                    <div className="relative">
                                        <Input
                                            id="height"
                                            name="height"
                                            type="number"
                                            placeholder="175"
                                            min="100"
                                            max="250"
                                            value={formData.height}
                                            onChange={handleChange}
                                            required
                                            className="bg-background pr-12"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground text-sm">
                                            cm
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox
                                        id="terms"
                                        checked={acceptedTerms}
                                        onCheckedChange={setAcceptedTerms}
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                                    >
                                        ฉันยอมรับ <button type="button" onClick={() => setShowTerms(true)} className="text-primary hover:underline">ข้อตกลงการใช้งาน</button> และกฎของเซิร์ฟเวอร์
                                    </label>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full text-lg py-6 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all group"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> กำลังสร้างตัวละคร...
                                        </>
                                    ) : (
                                        <>
                                            สร้างตัวละคร <CheckCircle2 className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Custom Modal for Terms of Service */}
            <AnimatePresence>
                {showTerms && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setShowTerms(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-card border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-border">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <ScrollText className="w-6 h-6 text-primary" />
                                    ข้อตกลงการใช้งาน (Terms of Service)
                                </h3>
                                <button
                                    onClick={() => setShowTerms(false)}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-4 text-muted-foreground">
                                <p className="font-medium text-foreground">ยินดีต้อนรับสู่ Rank1 City</p>
                                <p>กรุณาอ่านและทำความเข้าใจข้อตกลงการใช้งานต่อไปนี้ ก่อนที่จะทำการสร้างตัวละครและเข้าสู่โลกของเรา:</p>

                                <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                        <strong className="text-foreground">การเคารพผู้อื่น:</strong> ห้ามใช้ถ้อยคำหยาบคาย การเหยียดเชื้อชาติ ศาสนา หรือเพศ และห้ามก่อกวนผู้เล่นอื่นในลักษณะที่สร้างความรำคาญหรือความเกลียดชัง
                                    </li>
                                    <li>
                                        <strong className="text-foreground">การสวมบทบาท (Roleplay):</strong> ผู้เล่นต้องสวมบทบาทเป็นตัวละครของตนเองตลอดเวลา (IC) และแยกแยะเรื่องราวในเกมออกจากโลกความเป็นจริง (OOC)
                                    </li>
                                    <li>
                                        <strong className="text-foreground">การใช้โปรแกรมช่วยเล่น:</strong> ห้ามใช้โปรแกรมโกง บอท หรือมาโครใดๆ ที่เอาเปรียบผู้เล่นอื่น หากตรวจพบจะถูกระงับไอดีถาวรทันที
                                    </li>
                                    <li>
                                        <strong className="text-foreground">การซื้อขายด้วยเงินจริง (RMT):</strong> ห้ามซื้อขายไอเทมหรือเงินในเกมด้วยเงินจริง ยกเว้นผ่านช่องทางที่เซิร์ฟเวอร์กำหนดเท่านั้น
                                    </li>
                                    <li>
                                        <strong className="text-foreground">บั๊กและช่องโหว่:</strong> หากพบข้อผิดพลาดของระบบ ห้ามนำไปใช้เพื่อแสวงหาผลประโยชน์ และต้องแจ้งทีมงานทันที
                                    </li>
                                </ul>

                                <p className="text-sm mt-4 bg-muted/50 p-4 rounded-md border border-border">
                                    * การกดปุ่ม "ยอมรับและสร้างตัวละคร" ถือว่าท่านได้รับทราบและยอมรับข้อตกลงทั้งหมดข้างต้นแล้ว หากฝ่าฝืนกฎระเบียบ ทีมงานขอสงวนสิทธิ์ในการลงโทษตามความเหมาะสม
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/20">
                                <Button onClick={() => { setShowTerms(false); setAcceptedTerms(true); }} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                                    รับทราบและปิดหน้าต่าง
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
