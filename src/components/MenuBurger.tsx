'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import {
  Button,
  Header,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  Section,
  Separator,
} from 'react-aria-components'
import {
  Menu as MenuIcon,
  X,
  LogOut,
  LogIn,
  LayoutDashboard,
  Home,
  Settings,
} from 'lucide-react'

interface MenuBurgerProps {
  isLoggedIn: boolean
  userEmail?: string | null
}

export default function MenuBurger({ isLoggedIn, userEmail }: MenuBurgerProps) {
  return (
    <MenuTrigger>
      {/* Trigger Button */}
      <Button
        aria-label="Open Navigation Menu"
        className="group flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-200 backdrop-blur-md transition hover:border-slate-700 hover:bg-slate-800 focus:outline-none data-[focused]:ring-2 data-[focused]:ring-indigo-500 cursor-pointer"
      >
        {({ isOpen }) =>
          isOpen ? <X size={20} className="text-white" /> : <MenuIcon size={20} className="text-white" />
        }
      </Button>

      {/* Slide-out / Dropdown Popover */}
      <Popover
        placement="bottom end"
        offset={12}
        className="w-64 rounded-2xl border border-slate-800/90 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-xl entering:animate-in entering:fade-in-0 entering:zoom-in-95 leaving:animate-out leaving:fade-out-0 leaving:zoom-in-95"
      >
        <Menu className="outline-none space-y-1">
          {/* User Email Section using RAC Header */}
          {isLoggedIn && userEmail && (
            <Section className="border-b border-slate-800/80 pb-1 mb-1">
              <Header className="px-3 py-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Signed in as
                </p>
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {userEmail}
                </p>
              </Header>
            </Section>
          )}

          {/* Navigation Items */}
          <MenuItem href="/" className="group outline-none cursor-pointer rounded-xl">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 rounded-xl group-data-[focused]:bg-slate-900 group-data-[focused]:text-white transition"
            >
              <Home size={16} className="text-slate-400 group-data-[focused]:text-indigo-400" />
              <span>Home</span>
            </Link>
          </MenuItem>

          {isLoggedIn && (
            <MenuItem href="/dashboard" className="group outline-none cursor-pointer rounded-xl">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 rounded-xl group-data-[focused]:bg-slate-900 group-data-[focused]:text-white transition"
              >
                <LayoutDashboard size={16} className="text-slate-400 group-data-[focused]:text-indigo-400" />
                <span>Dashboard</span>
              </Link>
            </MenuItem>
          )}

          {isLoggedIn && (
            <MenuItem href="/settings" className="group outline-none cursor-pointer rounded-xl">
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 rounded-xl group-data-[focused]:bg-slate-900 group-data-[focused]:text-white transition"
              >
                <Settings size={16} className="text-slate-400 group-data-[focused]:text-indigo-400" />
                <span>Settings</span>
              </Link>
            </MenuItem>
          )}

          <Separator className="my-1 h-[1px] bg-slate-800/80" />

          {/* Dynamic Auth Action Item */}
          {isLoggedIn ? (
            <MenuItem
              onAction={() => signOut({ callbackUrl: '/' })}
              className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-rose-400 rounded-xl cursor-pointer group-data-[focused]:bg-rose-950/40 group-data-[focused]:text-rose-300 transition outline-none"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </MenuItem>
          ) : (
            <MenuItem href="/api/auth/signin" className="group outline-none cursor-pointer rounded-xl">
              <Link
                href="/api/auth/signin"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-emerald-400 rounded-xl group-data-[focused]:bg-emerald-950/40 group-data-[focused]:text-emerald-300 transition"
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </Link>
            </MenuItem>
          )}
        </Menu>
      </Popover>
    </MenuTrigger>
  )
}