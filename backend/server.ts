import express, {Router} from 'express';
import {GoogleGenerativeAI, ResponseSchema, SchemaType} from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Constants
const port = process.env.PORT || 5173

// Create http server
const app = express()


const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const graphSchema: ResponseSchema = {
    type: SchemaType.OBJECT,
    description: "Graph representation of a career path",
    properties: {
        nodes: {
            type: SchemaType.ARRAY,
            description: "Individual steps or states needed along the career path",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    id: {
                        type: SchemaType.STRING,
                        description: "A unique identifier for this node",
                        nullable: false,
                    },
                    label: {
                        type: SchemaType.STRING,
                        description: "A short description of this state or step",
                        nullable: false,
                    },
                    desc: {
                        type: SchemaType.STRING,
                        description: "A long description of this state or step",
                        nullable: false,
                    },
                },
                required: ["id", "label", "desc"],
            },
            nullable: false,
        },
        edges: {
            type: SchemaType.ARRAY,
            description: "Connections between nodes that identify what next steps are available from a certain node",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    src: {
                        type: SchemaType.STRING,
                        description: "The ID of the starting node",
                        nullable: false,
                    },
                    dst: {
                        type: SchemaType.STRING,
                        description: "The ID of the ending node",
                        nullable: false,
                    },
                },
                required: ["src", "dst"],
            },
            nullable: false,
        },
    },
    required: ["nodes", "edges"],
};
const model = genai.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: graphSchema,
    },
});

const api = Router();
api.use("/graph", async (req, res) => {
    res.status(200)
        .type("application/json")
        .send((await model.generateContent("Outline the series of steps needed to go from a university student with no programming experience to a frontend developer, in graph format")).response.text());
})


app.use('/api', api);

// Start http server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})
