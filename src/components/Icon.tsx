import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, BatteryCharging, BookOpen, Calendar, CalendarCheck, CalendarDays,
  Car, Check, ChevronDown, ChevronRight, CircleDot, ClipboardCheck, ClipboardCopy, Clock, Cog, Cpu, Disc, Droplet,
  Droplets, ExternalLink, Flame, Fuel, Gauge, Home, Info, KeyRound, Leaf, Lightbulb, MapPinned, Menu, MessageSquareText,
  Plus, RotateCcw, Route, Search, ShieldAlert, Snowflake, Sparkles, Stethoscope, Sun, SunMedium, Thermometer, Trash2,
  TrendingDown, Volume2, Wind, Wrench, X, Zap, Bell, type LucideIcon,
} from 'lucide-react'

const MAP: Record<string, LucideIcon> = {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, BatteryCharging, BookOpen, Calendar, CalendarCheck, CalendarDays,
  Car, Check, ChevronDown, ChevronRight, CircleDot, ClipboardCheck, ClipboardCopy, Clock, Cog, Cpu, Disc, Droplet,
  Droplets, ExternalLink, Flame, Fuel, Gauge, Home, Info, KeyRound, Leaf, Lightbulb, MapPinned, Menu, MessageSquareText,
  Plus, RotateCcw, Route, Search, ShieldAlert, Snowflake, Sparkles, Stethoscope, Sun, SunMedium, Thermometer, Trash2,
  TrendingDown, Volume2, Wind, Wrench, X, Zap, Bell,
}

export function Icon({ name, className, size = 20, strokeWidth = 2 }: { name: string; className?: string; size?: number; strokeWidth?: number }) {
  const C = MAP[name] ?? CircleDot
  return <C className={className} size={size} strokeWidth={strokeWidth} aria-hidden="true" />
}
