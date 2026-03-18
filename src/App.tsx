import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Home, 
  Compass, 
  BookOpen, 
  Leaf, 
  User, 
  Play, 
  ChevronLeft, 
  ChevronRight,
  Calendar, 
  Medal, 
  Ghost, 
  PenSquare, 
  Sun, 
  Moon, 
  CloudRain, 
  CloudSnow, 
  CloudSun,
  X,
  History,
  Heart,
  Settings,
  Share2,
  SkipBack,
  SkipForward,
  Pause,
  Shuffle,
  Repeat,
  Send,
  Search,
  Lock,
  Users,
  MessageCircle,
  Trophy,
  Wind,
  Flame
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { cn } from './lib/utils';

// --- Types ---
interface Session {
  id: string;
  title: string;
  author: string;
  duration: string;
  cover: string;
}

type PageId = 
  | 'home' 
  | 'explore' 
  | 'diary' 
  | 'healing' 
  | 'profile'
  | 'mood-checkin'
  | 'breathing'
  | 'stats'
  | 'assessment'
  | 'course-detail'
  | 'community'
  | 'tree-hole'
  | 'achievements'
  | 'settings'
  | 'player';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

// --- Mock Data ---
const moodData = [
  { name: '周一', value: 45 },
  { name: '周二', value: 60 },
  { name: '周三', value: 25 },
  { name: '周四', value: 55 },
  { name: '周五', value: 78 },
  { name: '周六', value: 85 },
  { name: '周日', value: 92 },
];

const meditationData = [
  { name: '周一', value: 15 },
  { name: '周二', value: 20 },
  { name: '周三', value: 10 },
  { name: '周四', value: 25 },
  { name: '周五', value: 30 },
  { name: '周六', value: 45 },
  { name: '周日', value: 40 },
];

// --- Components ---

const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute w-full h-full bg-[#F0F8FF]" />
    <motion.div 
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -50, 20, 0],
        scale: [1, 1.1, 0.9, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-64 h-64 bg-[#E6E6FA] blur-[60px] opacity-50 -top-10 -left-10"
    />
    <motion.div 
      animate={{
        x: [0, -30, 20, 0],
        y: [0, 50, -20, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute w-72 h-72 bg-[#89CFF0] blur-[60px] opacity-50 -bottom-10 -right-10"
    />
    <motion.div 
      animate={{
        x: [0, 20, -30, 0],
        y: [0, 30, -50, 0],
        scale: [1, 0.9, 1.1, 1],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      className="absolute w-60 h-60 bg-[#FFD8B1] blur-[60px] opacity-30 top-1/3 right-10"
    />
  </div>
);

const Navbar = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (id: PageId) => void }) => {
  const tabs = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'explore', icon: Compass, label: '探索' },
    { id: 'diary', icon: BookOpen, label: '日记' },
    { id: 'healing', icon: Leaf, label: '疗愈' },
    { id: 'profile', icon: User, label: '我的' },
  ];

  return (
    <div className="h-[80px] bg-[#2A2D34]/90 backdrop-blur-2xl absolute bottom-0 w-full flex items-center justify-around px-4 rounded-t-[32px] z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as PageId)}
          className={cn(
            "flex flex-col items-center transition-colors relative",
            activeTab === tab.id ? "text-[#FFD8B1]" : "text-white/50"
          )}
        >
          {activeTab === tab.id && (
            <motion.div 
              layoutId="nav-indicator"
              className="absolute -top-1 w-1 h-1 bg-[#FFD8B1] rounded-full" 
            />
          )}
          <tab.icon size={24} />
          <span className="text-[10px] mt-1">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

// --- Page Views ---

const HomeView = ({ onNavigate }: { onNavigate: (id: PageId) => void }) => {
  const [insight, setInsight] = useState('加载今日灵感...');
  const [isInsightLoading, setIsInsightLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
        const response = await genAI.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "请为心理疗愈应用生成一条简短的今日灵感（20字以内），语气温暖、治愈。",
        });
        setInsight(response.text || '每一个不曾起舞的日子，都是对生命的辜负。');
      } catch (error) {
        setInsight('愿你今天也能温柔地对待自己。');
      } finally {
        setIsInsightLoading(false);
      }
    };
    fetchInsight();
  }, []);

  return (
    <div className="h-full flex flex-col relative">
      <div className="h-[56px] px-6 flex items-center justify-between relative z-10 backdrop-blur-md bg-white/10">
        <span className="text-[#2A2D34] font-medium text-lg">Serenity</span>
        <div className="flex gap-3">
          <button onClick={() => onNavigate('mood-checkin')} className="w-8 h-8 rounded-full bg-white/40 border border-white/20 flex items-center justify-center">
            <Sun size={16} className="text-amber-400" />
          </button>
          <button onClick={() => onNavigate('profile')} className="w-8 h-8 rounded-full bg-white/40 border border-white/20 flex items-center justify-center">
            <User size={16} className="text-[#5D6979]" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 relative z-10 hide-scrollbar pb-24">
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 p-5 rounded-[24px] shadow-sm">
          <p className="text-sm text-[#5D6979] mb-1">2026年03月17日</p>
          <h2 className="text-2xl font-semibold text-[#2A2D34]">今日宜静心</h2>
          <div className="mt-3 p-3 bg-white/20 rounded-xl border border-white/30">
            <p className={cn("text-xs text-[#2A2D34] italic", isInsightLoading && "animate-pulse")}>
              “ {insight} ”
            </p>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="flex-1 bg-white/40 p-3 rounded-2xl cursor-pointer" onClick={() => onNavigate('stats')}>
              <p className="text-[10px] text-[#5D6979] uppercase tracking-wider">压力指数</p>
              <p className="text-lg font-bold text-[#89CFF0]">42%</p>
            </div>
            <div className="flex-1 bg-white/40 p-3 rounded-2xl cursor-pointer" onClick={() => onNavigate('achievements')}>
              <p className="text-[10px] text-[#5D6979] uppercase tracking-wider">已冥想</p>
              <p className="text-lg font-bold text-[#27AE60]">15m</p>
            </div>
          </div>
        </div>

      <div>
        <h3 className="text-sm font-medium text-[#2A2D34] mb-3 px-1">AI 智能推荐</h3>
        <div className="relative group cursor-pointer" onClick={() => onNavigate('course-detail')}>
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD8B1] to-[#E6E6FA] rounded-[24px] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white/60 backdrop-blur-lg rounded-[24px] overflow-hidden">
            <img 
              src="https://picsum.photos/seed/meditation/400/200" 
              alt="Meditation" 
              className="w-full h-40 object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="p-4">
              <span className="bg-[#FFD8B1] text-[#2A2D34] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">AI 方案</span>
              <h4 className="mt-2 text-lg font-medium">午间片段：瞬时放松</h4>
              <p className="text-xs text-[#5D6979] mt-1">适合在工作间隙缓解视觉疲劳与压力</p>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => onNavigate('breathing')}
        className="w-full h-[60px] bg-[#FFD8B1] rounded-[20px] flex items-center justify-center gap-3 shadow-lg shadow-orange-100 hover:scale-[0.98] transition-transform"
      >
        <Play size={24} fill="currentColor" className="text-[#2A2D34]" />
        <span className="font-semibold text-[#2A2D34]">3分钟紧急平静</span>
      </button>

      <div className="grid grid-cols-2 gap-4">
        <div onClick={() => onNavigate('explore')} className="bg-white/40 backdrop-blur-md p-4 rounded-3xl flex flex-col items-center cursor-pointer hover:bg-white/50 transition-colors">
          <BookOpen size={24} className="text-[#89CFF0]" />
          <span className="text-xs mt-2 text-[#5D6979]">冥想库</span>
        </div>
        <div onClick={() => onNavigate('community')} className="bg-white/40 backdrop-blur-md p-4 rounded-3xl flex flex-col items-center cursor-pointer hover:bg-white/50 transition-colors">
          <Users size={24} className="text-[#E6E6FA]" />
          <span className="text-xs mt-2 text-[#5D6979]">共鸣社区</span>
        </div>
      </div>
    </div>
  </div>
);
};

