export interface IEmail {
    subject:'SIGNUP' | 'FORGOTPASSWORD',
    token:string,
}

export interface IMailOptions {
    to?:string,
    from:string,
    html?:string,
    subject?:string,
}