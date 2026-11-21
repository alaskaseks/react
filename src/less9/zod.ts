import { useState } from "react";
import type React from "react";
import type { z } from "zod";

function useZodForm<S extends z.ZodType, V extends Record<string, string>>(schema: S, initialValues: V){
    const [values, setValues] = useState<V>(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [result, setResult] = useState<z.output<S> | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setValues(prev => ({ ...prev, [name]: value }));
        setResult(null);

        setErrors(prev => {
            const next = { ...prev };
            delete next[name];
            return next;
        });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const parsed = schema.safeParse(values);

        if (!parsed.success) {
            const newErrors: Record<string, string> = {};
            parsed.error.issues.forEach(issue => {
                const field = String(issue.path[0]);
                if (!newErrors[field]) {
                    newErrors[field] = issue.message;
                }
            });
            setErrors(newErrors);
            setResult(null);
            return;
        }

        setErrors({});
        setResult(parsed.data);
    }

    return { values, errors, result, handleChange, handleSubmit };
}

export default useZodForm;
