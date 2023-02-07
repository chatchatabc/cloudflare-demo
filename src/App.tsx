import React, {Fragment, useEffect, useState} from 'react'
import './App.css'
import {Password} from "./model/Password";
import {Notification} from "./Components/Notification";
import {
    PencilIcon, PlusCircleIcon,
    TrashIcon, GlobeAltIcon, SparklesIcon, ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import {createPortal} from "react-dom";
import {format} from "timeago.js"
import DialogPopup from "./Components/Dialog";
import {ModalType, PasswordDialog} from "./Components/PasswordDialog";
import {ViewPasswordDialog} from "./Components/ViewPasswordDialog";

enum AppState {
    LOADING, NONE, EDIT, CREATE, DELETE, VIEW
}

export default function App() {
    const [content, setContent] = useState<Password[]>([])

    const [appState, setAppState] = useState<AppState>(AppState.NONE)

    const [modalId, setModalId] = useState<string | undefined>(undefined)

    const [notifications, setNotifications] = useState<string[]>([])


    const refresh = () => {
        setAppState(AppState.LOADING)
        fetch('/api/password').then(res => {
            if (res.ok) {
                res.json<Password[]>().then(passwords => {
                    setContent(passwords)
                    setAppState(AppState.NONE)
                })
            } else {
                res.text().then(text => {
                    setAppState(AppState.NONE)
                    throw new Error(text)
                })
            }
        })
    }

    const tryDelete = async (id: string) => {
        await fetch(`/api/password/${id}`, {
            method: "DELETE"
        }).then(res => {
            if (res.ok) {
                setNotifications([...notifications, "Password deleted successfully."])
                refresh()
            } else {
                res.text().then(text => {
                    console.log(text)
                    throw new Error(text)
                })
            }
        })
    }

    useEffect(() => {
        refresh()
    }, [])

    console.log("Oh its reloading :skull:")

    return (
        <>
            <div className="min-h-full w-100">
                <div className="bg-gray-800 pb-[12rem]">
                    <nav className="bg-gray-800">
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            <div className="border-b border-gray-700">
                                <div className="flex h-16 items-center justify-between px-4 sm:px-0">
                                    <div className="flex items-center">
                                    </div>
                                    <div className="block">
                                        <div className="ml-4 flex items-center md:ml-6 gap-6">
                                            <p className="text-sm font-medium text-white">Cloudflare Features Demo</p>
                                            <a onClick={() => {
                                                    fetch("/api/user/logout", {method: "POST"})
                                                        .then(res => {
                                                            window.location.href = "/"
                                                        })
                                                }}
                                                className="bg-white text-gray-900 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">Logout</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <header className="py-10">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-row gap-5">
                            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                            <button
                                onClick={() => {
                                    setAppState(AppState.CREATE)
                                }}
                                className="bg-white text-gray-900 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium flex flex-row gap-2">
                                <PlusCircleIcon className="h-5 w-5 text-gray-900" aria-hidden="true"/>
                                Add Password
                            </button>
                        </div>
                    </header>
                </div>

                <main className="-mt-[13rem]">
                    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 flex flex-col gap-5">
                        <div
                            className="bg-red-100 border border-red-400 bg-red-900 text-white px-4 py-3 rounded flex flex-row items-center gap-4">
                            <ExclamationTriangleIcon
                                className="h-10 w-10 text-red-600 rounded-[200px] bg-red-100 p-2 aspect-square"
                                aria-hidden="true"/>
                            <div>
                                <strong className="font-bold">This is a demo! I cannot guarantee the security of this
                                    site.</strong>
                                <p>Please do not store your real passwords here.</p>
                            </div>
                        </div>
                        <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
                            <div
                                className={`overflow-hidden bg-white shadow sm:rounded-md ${appState === AppState.LOADING ? "visible" : "hidden"}`}>
                                <div
                                    className="w-full h-16 bg-gray-300 flex justify-center items-center text-gray-900 animate-pulse">
                                    Loading your passwords...
                                </div>
                                <ul role="list" className="divide-y divide-gray-200 animate-pulse-container">
                                    {[...Array(5)].map((_, i) => (
                                        <li>
                                            <a href="#" className="block hover:bg-gray-50">
                                                <div className="px-4 py-4 sm:px-6">
                                                    <div className="flex items-center justify-between">
                                                        <div
                                                            className="truncate h-5 text-sm bg-indigo-600 rounded-3xl w-[150px] animate-pulse"/>
                                                        <div className="ml-2 flex flex-shrink-0">
                                                            <div
                                                                className="inline-flex rounded-full bg-green-100 px-2 w-[100px] h-5 font-semibold leading-5 text-green-800 animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 sm:flex  sm:justify-between gap-3">
                                                        <div className="sm:flex gap-3">
                                                            <div
                                                                className="flex items-center text-sm text-gray-500 gap-2">
                                                                <div
                                                                    className="h-5 w-5 bg-gray-400 rounded-3xl animate-pulse"/>
                                                                <div
                                                                    className="h-5 w-[75px] bg-gray-400 rounded-3xl animate-pulse"/>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                            <div
                                                                className="flex items-center text-sm text-gray-500 gap-2">
                                                                <div
                                                                    className="h-5 w-5 bg-gray-400 rounded-3xl animate-pulse"/>
                                                                <div
                                                                    className="h-5 w-[75px] bg-gray-400 rounded-3xl animate-pulse"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div
                                className={`overflow-hidden bg-white shadow sm:rounded-md ${appState !== AppState.LOADING ? "visible" : "hidden"}`}>
                                <ul role="list" className="divide-y divide-gray-200 animate-pulse-container">
                                    {content.map((password, i) => (
                                        <li key={password.id}>
                                            <div className="hover:bg-gray-50">
                                                <div className="flex flex-row items-center">
                                                    <div className="px-4 py-4 sm:px-6 w-full">
                                                        <div className="">
                                                            <a onClick={() => {
                                                                setModalId(password.id)
                                                                setAppState(AppState.VIEW)
                                                            }}
                                                               className="truncate text-xl font-medium text-indigo-600">{password.description}</a>
                                                        </div>
                                                        <div className="mt-2">
                                                            <div className="flex sm:flex-row flex-col">
                                                                <p className="flex items-center text-sm text-gray-500">
                                                                    <GlobeAltIcon
                                                                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                                        aria-hidden="true"/>
                                                                    {password._for}
                                                                </p>
                                                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                                    <PlusCircleIcon
                                                                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                                        aria-hidden="true"/>
                                                                    {new Date(password.createdAt).toLocaleDateString()}
                                                                </p>
                                                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                                    <PencilIcon
                                                                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                                        aria-hidden="true"/>
                                                                    {format(new Date(password.updatedAt))}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ml-2 w-min pr-4 flex flex-column gap-3">
                                                        <button
                                                            onClick={() => {
                                                                setAppState(AppState.EDIT)
                                                                setModalId(password.id)
                                                            }}
                                                            className="p-3 rounded-3xl bg-gray-100 border-2 border-gray-300">
                                                            <PencilIcon className="h-5 w-5 text-gray-700"
                                                                        aria-hidden="true"/>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setAppState(AppState.DELETE)
                                                                setModalId(password.id)
                                                            }}
                                                            className="p-3 rounded-3xl bg-red-100 border-2 border-red-300">
                                                            <TrashIcon className="h-5 w-5 text-red-700"
                                                                       aria-hidden="true"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {content.length === 0 &&
                                    <button
                                        onClick={() => {
                                            setAppState(AppState.CREATE)
                                        }}
                                        type="button"
                                        className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        <SparklesIcon className="mx-auto h-16 h-16 text-yellow-400"
                                                      aria-hidden="true"/>

                                        <span className="mt-2 block text-lg font-medium text-gray-900">Add your first password entry!</span>
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {(appState === AppState.CREATE || appState === AppState.EDIT) &&
                createPortal(<PasswordDialog
                    type={appState === AppState.CREATE ? ModalType.CREATE : ModalType.EDIT}
                    onClose={() => {
                        setAppState(AppState.NONE)
                    }}
                    onSuccess={(message) => {
                        setAppState(AppState.NONE)
                        setNotifications([...notifications, message])
                        refresh()
                    }}
                    id={modalId}
                />, document.body)
            }
            {(appState === AppState.VIEW &&
                createPortal(<ViewPasswordDialog
                    onClose={() => {
                        setAppState(AppState.NONE)
                    }}
                    id={modalId}
                    onCopy={() => {
                        setNotifications([...notifications, "Copied to clipboard!"])
                    }}
                />, document.body))
            }
            {createPortal(
                <>
                    <div aria-live="assertive"
                         className="z-50 pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
                        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                            {notifications.map((notification, index) => (
                                <Notification message={notification}/>
                            ))}
                        </div>
                    </div>
                </>, document.body
            )}
            <DialogPopup isOpen={appState === AppState.DELETE}
                         title={"Delete Entry"}
                         message={"This will delete your password from the list. This change cannot be reverted. Are you sure you want to continue?"}
                         confirmText={"Yes, Delete"} cancelText={"No, Cancel."}
                         onConfirm={async () => {
                             if (modalId !== undefined) {
                                 await tryDelete(modalId)
                                 setAppState(AppState.NONE)
                                 refresh()
                             }
                         }}
                         onCancel={() => {
                             setAppState(AppState.NONE)
                             setModalId(undefined)
                         }}
            />
        </>
    )
}

