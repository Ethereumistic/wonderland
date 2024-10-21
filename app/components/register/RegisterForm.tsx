"use client";
import React, { useState, useEffect } from "react"; // Import useEffect
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null); // State to hold the token

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const tokenFromUrl = query.get('token'); // Get the token from the URL
    setToken(tokenFromUrl); // Set the token in state
  }, []); // Run once on component mount

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, token }), // Include the token
      });
      if (res.ok) {
        router.push('/login');
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Добре дошли в Wonderland
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Регистрация в Wonderland
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">Име</Label>
            <Input id="firstname" name="firstName" placeholder="Георги" type="text" value={formData.firstName} onChange={handleChange} required />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Фамилия</Label>
            <Input id="lastname" name="lastName" placeholder="Иванов" type="text" value={formData.lastName} onChange={handleChange} required />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Имейл адрес</Label>
          <Input id="email" name="email" placeholder="georgi.ivanov@abv.bg" type="email" value={formData.email} onChange={handleChange} required />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Парола</Label>
          <Input id="password" name="password" placeholder="••••••••" type="password" value={formData.password} onChange={handleChange} required />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
          type="submit"
        >
          Регистрация &rarr;
          <BottomGradient />
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
