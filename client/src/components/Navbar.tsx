import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between p-4 bg-white shadow-xl shadow-green-200 rounded-b-4xl">

      <Link to="/" className="text-2xl font-bold flex items-center gap-2">
        <img alt="Logo" src="/logo.svg" width={40} height={40} />
        AgriSense
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex text-lg font-medium items-center w-lg justify-between">
        <div className="flex gap-6">
          <Link to="/" className="hover:text-gray-600">
            Home
          </Link>
          <Link to="/about" className="hover:text-gray-600">
            About
          </Link>
          <Link to="/dashboard" className="hover:text-gray-600">
            Dashboard
          </Link>
        </div>
        <div className="flex items-center">
          <SignedOut>
            <Button className="bg-black"><SignInButton /></Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="flex md:hidden items-center gap-2">
        <Sheet>
          <SheetTrigger className="md:hidden flex gap-4 items-center">
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-white border-0">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-4 text-lg px-5">
              <Link to="/" className="hover:text-gray-600">
                Home
              </Link>
              <Link to="/about" className="hover:text-gray-600">
                About
              </Link>
              <Link to="/dashboard" className="hover:text-gray-600">
                Dashboard
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center">
          <SignedOut>
            <Button className="bg-black"><SignInButton /></Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}