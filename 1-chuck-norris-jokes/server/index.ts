import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import axios, { CustomError } from './lib/axios';

// For `.env.` file
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('This is the Chuck Norris Jokes server.');
});

async function getCategories(): Promise<string[]> {
    const response = await axios.get('/jokes/categories')

    return response.data
}

// Get all categories
app.get('/categories', async (req: Request, res: Response) => {
    try {
        res.json({
            categories: await getCategories()
        })
    } catch (error) {
        if (error instanceof CustomError) {
            console.error('Custom error occurred:', error.message);

            res.status(error.statusCode || 500).json({
                message: error.message,
            })
        } else {
            console.error('Unexpected error occurred:', error);
        }
    }
});

// Get random joke / random joke by category
app.get('/jokes/random', async (req: Request, res: Response) => {
    try {
        const params = req.query

        // Get list of valid categories
        const categories = await getCategories()

        // If there is a query param
        // If the `category` key is nonexistent or it's not a valid category
        if (Object.keys(params).length !== 0 && (!params.category || !categories.includes(params.category as string))) {
            res.status(422).json({
                message: `Invalid category. Valid categories: ${categories.join(', ')}`
            })
        }

        const response = await axios.get('/jokes/random', { params })

        res.json(response.data)
    } catch (error) {
        if (error instanceof CustomError) {
            console.error('Custom error occurred:', error.message);

            res.status(error.statusCode || 500).json({
                message: error.message,
            })
        } else {
            console.error('Unexpected error occurred:', error);
        }
    }
});

// List of jokes by free text
app.get('/jokes/search', async (req: Request, res: Response) => {
    try {
        const params = req.query

        // If there is a query param
        // If the `search` key is empty
        if (Object.keys(params).length !== 0 && !params.query) {
            res.status(422).json({
                message: `Invalid search query.`
            })
        }

        const response = await axios.get('/jokes/search', { params })

        res.json(response.data)
    } catch (error) {
        if (error instanceof CustomError) {
            console.error('Custom error occurred:', error.message);

            res.status(error.statusCode || 500).json({
                message: error.message,
            })
        } else {
            console.error('Unexpected error occurred:', error);
        }
    }
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});