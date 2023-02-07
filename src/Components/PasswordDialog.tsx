import React, {useEffect, useState} from "react";
import {Password} from "../model/Password";
import {ArrowPathIcon, XMarkIcon} from "@heroicons/react/24/outline";


export enum ModalType {
    EDIT, CREATE
}

interface PasswordDialogProps {
    type: ModalType,
    id: string | undefined,
    onClose: () => void,
    onSuccess: (message: string) => void,
}

export function PasswordDialog(props: PasswordDialogProps) {

    const [error, setError] = useState<string | undefined>(undefined)
    const [submitting, isSubmitting] = useState(false)

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [_for, setFor] = useState("")
    const [description, setDescription] = useState("")

    useEffect(() => {
        if (props.type === ModalType.EDIT) {
            fetch("/api/password/" + props.id).then(response => {
                if (response.ok) {
                    response.json<Password>().then(data => {
                        setUsername(data.username)
                        setPassword(data.password)
                        setFor(data._for)
                        setDescription(data.description)
                    })
                }
            })
        }
    }, [])

    const trySaving = () => {
        if (submitting) return
        setError(undefined)
        if (props.type === ModalType.CREATE) {
            fetch("/api/password/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    _for: _for,
                    description: description
                })
            }).then(response => {
                if (response.ok) {
                    props.onSuccess("Password created successfully!")
                } else {
                    setError("Failed to save password. Please try again.")
                }
            })
        } else if (props.type === ModalType.EDIT) {
            fetch("/api/password/" + props.id, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    _for: _for,
                    description: description
                })
            }).then(response => {
                if (response.ok) {
                    props.onSuccess("Password edited successfully!")
                } else {
                    setError("Failed to save password. Please try again.")
                }
            })
        }
    }

    return (
        <div
            className="w-full h-full flex items-center justify-center absolute top-0 left-0 backdrop-blur-md bg-gray-800 bg-opacity-10 z-50 drop-shadow-2xl">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="flex flex-row fl">
                        <h1 className="text-2xl font-bold tracking-tight pb-4">{props.type === ModalType.CREATE ? "Create Password Entry" : "Edit Password"}</h1>
                        <div className="flex-1"></div>
                        <XMarkIcon onClick={
                            () => props.onClose()
                        } className="mx-auto h-8 w-8" aria-hidden="true"/>
                    </div>
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <label htmlFor="site" className="block text-sm font-medium text-gray-700">
                                Site
                            </label>
                            <div className="mt-1">
                                <input
                                    readOnly={submitting}
                                    onChange={(e) => {
                                        setFor(e.target.value)
                                    }}
                                    value={_for}
                                    id="site"
                                    name="site"
                                    type="site"
                                    autoComplete="url"
                                    required
                                    className="read-only:opacity-70 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="desc" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <div className="mt-1">
                                <input
                                    readOnly={submitting}
                                    onChange={(e) => {
                                        setDescription(e.target.value)
                                    }}
                                    value={description}
                                    id="desc"
                                    name="desc"
                                    type="desc"
                                    className="read-only:opacity-70 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username/Email
                            </label>
                            <div className="mt-1">
                                <input
                                    readOnly={submitting}
                                    onChange={(e) => {
                                        setUsername(e.target.value)
                                    }}
                                    value={username}
                                    id="username"
                                    name="username"
                                    type="username"
                                    required
                                    className="read-only:opacity-70 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    readOnly={submitting}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                    }}
                                    value={password}
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="read-only:opacity-70 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="w-full flex flex-row gap-4">
                            <button
                                type="button"
                                disabled={submitting}
                                className="flex w-1/2 justify-center rounded-md border border-indigo-600 bg-white py-2 px-4 text-sm font-medium text-indigo-600 shadow-sm focus:outline-none hover:ring-2 hover:ring-offset-2"
                                onClick={() => {
                                    props.onClose()
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={(e) => {
                                    // e.preventDefault()
                                    trySaving()
                                }}
                                type="button"
                                className="items-center read-only:opacity-70 flex w-1/2 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                disabled={submitting}
                            >
                                {submitting ? <ArrowPathIcon className="h-4 w-4 animate-spin"/> : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
