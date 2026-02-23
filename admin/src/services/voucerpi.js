import { 
    Zap, CheckCircle2, DollarSign, TrendingUp, 
    Calendar, Timer, Star 
  } from 'lucide-react';
  
  export const STATS_DATA = [
    { id: 1, label: 'Active Offers', value: '12', icon: Zap, color: 'text-[#10b77f]' },
    { id: 2, label: 'Vouchers Redeemed', value: '1,248', icon: CheckCircle2, color: 'text-[#3b82f6]' },
    { id: 3, label: 'Total Revenue Saved', value: '$3,420', icon: DollarSign, color: 'text-[#10b77f]' },
    { id: 4, label: 'Avg. Redemption Rate', value: '14.2%', icon: TrendingUp, color: 'text-[#3b82f6]' },
  ];
  
  export const VENUE_OFFERS = [
    {
      id: 1,
      title: '20% Off Mondays',
      desc: 'Valid every Monday between 5:00 PM - 7:00 PM',
      tag: 'Timed Promotion',
      tagColor: 'text-[#10b77f] bg-[#10b77f]/10',
      icon: Calendar,
      iconBg: 'bg-[#10b77f]/10 text-[#10b77f]',
    },
    {
      id: 2,
      title: 'Happy Hour Slots',
      desc: 'Flat $10 discount on late night weekday bookings',
      tag: 'Limited Time',
      tagColor: 'text-orange-600 bg-orange-100',
      icon: Timer,
      iconBg: 'bg-orange-100 text-orange-600',
    },
    {
      id: 3,
      title: 'Weekend Special',
      desc: 'Extra 15% off for groups larger than 10 players',
      tag: 'Recurring',
      tagColor: 'text-purple-600 bg-purple-100',
      icon: Star,
      iconBg: 'bg-purple-100 text-purple-600',
    },
  ];
  
  export const NORMAL_VOUCHERS = [
    { id: 'TRF-7729-XC', type: 'TRUSTED', percent: '15%', desc: 'Standard loyalty reward', date: 'Oct 12, 2023', statusColor: 'bg-[#10b77f]/10 text-[#10b77f]' },
    { id: 'TRF-1102-AQ', type: 'NORMAL', percent: '5%', desc: 'New user first booking', date: 'Oct 10, 2023', statusColor: 'bg-slate-100 text-slate-500' },
    { id: 'TRF-8891-PL', type: 'ABUSER', percent: '0%', desc: 'Blocked - Suspicious activity', date: 'Oct 08, 2023', statusColor: 'bg-red-100 text-red-600' },
  ];
  
  export const SPECIAL_VOUCHERS = [
    { code: 'SUMMER2024', usage: '500 / 1000', expiry: 'Aug 31, 2024', segment: 'All Customers', status: 'Active', statusColor: 'text-green-600' },
    { code: 'VIPEXCLU', usage: '12 / 50', expiry: 'Dec 31, 2023', segment: 'Tier 3 VIPs', status: 'Active', statusColor: 'text-green-600' },
    { code: 'WINBACK50', usage: '100 / 100', expiry: 'Expired', segment: 'Churned Users', status: 'Closed', statusColor: 'text-slate-400' },
  ];