"use client";

import { Listbox } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import Field from "./Field";

export default function CustomSelect({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-left flex justify-between items-center focus:outline-none focus:border-[#C6A75E] transition-all">
            <span>{value ? options.find((o) => o.value === value)?.label : "Select"}</span>
            <FaChevronDown className="text-[#C6A75E]" />
          </Listbox.Button>
          <Listbox.Options className="absolute mt-2 w-full bg-[#18181C] border border-white/10 rounded-xl shadow-lg max-h-60 overflow-auto z-10">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active, selected }) =>
                  `cursor-pointer select-none p-3 ${active ? "bg-[#C6A75E]/20 text-[#C6A75E]" : "text-white"} ${selected ? "font-medium" : "font-normal"}`
                }
              >
                {option.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </Field>
  );
}