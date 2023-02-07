import React, {useEffect, useState} from "react";
import {Password} from "../model/Password";
import {ArrowPathIcon, ClipboardIcon, EyeIcon, EyeSlashIcon, XMarkIcon} from "@heroicons/react/24/outline";


export enum ModalType {
    EDIT, CREATE
}

interface PasswordDialogProps {
    id: string | undefined,
    onClose: () => void,
    onCopy: () => void,
}

export function ViewPasswordDialog(props: PasswordDialogProps) {
    const [data, setData]= useState<Password | undefined>(undefined)

    const [passwordShown, isPasswordShown] = useState(false)

    useEffect(() => {
        fetch("/api/password/" + props.id).then(response => {
            if (response.ok) {
                response.json<Password>().then(data => {
                    setData(data)
                })
            }
        })
    }, [])

    return (
        <div
            className="w-full h-full flex items-center justify-center absolute top-0 left-0 backdrop-blur-md bg-gray-800 bg-opacity-10 z-50 drop-shadow-2xl">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="flex flex-row fl">
                        <h1 className="text-2xl font-bold tracking-tight pb-4">Info</h1>
                        <div className="flex-1"></div>
                        <XMarkIcon onClick={
                            () => props.onClose()
                        } className="mx-auto h-8 w-8" aria-hidden="true"/>
                    </div>

                    <div>
                        <label htmlFor="desc" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <div className="mt-1">
                            <div className="mt-1">
                                <p className="block w-full appearance-none font-2xl px-3 py-2"
                                >{data?.description}</p>
                                <a href={data?._for} className="block w-full text-sm appearance-none px-3 pb-2"
                                >{data?._for}</a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username/Email
                        </label>
                        <div className="mt-1">
                            <div className="mt-1">
                                <p className="block w-full text-lg appearance-none px-3 py-2"
                                >{data?.username}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="mt-1">
                            <div className="mt-1 flex flex-row gap-4 items-center justify-center">
                                <p className="w-full text-lg appearance-none px-3 py-2"
                                >{passwordShown ? "******" : data?.password}</p>
                                {!passwordShown ? <EyeIcon onClick={() => isPasswordShown(!passwordShown)} className="h-8 w-8" aria-hidden="true"/>
                                    : <EyeSlashIcon onClick={() => isPasswordShown(!passwordShown)} className="h-8 w-8" aria-hidden="true"/>
                                }
                                <ClipboardIcon className="h-8 w-8" aria-hidden="true" onClick={() =>{
                                    navigator.clipboard.writeText(data?.password || "")
                                    props.onCopy()
                                }}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
