"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon, TicketIcon, UserGroupIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
};

type HeaderMenuDropdown = {
  label: string;
  icon?: React.ReactNode;
  items: HeaderMenuLink[];
};

export const menuLinks: (HeaderMenuLink | HeaderMenuDropdown)[] = [
  {
    label: "Events",
    icon: <CalendarDaysIcon className="h-4 w-4" />,
    items: [
      {
        label: "Explore Events",
        href: "/events/explore",
        icon: <CalendarDaysIcon className="h-4 w-4" />,
        description: "Discover amazing events near you",
      },
      {
        label: "Create Event",
        href: "/events/create",
        icon: <CalendarDaysIcon className="h-4 w-4" />,
        description: "Host your own event on EventChain",
      },
      {
        label: "My Events",
        href: "/events/my-events",
        icon: <UserGroupIcon className="h-4 w-4" />,
        description: "Manage your created events",
      },
    ],
  },
  {
    label: "Tickets",
    icon: <TicketIcon className="h-4 w-4" />,
    items: [
      {
        label: "My Tickets",
        href: "/tickets/my-tickets",
        icon: <TicketIcon className="h-4 w-4" />,
        description: "View your purchased tickets",
      },
      {
        label: "Verify Ticket",
        href: "/tickets/verify",
        icon: <ShieldCheckIcon className="h-4 w-4" />,
        description: "Verify ticket authenticity with ZK proofs",
      },
    ],
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <UserGroupIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  const isDropdown = (item: HeaderMenuLink | HeaderMenuDropdown): item is HeaderMenuDropdown => {
    return "items" in item;
  };

  return (
    <>
      {menuLinks.map((menuItem) => {
        if (isDropdown(menuItem)) {
          return <HeaderDropdown key={menuItem.label} menuItem={menuItem} pathname={pathname} />;
        } else {
          return (
            <li key={menuItem.href}>
              <Link
                href={menuItem.href}
                passHref
                className={`${
                  pathname === menuItem.href ? "bg-secondary shadow-md text-white" : ""
                } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col transition-all duration-200`}
              >
                {menuItem.icon}
                <span>{menuItem.label}</span>
              </Link>
            </li>
          );
        }
      })}
    </>
  );
};

const HeaderDropdown = ({
  menuItem,
  pathname,
}: {
  menuItem: HeaderMenuDropdown;
  pathname: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  useOutsideClick(dropdownRef, closeDropdown);

  const isActive = menuItem.items.some(item => pathname === item.href);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`${
          isActive ? "bg-secondary shadow-md text-white" : ""
        } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col transition-all duration-200`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {menuItem.icon}
        <span>{menuItem.label}</span>
        <ChevronDownIcon className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-base-100 border border-base-300 rounded-lg shadow-xl z-50 overflow-hidden">
          {menuItem.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${
                pathname === item.href ? "bg-secondary text-white" : "hover:bg-base-200"
              } block px-4 py-3 transition-colors duration-200`}
              onClick={closeDropdown}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <div>
                  <div className="font-medium">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-base-content/60 mt-1">{item.description}</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100/80 backdrop-blur-md border-b border-base-300/50 min-h-0 flex-shrink-0 justify-between z-20 shadow-sm px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen((prevIsOpenState) => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 border border-base-300"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg"></div>
            <div className="relative flex items-center justify-center w-full h-full text-white font-bold text-lg">
              EC
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EventChain
            </span>
            <span className="text-xs text-base-content/60 leading-tight">Web3 Events</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
