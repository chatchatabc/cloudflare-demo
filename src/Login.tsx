import {useState} from "react";

async function tryLogin(email: string, password: string): Promise<Response> {
    return fetch("/api/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
}

function tryRegister(email: string, password: string): Promise<Response> {
    return fetch("/api/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
}

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [result, setResult] = useState<{ ok: boolean, message: string } | undefined>(undefined);

    return (
        <div className="w-[100vw] h-[100vh] flex-row flex">
            <div className="Login w-1/3 min-w-fit">
                <div className="Login flex min-h-full bg-white bg-opacity-90 items-center justify-center">
                    <div
                        className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                        <div className="mx-auto w-full max-w-sm lg:w-96">
                            <div>
                                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Sign in to your
                                    account</h2>
                            </div>

                            <div className="mt-8">
                                {result &&
                                    <div
                                        className={`rounded-l border-2 border-${result.ok ? "green" : "red"}-400 bg-${result.ok ? "green" : "red"}-100 p-5`}>
                                        <p> {result.message} </p>
                                    </div>
                                }

                                {/*{ result != "" &&*/}
                                {/*    <div className="rounded-l border-2 border-red-400 bg-red-100 p-5">*/}
                                {/*    <p> { result } </p>*/}
                                {/*    </div>*/}
                                {/*}*/}
                                <div className="mt-6">
                                    <form method="POST" className="space-y-6">
                                        <div>
                                            <label htmlFor="email"
                                                   className="block text-sm font-medium text-gray-700">Email
                                                address</label>
                                            <div className="mt-1">
                                                <input id="email" name="email" type="email" autoComplete="email"
                                                       required value={email} onChange={(e) => setEmail(e.target.value)}
                                                       className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label htmlFor="password"
                                                   className="block text-sm font-medium text-gray-700">Password</label>
                                            <div className="mt-1">
                                                <input id="password" name="password" type="password"
                                                       autoComplete="current-password" required value={password}
                                                       onChange={(e) => setPassword(e.target.value)}
                                                       className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                                            </div>
                                        </div>


                                        <div className="flex items-center justify-between">

                                            {/*<div className="text-sm">*/}
                                            {/*    <a href="#"*/}
                                            {/*       className="font-medium text-indigo-600 hover:text-indigo-500">Forgot*/}
                                            {/*        password?</a>*/}
                                            {/*</div>*/}
                                        </div>

                                        <div className="flex flex-row gap-x-5">
                                            <button type="button"
                                                    className="flex w-1/2 justify-center rounded-md border border-indigo-600 bg-white py-2 px-4 text-sm font-medium text-indigo-600 shadow-sm focus:outline-none hover:ring-2 hover:ring-offset-2"
                                                    onClick={() => {
                                                        setResult(undefined)
                                                        tryRegister(email, password).then(
                                                            (response) => {
                                                                response.text().then((text) => {
                                                                        setResult({
                                                                            ok: response.ok,
                                                                            message: text
                                                                        });
                                                                    }
                                                                )
                                                            }
                                                        )
                                                    }}>
                                                Register
                                            </button>
                                            <button type="button"
                                                    className="flex w-1/2 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                    onClick={() => {
                                                        setResult(undefined)
                                                        tryLogin(email, password).then(
                                                            (response) => {
                                                                response.text().then((text) => {
                                                                        setResult({
                                                                            ok: response.ok,
                                                                            message: text
                                                                        });
                                                                    }
                                                                )
                                                                window.location.href = "/"
                                                            }
                                                        )
                                                    }}>
                                                Sign in
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="relative hidden w-0 flex-1 lg:block">
                            <img className="absolute inset-0 h-full w-full object-cover"
                                 src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
                                 alt=""/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-full xs:hidden sm:visible absolute -z-40 bg-cover" style={{
                background: 'url("https://images.unsplash.com/photo-1604076913837-52ab5629fba9?ixlib=rb-4.0.3&dl=mymind-tZCrFpSNiIQ-unsplash.jpg&w=1920&q=80&fm=jpg&crop=entropy&cs=tinysrgb")',
                backgroundSize: 'cover',
            }}>
            </div>
        </div>);
}

export default Login;