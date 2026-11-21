import type React from "react"
import useZodForm from "./zod";
import { developerSchema, languages, loginSchema, ratingSchema, signUpSchema } from "./form";

const buttonClass = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
const inputClass = "border-2 border-black px-2 py-1 w-full";

interface SectionProps{
    title: string;
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
    return(
        <section className="mb-8">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            {children}
        </section>
    )
}

const LoginForm: React.FC = () => {
    const { values, errors, result, handleChange, handleSubmit } = useZodForm(loginSchema, { email: "", password: "" });

    return(
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm">
            <input name="email" placeholder="Email" className={inputClass} value={values.email} onChange={handleChange} />
            {errors.email && <p className="text-red-900">{errors.email}</p>}

            <input name="password" type="password" placeholder="Password" className={inputClass} value={values.password} onChange={handleChange} />
            {errors.password && <p className="text-red-900">{errors.password}</p>}

            <button type="submit" className={buttonClass}>Login</button>
            {result && <p className="text-green-700">Logged in: {result.email}</p>}
        </form>
    )
}

const SignUpForm: React.FC = () => {
    const { values, errors, result, handleChange, handleSubmit } = useZodForm(signUpSchema, {
        username: "", email: "", password: "", confirmPassword: ""
    });

    return(
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm">
            <input name="username" placeholder="Username" className={inputClass} value={values.username} onChange={handleChange} />
            {errors.username && <p className="text-red-900">{errors.username}</p>}

            <input name="email" placeholder="Email" className={inputClass} value={values.email} onChange={handleChange} />
            {errors.email && <p className="text-red-900">{errors.email}</p>}

            <input name="password" type="password" placeholder="Password" className={inputClass} value={values.password} onChange={handleChange} />
            {errors.password && <p className="text-red-900">{errors.password}</p>}

            <input name="confirmPassword" type="password" placeholder="Confirm password" className={inputClass} value={values.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <p className="text-red-900">{errors.confirmPassword}</p>}

            <button type="submit" className={buttonClass}>Sign up</button>
            {result && <p className="text-green-700">Registered: {result.username}</p>}
        </form>
    )
}

const DeveloperForm: React.FC = () => {
    const { values, errors, result, handleChange, handleSubmit } = useZodForm(developerSchema, { name: "", age: "", language: "" });

    return(
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm">
            <input name="name" placeholder="Name" className={inputClass} value={values.name} onChange={handleChange} />
            {errors.name && <p className="text-red-900">{errors.name}</p>}

            <input name="age" placeholder="Age (18-65)" className={inputClass} value={values.age} onChange={handleChange} />
            {errors.age && <p className="text-red-900">{errors.age}</p>}

            <select name="language" className={inputClass} value={values.language} onChange={handleChange}>
                <option value="">Select language</option>
                {languages.map(language => <option key={language} value={language}>{language}</option>)}
            </select>
            {errors.language && <p className="text-red-900">{errors.language}</p>}

            <button type="submit" className={buttonClass}>Save profile</button>
            {result && (
                <p className="text-green-700">
                    {result.name}, {result.language}, age: {result.age} (type: {typeof result.age})
                </p>
            )}
        </form>
    )
}

const RatingForm: React.FC = () => {
    const { values, errors, result, handleChange, handleSubmit } = useZodForm(ratingSchema, { rating: "", comment: "" });

    return(
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm">
            <select name="rating" className={inputClass} value={values.rating} onChange={handleChange}>
                <option value="">Select rating</option>
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            {errors.rating && <p className="text-red-900">{errors.rating}</p>}

            <textarea name="comment" rows={3} placeholder="Comment (optional)" className={inputClass} value={values.comment} onChange={handleChange} />
            {errors.comment && <p className="text-red-900">{errors.comment}</p>}

            <button type="submit" className={buttonClass}>Send</button>
            {result && <p className="text-green-700">Rating: {result.rating}, comment: {result.comment || "no comment"}</p>}
        </form>
    )
}

const ZodTasksPage: React.FC = () => {
    return(
        <div className="max-w-xl mx-auto p-4">
            <p className="mb-6 text-gray-600">5. In every form the error of a field disappears as soon as you start typing in it.</p>
            <Section title="1. Login form"><LoginForm /></Section>
            <Section title="2. Registration form"><SignUpForm /></Section>
            <Section title="3-4. Developer profile (enum, coerce age 18-65)"><DeveloperForm /></Section>
            <Section title="6. Rating form (optional comment)"><RatingForm /></Section>
        </div>
    )
}

export default ZodTasksPage