const MoodCheckinView = ({ onNavigate }: { onNavigate: (id: PageId) => void }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const weathers = [
    { id: 'sunny', icon: Sun, label: '晴朗', color: 'text-amber-400' },
    { id: 'cool', icon: CloudSnow, label: '微凉', color: 'text-[#89CFF0]' },
    { id: 'cloudy', icon: CloudSun, label: '多云', color: 'text-[#E6E6FA]' },
    { id: 'rainy', icon: CloudRain, label: '阵雨', color: 'text-slate-400' },
  ];

  const handleConfirm = () => {
    if (selectedMood) {
      onNavigate('home');
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="h-[56px] px-6 items-center flex relative z-10">
        <button onClick={() => onNavigate('home')}>
          <ChevronLeft className="text-[#5D6979]" />
        </button>
        <span className="ml-4 text-[#2A2D34] font-medium">情绪天气</span>
      </div>
      <div className="flex-1 px-6 flex flex-col relative z-10 pt-8">
        <h1 className="text-2xl font-semibold text-[#2A2D34] leading-tight text-center">此刻你的心境<br/>更像哪种天气？</h1>
        <p className="text-sm text-[#5D6979] mt-3 text-center">AI将根据您的状态匹配背景音效</p>
        
        <div className="grid grid-cols-2 gap-6 mt-12">
          {weathers.map((w) => (
            <div 
              key={w.id}
              onClick={() => setSelectedMood(w.id)}
              className={cn(
                "aspect-square bg-white/60 backdrop-blur-md rounded-[32px] flex flex-col items-center justify-center transition-all cursor-pointer group border-2",
                selectedMood === w.id ? "border-[#89CFF0] bg-white/80" : "border-transparent hover:border-[#89CFF0]/30"
              )}
            >
              <w.icon size={48} className={cn(w.color, "transition-transform group-hover:scale-110")} />
              <span className="mt-3 font-medium">{w.label}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-auto mb-10">
          <button 
            onClick={handleConfirm}
            disabled={!selectedMood}
            className={cn(
              "w-full py-4 rounded-2xl font-medium shadow-lg transition-all",
              selectedMood ? "bg-[#89CFF0] text-white shadow-blue-100" : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            确认并开启疗愈
          </button>
        </div>
      </div>
    </div>
  );
};

const BreathingView = ({ onNavigate }: { onNavigate: (id: PageId) => void }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(180);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    let phaseInterval: any;
    if (isActive) {
      const cycle = () => {
        setPhase('inhale');
        setTimeout(() => setPhase('hold'), 4000);
        setTimeout(() => setPhase('exhale'), 8000);
      };
      cycle();
      phaseInterval = setInterval(cycle, 12000);
    }
    return () => clearInterval(phaseInterval);
  }, [isActive]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="h-full flex flex-col relative bg-[#E6E6FA]/20">
      <div className="h-[56px] px-6 flex justify-between items-center relative z-10">
        <button onClick={() => onNavigate('home')}>
          <X className="text-[#5D6979]" />
        </button>
        <span className="text-[#2A2D34] text-xs font-semibold tracking-widest uppercase">深呼吸练习</span>
        <div className="w-5" />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="relative flex items-center justify-center mb-20">
          <motion.div 
            animate={{ 
              scale: phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 1,
              opacity: phase === 'inhale' ? 0.8 : phase === 'hold' ? 1 : 0.6
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="w-32 h-32 bg-[#FFD8B1] rounded-full blur-2xl absolute"
          />
          <motion.div 
            animate={{ 
              scale: phase === 'inhale' ? 1.6 : phase === 'hold' ? 1.6 : 1
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="w-48 h-48 border-2 border-[#FFD8B1]/30 rounded-full absolute"
          />
          <div className="w-24 h-24 bg-white/80 backdrop-blur-md rounded-full shadow-inner flex items-center justify-center z-20">
            <span className="text-[#2A2D34] font-light text-2xl tracking-tighter">
              {phase === 'inhale' ? '吸气' : phase === 'hold' ? '屏息' : '呼气'}
            </span>
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-[#2A2D34] text-lg font-bold">{formatTime(timeLeft)}</p>
          <p className="text-[#5D6979] text-sm">跟随圆圈的节奏，平稳呼吸</p>
        </div>
        
        <button 
          onClick={() => setIsActive(!isActive)}
          className={cn(
            "mt-12 px-12 py-4 rounded-full font-bold text-white shadow-lg transition-all active:scale-95",
            isActive ? "bg-rose-400 shadow-rose-100" : "bg-[#89CFF0] shadow-blue-100"
          )}
        >
          {isActive ? '暂停' : '开始练习'}
        </button>
      </div>
    </div>
  );
};

const StatsView = ({ onNavigate }: { onNavigate: (id: PageId) => void }) => (
  <div className="h-full flex flex-col relative">
    <div className="h-[56px] px-6 flex items-center justify-between relative z-10">
      <h1 className="text-[#2A2D34] font-medium">统计回顾</h1>
      <Calendar size={20} className="text-[#5D6979]" />
    </div>
    <div className="flex-1 px-5 py-6 space-y-6 relative z-10 overflow-y-auto hide-scrollbar pb-24">
      <div className="bg-white/50 border border-white p-5 rounded-[32px] shadow-sm backdrop-blur-lg">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[10px] text-[#5D6979] uppercase">本周心情起伏</p>
            <h3 className="text-xl font-semibold text-[#2A2D34] mt-1">稳步回升</h3>
          </div>
          <span className="text-xs text-[#27AE60] bg-[#27AE60]/10 px-2 py-1 rounded-lg">+12% 平静度</span>
        </div>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={moodData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#89CFF0" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#89CFF0" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#89CFF0" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/50 border border-white p-5 rounded-[32px] shadow-sm backdrop-blur-lg">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[10px] text-[#5D6979] uppercase">本周冥想时长 (分钟)</p>
            <h3 className="text-xl font-semibold text-[#2A2D34] mt-1">深度专注</h3>
          </div>
          <span className="text-xs text-[#89CFF0] bg-[#89CFF0]/10 px-2 py-1 rounded-lg">共 185 分钟</span>
        </div>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={meditationData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {meditationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 5 ? '#89CFF0' : '#E6E6FA'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/50 border border-white p-5 rounded-[32px] shadow-sm backdrop-blur-lg space-y-4">
        <h3 className="text-sm font-medium">心理洞察</h3>
        <div className="flex gap-4">
          <div className="w-1 bg-[#89CFF0] rounded-full" />
          <p className="text-xs text-[#5D6979] leading-relaxed">过去7天，你在早晨的焦虑感显著降低，这可能与你坚持清晨的“5分钟呼吸练习”有关。</p>
        </div>
        <div className="flex gap-4">
          <div className="w-1 bg-[#E6E6FA] rounded-full" />
          <p className="text-xs text-[#5D6979] leading-relaxed">周三晚间压力峰值明显，建议下周此时段安排一次“深度冥想”。</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-[#FFD8B1]/20 border border-[#FFD8B1]/30 p-4 rounded-[24px] text-center">
          <Medal className="mx-auto text-[#FFD8B1]" size={24} />
          <p className="text-[10px] mt-2 text-[#5D6979]">连胜天数</p>
          <p className="text-lg font-bold">12</p>
        </div>
        <div className="flex-1 bg-[#98FF98]/20 border border-[#98FF98]/30 p-4 rounded-[24px] text-center">
          <Ghost className="mx-auto text-emerald-500" size={24} />
          <p className="text-[10px] mt-2 text-[#5D6979]">治愈瞬间</p>
          <p className="text-lg font-bold">84</p>
        </div>
      </div>
    </div>
  </div>
);

const DiaryView = ({ onNavigate }: { onNavigate: (id: PageId) => void }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isToday = (d: number) => {
    const today = new Date();
    return d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const isSelected = (d: number) => {
    return d === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
  };

  // Mock mood data for calendar dots
  const moodDots: Record<number, string> = {
    10: 'bg-amber-400',
    12: 'bg-[#89CFF0]',
    15: 'bg-[#E6E6FA]',
    17: 'bg-emerald-400',
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="h-[56px] px-6 flex items-center justify-between relative z-10 backdrop-blur-md">
        <h1 className="text-[#2A2D34] font-medium">心迹回顾</h1>
        <div className="flex gap-3">
          <button onClick={() => onNavigate('tree-hole')}>
            <Flame size={20} className="text-amber-400" />
          </button>
          <button onClick={() => onNavigate('mood-checkin')}>
            <PenSquare size={20} className="text-[#89CFF0]" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 relative z-10 hide-scrollbar pb-24">
        {/* Calendar Card */}
        <div className="bg-white/60 backdrop-blur-xl border border-white p-5 rounded-[32px] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-[#2A2D34]">{year}年 {month + 1}月</h2>
            <div className="flex gap-4">
              <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                <ChevronLeft size={18} className="text-[#5D6979]" />
              </button>
              <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                <ChevronRight size={18} className="text-[#5D6979]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-4 text-center">
            {['日', '一', '二', '三', '四', '五', '六'].map(d => (
              <span key={d} className="text-[10px] font-bold text-slate-300 uppercase">{d}</span>
            ))}
            {days.map((d, i) => (
              <div key={i} className="flex flex-col items-center justify-center h-10 relative">
                {d && (
                  <button
                    onClick={() => setSelectedDate(new Date(year, month, d))}
                    className={cn(
                      "w-8 h-8 rounded-full text-xs flex items-center justify-center transition-all relative",
                      isSelected(d) ? "bg-[#89CFF0] text-white shadow-lg shadow-blue-100 font-bold" : 
                      isToday(d) ? "text-[#89CFF0] font-bold" : "text-[#2A2D34]"
                    )}
                  >
                    {d}
                    {moodDots[d] && !isSelected(d) && (
                      <span className={cn("absolute -bottom-1 w-1 h-1 rounded-full", moodDots[d])} />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Day Entries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-[#2A2D34]">
              {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日 的记录
            </h3>
            <span className="text-[10px] text-slate-400">共 {isSelected(17) ? '2' : '0'} 条记录</span>
          </div>

          {isSelected(17) ? (
            <>
              <div className="bg-white/60 backdrop-blur-xl border border-white p-5 rounded-[28px] shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold text-[#E6E6FA] tracking-tighter uppercase">11:24</span>
                  <Sun size={14} className="text-amber-300" />
                </div>
                <p className="text-sm text-[#2A2D34] leading-relaxed">完成了早晨的冥想后，感觉整个人的重心都放低了。原本担心的项目会议，也能够以更平稳的心态去复盘...</p>
                <div className="mt-4 flex gap-2">
                  <span className="text-[9px] px-2 py-0.5 bg-[#89CFF0]/10 text-[#89CFF0] rounded-sm">午间思考</span>
                  <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-400 rounded-sm">#职场稳态</span>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white p-5 rounded-[28px] shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold text-[#5D6979] tracking-tighter uppercase">08:15</span>
                  <Wind size={14} className="text-[#89CFF0]" />
                </div>
                <p className="text-sm text-[#2A2D34] leading-relaxed">晨间呼吸练习，空气很清新。今天也要加油。</p>
              </div>
            </>
          ) : (
            <div className="bg-white/40 backdrop-blur-md border border-dashed border-slate-200 p-8 rounded-[28px] text-center">
              <p className="text-xs text-slate-400">这一天还没有留下文字记录</p>
              <button 
                onClick={() => onNavigate('mood-checkin')}
                className="mt-4 text-xs font-bold text-[#89CFF0] hover:underline"
              >
                去记录此刻心情 →
              </button>
            </div>
          )}
        </div>

        <div className="h-20 flex items-center justify-center text-xs text-[#5D6979]/40 font-light">
          —— 你的文字，是时间的温柔回响 ——
        </div>
      </div>
    </div>
  );
};

const ExploreView = ({ onNavigate }: { onNavigate: (id: PageId) => void }) => (
  <div className="h-full flex flex-col relative">
    <div className="h-[56px] px-6 flex items-center justify-between relative z-10">
      <h1 className="text-[#2A2D34] font-medium">我的白噪音库</h1>
      <Search size={20} className="text-[#5D6979]" />
    </div>
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 relative z-10 hide-scrollbar pb-24">
      <div className="grid grid-cols-2 gap-4">
        {[
          { title: '林间清风', icon: Wind, color: 'bg-[#89CFF0]/20', iconColor: 'text-[#89CFF0]', count: '1,240' },
          { title: '壁炉火光', icon: Flame, color: 'bg-[#FFD8B1]/20', iconColor: 'text-[#FFD8B1]', count: '2,103' },
          { title: '深海共鸣', icon: Ghost, color: 'bg-[#E6E6FA]/20', iconColor: 'text-[#E6E6FA]', count: '856' },
          { title: '夏日雨声', icon: CloudRain, color: 'bg-slate-100', iconColor: 'text-slate-400', count: '3,412' },
        ].map((item, i) => (
          <div key={i} className="bg-white/60 p-4 rounded-[24px] border border-white shadow-sm cursor-pointer hover:scale-[0.98] transition-transform">
            <div className={cn("w-full aspect-square rounded-2xl flex items-center justify-center mb-3", item.color)}>
              <item.icon size={40} className={item.iconColor} />
            </div>
            <p className="font-medium text-sm">{item.title}</p>
            <p className="text-[10px] text-[#5D6979]">{item.count} 人正在听</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const HealingView = ({ onNavigate }: { onNavigate: (id: PageId) => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '你好，我是你的AI心理伙伴。感觉到你今天的情绪似乎有些低落，愿意和我聊聊发生了什么吗？',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = genAI.models.get({ model: "gemini-3-flash-preview" });
      
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `你是一个专业的心理咨询师，名字叫Serene。你的语气温和、有同理心、专业且支持。请回应以下用户的话：${input}` }]
          }
        ],
        config: {
          systemInstruction: "你是一个名为Serene的专业心理咨询师。你的目标是提供情感支持、心理疏导和建议。保持简洁、温暖且专业的语气。如果用户表现出严重的心理问题或自残倾向，请引导他们寻求专业医疗帮助。"
        }
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text || '抱歉，我现在无法回应。请稍后再试。',
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '抱歉，连接AI伙伴时出了点问题。请检查网络或稍后再试。',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="h-[56px] px-6 flex items-center border-b border-gray-100 bg-white relative z-10">
        <div className="w-8 h-8 bg-[#89CFF0] rounded-full flex items-center justify-center mr-3">
          <Ghost size={16} className="text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-[#2A2D34]">AI 心理伙伴 Serene</h2>
          <p className="text-[9px] text-emerald-500 flex items-center">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1" />
            在线倾听中
          </p>
        </div>
        <button onClick={() => onNavigate('assessment')} className="text-xs text-[#89CFF0] font-medium border border-[#89CFF0]/20 px-3 py-1 rounded-full">
          压力评估
        </button>
      </div>
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-2", msg.sender === 'user' ? "flex-row-reverse" : "")}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 bg-[#89CFF0]/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Ghost size={16} className="text-[#89CFF0]" />
                </div>
              )}
              <div className={cn(
                "p-3 rounded-2xl shadow-sm max-w-[80%] border",
                msg.sender === 'ai' 
                  ? "bg-white rounded-tl-none border-gray-100 text-[#2A2D34]" 
                  : "bg-[#89CFF0] rounded-tr-none border-[#89CFF0] text-white"
              )}>
                <p className="text-xs leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-[#89CFF0]/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                <Ghost size={16} className="text-[#89CFF0]" />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#89CFF0] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#89CFF0] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#89CFF0] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 bg-white border-t border-gray-100 mb-[80px]">
          <div className="flex gap-2">
            <div className="flex-1 bg-slate-100 rounded-full px-4 py-2 flex items-center">
              <input 
                className="bg-transparent border-none focus:outline-none text-xs w-full" 
                placeholder="输入你想说的..." 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
            </div>
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors",
                isLoading || !input.trim() ? "bg-slate-300" : "bg-[#89CFF0]"
              )}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileView = ({ onNavigate }: { onNavigate: (id: PageId) => void }) => (
  <div className="h-full flex flex-col relative">
    <div className="h-[220px] bg-gradient-to-br from-[#E6E6FA] to-[#F8F8FF] relative flex flex-col items-center justify-center">
      <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden mb-3">
        <img 
          className="w-full h-full object-cover" 
          src="https://picsum.photos/seed/avatar/200/200" 
          alt="Avatar"
          referrerPolicy="no-referrer"
        />
      </div>
      <h2 className="text-lg font-bold text-[#2A2D34]">沐浴时光</h2>
      <p className="text-xs text-[#5D6979]">加入 Serenity 第 342 天</p>
    </div>
    <div className="flex-1 px-6 space-y-6 pt-8 relative z-10 overflow-y-auto hide-scrollbar pb-24">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center cursor-pointer" onClick={() => onNavigate('stats')}>
          <p className="text-lg font-bold text-[#2A2D34]">4.2k</p>
          <p className="text-[10px] text-slate-400">累计时长</p>
        </div>
        <div className="text-center border-x border-slate-100">
          <p className="text-lg font-bold text-[#2A2D34]">56</p>
          <p className="text-[10px] text-slate-400">已修课程</p>
        </div>
        <div className="text-center cursor-pointer" onClick={() => onNavigate('achievements')}>
          <p className="text-lg font-bold text-[#2A2D34]">128</p>
          <p className="text-[10px] text-slate-400">收藏瞬间</p>
        </div>
      </div>

      <div className="space-y-4">
        <div onClick={() => onNavigate('stats')} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <History size={20} className="text-[#89CFF0]" />
            <span className="text-sm">最近练习记录</span>
          </div>
          <SkipForward size={16} className="text-slate-300" />
        </div>
        <div onClick={() => onNavigate('achievements')} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Trophy size={20} className="text-[#FFD8B1]" />
            <span className="text-sm">我的成就勋章</span>
          </div>
          <SkipForward size={16} className="text-slate-300" />
        </div>
        <div onClick={() => onNavigate('settings')} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Settings size={20} className="text-indigo-400" />
            <span className="text-sm">偏好与设置</span>
          </div>
          <SkipForward size={16} className="text-slate-300" />
        </div>
      </div>

      <div className="p-4 bg-[#89CFF0]/10 rounded-2xl border border-[#89CFF0]/20">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-[#89CFF0]">Serenity Pro</p>
            <p className="text-[9px] text-[#5D6979]">尊享 200+ 专属疗愈音频</p>
          </div>
          <button className="px-4 py-1.5 bg-[#89CFF0] text-white text-[10px] rounded-full font-bold">查看详情</button>
        </div>
      </div>
    </div>
  </div>
);

const PlayerView = ({ onNavigate, session }: { onNavigate: (id: PageId) => void, session: Session | null }) => {
  const displaySession = session || {
    id: 'default',
    title: '晨间唤醒冥想',
    author: '引导语：李思远 心理师',
    duration: '15:00',
    cover: 'https://picsum.photos/seed/nature/400/400'
  };

  return (
    <div className="h-full flex flex-col relative bg-[#2A2D34] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#3D4451] to-[#1A1C22] opacity-50" />
      <div className="h-[56px] px-6 flex items-center justify-between relative z-10">
        <button onClick={() => onNavigate('home')}>
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <p className="text-[10px] text-white/40 uppercase tracking-widest">正在播放</p>
          <p className="text-xs font-medium">{displaySession.title}</p>
        </div>
        <Share2 size={20} />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <div className="w-64 h-64 rounded-full border border-white/10 flex items-center justify-center relative mb-12">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.1, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 rounded-full border border-white/5" 
          />
          <img 
            className="w-56 h-56 rounded-full object-cover shadow-2xl" 
            src={displaySession.cover} 
            alt="Cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="text-center mb-10 w-full">
          <h2 className="text-white text-2xl font-semibold">{displaySession.title}</h2>
          <p className="text-white/50 text-sm mt-2">{displaySession.author}</p>
        </div>
        
        <div className="w-full space-y-2 mb-10">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-[#FFD8B1]" />
          </div>
          <div className="flex justify-between text-[10px] text-white/30">
            <span>05:20</span>
            <span>{displaySession.duration}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between w-full px-6">
          <Shuffle size={20} className="text-white/40" />
          <SkipBack size={28} className="text-white/80" />
          <div className="w-16 h-16 bg-[#FFD8B1] rounded-full flex items-center justify-center shadow-lg cursor-pointer">
            <Pause size={32} fill="#2A2D34" className="text-[#2A2D34]" />
          </div>
          <SkipForward size={28} className="text-white/80" />
          <Repeat size={20} className="text-white/40" />
        </div>
      </div>
    </div>
  );
};

const SettingsView = ({ onNavigate }: { onNavigate: (id: PageId) => void }) => (
  <div className="h-full flex flex-col relative">
    <div className="h-[56px] px-6 flex items-center bg-white relative z-10">
      <button onClick={() => onNavigate('profile')}>
        <ChevronLeft size={24} className="mr-4 text-[#2A2D34]" />
      </button>
      <h1 className="text-[#2A2D34] font-medium">应用设置</h1>
    </div>
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 relative z-10 hide-scrollbar">
      <div className="space-y-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1">基础设置</p>
        <div className="bg-slate-50 rounded-2xl p-4 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">深色模式</span>
            <div className="w-10 h-5 bg-slate-200 rounded-full relative">
              <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">消息通知</span>
            <div className="w-10 h-5 bg-[#89CFF0] rounded-full relative">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1">隐私与服务</p>
        <div className="bg-slate-50 rounded-2xl p-4 space-y-6">
          <div className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium">账号隐私设置</span>
            <SkipForward size={16} className="text-slate-300" />
          </div>
          <div className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium">清除本地缓存</span>
            <span className="text-[10px] text-slate-400">128 MB</span>
          </div>
        </div>
      </div>

      <button className="w-full py-4 text-red-400 text-sm font-medium">退出登录</button>
      
      <div className="text-center pt-10">
        <p className="text-[10px] text-slate-300">© 2026 Serenity AI. All rights reserved.</p>
      </div>
    </div>
  </div>
);

const CommunityView = ({ onNavigate }: { onNavigate: (id: PageId) => void }) => (
  <div className="h-full flex flex-col relative">
    <div className="h-[56px] px-6 flex items-center justify-between relative z-10 border-b border-slate-50">
      <h1 className="text-[#2A2D34] font-medium">共鸣社区</h1>
      <Users size={20} className="text-[#89CFF0]" />
    </div>
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 relative z-10 hide-scrollbar pb-24">
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex-shrink-0 items-center flex flex-col gap-1">
            <div className={cn("w-14 h-14 rounded-full border-2 p-0.5", i === 1 ? "border-[#FFD8B1]" : "border-slate-200")}>
              <img className="rounded-full" src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
            </div>
            <span className="text-[10px] text-[#5D6979]">{i === 1 ? '练习中' : '已打卡'}</span>
          </div>
        ))}
      </div>
      
      <div className="bg-slate-50 rounded-[24px] p-5 space-y-4">
        <div className="flex items-center gap-3">
          <img className="w-10 h-10 rounded-full" src="https://i.pravatar.cc/100?u=9" alt="User" />
          <div>
            <p className="text-xs font-bold">林间小鹿</p>
            <p className="text-[10px] text-slate-400">2026-03-17 09:12</p>
          </div>
        </div>
        <p className="text-sm text-[#2A2D34] leading-relaxed">今天在清晨的练习中获得了一种前所未有的自由感。感觉自己像是一片飘在半空的云。#冥想日常</p>
        <div className="grid grid-cols-2 gap-2">
          <img className="rounded-xl w-full h-24 object-cover" src="https://picsum.photos/seed/forest/200/100" alt="Post" />
          <img className="rounded-xl w-full h-24 object-cover" src="https://picsum.photos/seed/clouds/200/100" alt="Post" />
        </div>
        <div className="flex justify-between pt-2">
          <div className="flex gap-4">
            <span className="flex items-center gap-1 text-[10px] text-slate-400"><Heart size={14} /> 128</span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400"><MessageCircle size={14} /> 34</span>
          </div>
          <Share2 size={14} className="text-slate-300" />
        </div>
      </div>
    </div>
  </div>
);

const TreeHoleView = ({ onNavigate }: { onNavigate: (id: PageId) => void }) => (
  <div className="h-full flex flex-col relative bg-[#2A2D34] text-white">
    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-transparent opacity-50" />
    <div className="h-[56px] px-6 flex items-center justify-between relative z-10">
      <button onClick={() => onNavigate('diary')}>
        <ChevronLeft size={20} />
      </button>
      <h1 className="font-medium">星光树洞</h1>
      <Flame size={20} className="text-amber-400" />
    </div>
    <div className="flex-1 flex flex-col relative z-10 px-6 pt-8 overflow-y-auto hide-scrollbar pb-24">
      <div className="flex-1 space-y-8">
        <motion.div 
          initial={{ rotate: 1, opacity: 0, y: 20 }}
          animate={{ rotate: 1, opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-[32px]"
        >
          <p className="text-white/80 text-sm leading-loose">有些秘密只能说给星星听。今晚，我终于放下了对那个人的执念，祝他好，也祝我自己好。</p>
          <p className="mt-4 text-[10px] text-white/30 text-right">— 来自某个遥远的小行星</p>
        </motion.div>
        <motion.div 
          initial={{ rotate: -2, opacity: 0, y: 20 }}
          animate={{ rotate: -2, opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-[32px]"
        >
          <p className="text-white/80 text-sm leading-loose">工作压力真的好大，感觉要碎了。写在这里，希望明早醒来能有力气继续。加油，陌生人。</p>
          <p className="mt-4 text-[10px] text-white/30 text-right">— 深海里的鱼</p>
        </motion.div>
      </div>
      <div className="mt-8 mb-10 text-center space-y-4">
        <button className="w-full py-4 bg-white/10 hover:bg-white/20 transition-all text-white rounded-2xl border border-white/20 flex items-center justify-center gap-3">
          <PenSquare size={18} />
          <span>投递我的心情信笺</span>
        </button>
        <p className="text-[10px] text-white/20">这些心声将在24小时后化作流星消失</p>
      </div>
    </div>
  </div>
);

const AssessmentView = ({ onNavigate }: { onNavigate: (id: PageId) => void }) => (
  <div className="h-full flex flex-col relative">
    <div className="h-[56px] px-6 flex items-center justify-between relative z-10">
      <button onClick={() => onNavigate('healing')}>
        <ChevronLeft size={20} />
      </button>
      <span className="font-medium text-sm">焦虑自评量表 (SAS)</span>
      <span className="text-[10px] text-[#5D6979]">1/20</span>
    </div>
    <div className="flex-1 px-6 pt-10 relative z-10 flex flex-col pb-24">
      <div className="w-full h-1 bg-slate-100 rounded-full mb-12">
        <div className="w-[5%] h-full bg-[#89CFF0] rounded-full shadow-[0_0_8px_rgba(137,207,240,0.5)]" />
      </div>
      <h2 className="text-xl font-semibold text-[#2A2D34] mb-10 leading-relaxed">我觉得比平常容易激动或者着急，甚至感到惊恐？</h2>
      <div className="space-y-4">
        {['没有或很少时间有', '小部分时间有', '相当多时间有', '绝大部分或全部时间有'].map((option, i) => (
          <button 
            key={i}
            onClick={() => onNavigate('healing')}
            className="w-full py-4 px-6 text-left border border-slate-200 rounded-2xl hover:border-[#89CFF0] hover:bg-[#89CFF0]/5 transition-all text-sm text-[#5D6979]"
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-auto mb-10 text-center">
        <p className="text-[10px] text-slate-300">所有评估结果仅供参考，不作为医疗诊断依据</p>
      </div>
    </div>
  </div>
);

const CourseDetailView = ({ onNavigate, onPlay }: { onNavigate: (id: PageId) => void, onPlay: (session: Session) => void }) => {
  const chapters = [
    { id: '1', title: '唤醒：建立身体觉知', duration: '12:00', author: '王宁 导师', cover: 'https://picsum.photos/seed/yoga/400/400' },
    { id: '2', title: '定心：与呼吸同步', duration: '15:00', author: '王宁 导师', cover: 'https://picsum.photos/seed/breath/400/400', locked: true },
    { id: '3', title: '内观：情绪的流变', duration: '18:00', author: '王宁 导师', cover: 'https://picsum.photos/seed/mind/400/400', locked: true },
  ];

  return (
    <div className="h-full flex flex-col relative">
      <div className="h-[280px] relative">
        <img className="w-full h-full object-cover" src="https://picsum.photos/seed/yoga/800/600" alt="Course" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        <button onClick={() => onNavigate('explore')} className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
          <ChevronLeft size={24} />
        </button>
      </div>
      <div className="flex-1 px-6 pt-2 flex flex-col relative z-10 overflow-y-auto hide-scrollbar pb-24">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-[#E6E6FA] text-[#2A2D34] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">21天进阶</span>
          <span className="text-[#5D6979] text-xs">4.9分 (2.3k 评价)</span>
        </div>
        <h1 className="text-2xl font-bold text-[#2A2D34] mb-3">正念冥想：重塑内在秩序</h1>
        <p className="text-xs text-[#5D6979] leading-relaxed mb-6">本课程由资深冥想导师王宁设计，结合神经科学与心理学，通过21天的刻意练习，帮助你建立稳定的情绪内核。</p>
        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-semibold">课程大纲</h3>
          {chapters.map((chapter, idx) => (
            <div 
              key={chapter.id} 
              className={cn(
                "flex items-center justify-between p-3 rounded-xl border transition-all",
                chapter.locked ? "bg-white border-slate-100 opacity-60" : "bg-slate-50 border-slate-100 hover:border-[#89CFF0]/50 cursor-pointer"
              )}
              onClick={() => !chapter.locked && onPlay(chapter)}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-6 h-6 border-2 rounded-full flex items-center justify-center text-[10px] font-bold",
                  chapter.locked ? "border-slate-300 text-slate-400" : "border-[#89CFF0] text-[#2A2D34]"
                )}>
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </div>
                <div>
                  <span className="text-xs font-medium block">{chapter.title}</span>
                  {!chapter.locked && <span className="text-[10px] text-slate-400">{chapter.duration}</span>}
                </div>
              </div>
              {chapter.locked ? (
                <Lock size={16} className="text-slate-300" />
              ) : (
                <button 
                  className="w-8 h-8 bg-[#89CFF0]/10 rounded-full flex items-center justify-center text-[#89CFF0] hover:bg-[#89CFF0]/20 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay(chapter);
                  }}
                >
                  <Play size={14} fill="currentColor" />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-auto mb-10">
          <button className="w-full py-4 bg-[#2A2D34] text-white rounded-2xl font-semibold shadow-xl shadow-slate-200">立即开始 21天旅程</button>
        </div>
      </div>
    </div>
  );
};

const AchievementsView = ({ onNavigate }: { onNavigate: (id: PageId) => void }) => (
  <div className="h-full flex flex-col relative">
    <div className="h-[56px] px-6 flex items-center justify-between bg-white relative z-10">
      <button onClick={() => onNavigate('profile')}>
        <ChevronLeft size={20} />
      </button>
      <h1 className="text-[#2A2D34] font-medium">成长里程碑</h1>
      <Trophy size={20} className="text-amber-400" />
    </div>
    <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 relative z-10 hide-scrollbar pb-24">
      <div className="bg-gradient-to-br from-[#89CFF0] to-[#E6E6FA] p-6 rounded-[32px] text-white">
        <p className="text-xs opacity-70">当前等级</p>
        <h2 className="text-3xl font-bold mt-1">心灵行者</h2>
        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white w-3/4" />
          </div>
          <span className="text-[10px]">750 / 1000 EXP</span>
        </div>
      </div>
      
      <h3 className="text-sm font-bold flex items-center gap-2">
        <span className="w-1 h-4 bg-[#89CFF0] rounded-full" /> 进行中的挑战
      </h3>
      <div className="space-y-3">
        <div className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500"><Sun size={20} /></div>
            <div><p className="text-xs font-bold">7天早起冥想</p><p className="text-[10px] text-slate-400">已坚持 5 天</p></div>
          </div>
          <span className="text-xs font-bold text-[#89CFF0]">80%</span>
        </div>
      </div>

      <h3 className="text-sm font-bold flex items-center gap-2 mt-4">
        <span className="w-1 h-4 bg-[#FFD8B1] rounded-full" /> 荣誉勋章
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '初露锋芒', icon: Medal, color: 'text-yellow-500', active: true },
          { label: '百里挑一', icon: Trophy, color: 'text-slate-300', active: false },
          { label: '静心大师', icon: Moon, color: 'text-slate-300', active: false },
        ].map((m, i) => (
          <div key={i} className={cn("flex flex-col items-center gap-2", !m.active && "grayscale")}>
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-50 flex items-center justify-center">
              <m.icon size={32} className={m.color} />
            </div>
            <span className="text-[9px] text-slate-500">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  const navigate = (page: PageId) => {
    setCurrentPage(page);
  };

  const playSession = (session: Session) => {
    setCurrentSession(session);
    setCurrentPage('player');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomeView onNavigate={navigate} />;
      case 'mood-checkin': return <MoodCheckinView onNavigate={navigate} />;
      case 'breathing': return <BreathingView onNavigate={navigate} />;
      case 'stats': return <StatsView onNavigate={navigate} />;
      case 'diary': return <DiaryView onNavigate={navigate} />;
      case 'explore': return <ExploreView onNavigate={navigate} />;
      case 'healing': return <HealingView onNavigate={navigate} />;
      case 'profile': return <ProfileView onNavigate={navigate} />;
      case 'player': return <PlayerView onNavigate={navigate} session={currentSession} />;
      case 'settings': return <SettingsView onNavigate={navigate} />;
      case 'community': return <CommunityView onNavigate={navigate} />;
      case 'tree-hole': return <TreeHoleView onNavigate={navigate} />;
      case 'assessment': return <AssessmentView onNavigate={navigate} />;
      case 'course-detail': return <CourseDetailView onNavigate={navigate} onPlay={playSession} />;
      case 'achievements': return <AchievementsView onNavigate={navigate} />;
      default: return <HomeView onNavigate={navigate} />;
    }
  };

  // Determine if we should show the bottom navbar
  const showNavbar = ['home', 'explore', 'diary', 'healing', 'profile', 'community', 'stats'].includes(currentPage);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4 font-sans">
      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col">
        <AuroraBackground />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 relative z-10"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>

        {showNavbar && (
          <Navbar 
            activeTab={['home', 'explore', 'diary', 'healing', 'profile', 'community', 'stats'].includes(currentPage) ? currentPage : 'home'} 
            onTabChange={navigate} 
          />
        )}
      </div>
    </div>
  );
}
