import Axios, { AxiosError } from "axios"
import dotenv from "dotenv"

dotenv.config()

const axios = Axios.create({
    baseURL: process.env.API_BASE_URL,
})

export class CustomError extends Error {
    statusCode?: number

    constructor(message: string, statusCode?: number) {
        super(message)
        this.name = "CustomError"
        this.statusCode = statusCode
    }
}

axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Server responded with error status:", error.response.status)

            throw new CustomError("Server responded with an error.")
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received:", error.request)

            throw new CustomError("No response received from the server.")
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error setting up the request:", error.message)

            throw new CustomError("Error setting up the request.")
        }
    },
)

export default axios
