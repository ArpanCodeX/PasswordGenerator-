import React, { useRef, useState, useEffect } from 'react';
import { Copy, PackagePlus } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';

const MainGen = () => {

const passwordRef = useRef(null);
const [lengthOfPassword, setLengthOfPassword] = useState(12);
const [mode, setMode] = useState("all");
const [includeUppercase, setIncludeUppercase] = useState(true);
const [includeLowercase, setIncludeLowercase] = useState(true);
const [includeNumbers, setIncludeNumbers] = useState(true);
const [includeSymbols, setIncludeSymbols] = useState(true);

const noOptionSelected =
    !includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols;

const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerCase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@_#$%^&*()_+-=[]{}|?";

const getCharacterSet = () => {
    let charset = "";
    if (includeUppercase) charset += upperCase;
    if (includeLowercase) charset += lowerCase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;
    return charset || lowerCase;
};

const CreatePass = () => {
    if (noOptionSelected) {
    if (passwordRef.current)
        passwordRef.current.value = "⚠️ Select at least one option";
    return;
    }

    let password = "";
    const availableChars = getCharacterSet();

    if (includeUppercase) password += upperCase[Math.floor(Math.random() * upperCase.length)];
    if (includeLowercase) password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
    if (includeNumbers) password += numbers[Math.floor(Math.random() * numbers.length)];
    if (includeSymbols) password += symbols[Math.floor(Math.random() * symbols.length)];

    while (password.length < lengthOfPassword) {
    password += availableChars[Math.floor(Math.random() * availableChars.length)];
    }

    password = password.slice(0, lengthOfPassword);
    if (passwordRef.current) {
    passwordRef.current.value = password;
    }
};

const CopyPass = () => {
    if (noOptionSelected) {
        toast.error(" Please select at least one option to generate a password!",{ theme: "colored" });
        return;
    }

    if (passwordRef.current) {
        const value = passwordRef.current.value;
        try {
            navigator.clipboard.writeText(value);
            toast.success("Password copied to clipboard!", { theme: "colored" });
            // save to localStorage history
            try {
                const KEY = 'passwordGenerator.history';
                const raw = localStorage.getItem(KEY);
                const list = raw ? JSON.parse(raw) : [];
                const entry = { value, time: Date.now() };
                // prepend and keep last 10
                const updated = [entry, ...list].slice(0, 10);
                localStorage.setItem(KEY, JSON.stringify(updated));
                // notify other components in this window
                window.dispatchEvent(new CustomEvent('passwordCopied', { detail: entry }));
            } catch (e) {
                // ignore storage errors
                console.warn('Could not save password history', e);
            }
        } catch {
            toast.error('Could not copy password to clipboard');
        }
    }
};


useEffect(() => {
    const timer = setTimeout(() => {
    CreatePass();
    }, 30);
    return () => clearTimeout(timer);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [lengthOfPassword, includeUppercase, includeLowercase, includeNumbers, includeSymbols, mode]);

return (
    <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="bg-[#45d9d2] flex items-center justify-center px-4 py-8"
    >
    <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-md bg-white rounded-xl shadow-xl border-2 p-6"
    >
        <motion.h2
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-xl font-semibold text-center mb-4"
        >
        <span>Generate a </span>
        <span className="text-cyan-800">Random Password</span>
        </motion.h2>

        <motion.div
        whileHover={{ scale: 1.01 }}
        className="border-2 rounded-2xl flex items-center justify-between gap-2 p-2 mt-2"
        >
        <input
            ref={passwordRef}
            type="text"
            readOnly
            placeholder="Password"
            className="outline-none bg-transparent w-full"
        />
        <Copy
            onClick={() => { CopyPass() }}
            className="cursor-pointer hover:text-[#45d9d2] transition-colors duration-300"
        />
        </motion.div>

        <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-4 text-sm"
        >
        <label className="block mb-1 font-medium">
            Password Length: {lengthOfPassword}
        </label>
        <input
            type="range"
            min="4"
            max="32"
            value={lengthOfPassword}
            onChange={(e) => setLengthOfPassword(Number(e.target.value))}
            className="w-full cursor-pointer accent-cyan-800"
        />
        </motion.div>

        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-4 grid grid-cols-2 gap-4 text-sm"
        >
        <div className="mt-4 space-y-2 text-sm">
            <motion.label
            className="flex items-center gap-2 cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            >
            <input
                className='font-semibold'
                type="checkbox"
                name="mode"
                value="all"
                checked={
                includeUppercase &&
                includeLowercase &&
                includeNumbers &&
                includeSymbols
                }
                onChange={() => {
                const allEnabled =
                    includeUppercase &&
                    includeLowercase &&
                    includeNumbers &&
                    includeSymbols;
                if (allEnabled) {
                    setIncludeUppercase(false);
                    setIncludeLowercase(false);
                    setIncludeNumbers(false);
                    setIncludeSymbols(false);
                    setMode("");
                } else {
                    setIncludeUppercase(true);
                    setIncludeLowercase(true);
                    setIncludeNumbers(true);
                    setIncludeSymbols(true);
                    setMode("all");
                }
                }}
            />
            All characters
            </motion.label>

            {[
            { label: "Uppercase", state: includeUppercase, setState: setIncludeUppercase },
            { label: "Lowercase", state: includeLowercase, setState: setIncludeLowercase },
            { label: "Numbers", state: includeNumbers, setState: setIncludeNumbers },
            { label: "Symbols", state: includeSymbols, setState: setIncludeSymbols }
            ].map((item, index) => (
            <motion.label
                key={item.label}
                className="flex items-center gap-2 cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
            >
                <input
                type="checkbox"
                checked={item.state}
                onChange={() => item.setState(!item.state)}
                />
                {item.label}
            </motion.label>
            ))}
        </div>
        </motion.div>
        <ToastContainer />

        <motion.button
        onClick={CreatePass}
        disabled={noOptionSelected}
        whileTap={{ scale: 0.95 }}
        whileHover={!noOptionSelected ? { scale: 1.03 } : {}}
        className={`w-full mt-4 flex items-center justify-center gap-2 border rounded-3xl p-2
            ${noOptionSelected
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#45d9d2] text-grey-200 hover:bg-cyan-500 hover:text-white'}
            transition-colors duration-300 active:bg-white active:text-neutral-700 active:outline-none outline-none`
        }
        >
        <PackagePlus /> Generate Password
        </motion.button>
    </motion.div>
    </motion.div>
    
);
};

export default MainGen;
