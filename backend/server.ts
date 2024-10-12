import express, {Router} from 'express';
import {GoogleGenerativeAI, ResponseSchema, SchemaType} from "@google/generative-ai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Constants
const port = process.env.PORT || 5174

// Create http server
const app = express()

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const topicsListSchema: ResponseSchema = {
    type: SchemaType.ARRAY,
    description: "List of potential topics to learn to obtain a job in the field",
    items: {
        type: SchemaType.OBJECT,
        properties: {
            id: {
                type: SchemaType.STRING,
                description: "A UUIDv4 for this topic in code",
                nullable: false,
            },
            label: {
                type: SchemaType.STRING,
                description: "Name of the topic",
                nullable: false,
            },
            desc: {
                type: SchemaType.STRING,
                description: "Paragraph-style description of the main concepts related to this topic",
                nullable: false,
            },
            prerequisite: {
                // type: SchemaType.ARRAY,
                // description: "The UUIDv4s of the topics that must be learned before I can start learning this topic",
                // items: {
                    type: SchemaType.STRING,
                    description: "The UUIDv4 of the topic that I have to learn before I can start learning this topic",
                // },
                nullable: true,
            },
            // subtopics: {
            //     type: SchemaType.ARRAY,
            //     description: "Smaller concepts contained within this topic",
            //     items: {
            //         type: SchemaType.STRING,
            //         description: "The name of a subtopic",
            //         nullable: true,
            //     },
            //     nullable: true,
            // },
        },
        required: ["id", "label", "desc"],
        description: "Name of a topic to learn",
        nullable: false,
    },
};

/* const graphSchema: ResponseSchema = {
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
                        description: "A unique, abbreviated identifier for this node in code",
                        nullable: false,
                    },
                    label: {
                        type: SchemaType.STRING,
                        description: "A short description of this state",
                        nullable: false,
                    },
                    desc: {
                        type: SchemaType.STRING,
                        description: "A paragraph-style description of this state",
                        nullable: false,
                    },
                    root: {
                        type: SchemaType.BOOLEAN,
                        description: "Whether this node is the start",
                        nullable: false,
                    },
                },
                required: ["id", "label", "desc", "root"],
            },
            nullable: false,
        },
        edges: {
            type: SchemaType.ARRAY,
            description: "Connections between nodes that identify what next steps are available from a certain node and what to do to proceed",
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
                    desc: {
                        type: SchemaType.STRING,
                        description: "A paragraph-style description of what to do to proceed from the starting state to the ending state",
                        nullable: false,
                    },
                },
                required: ["src", "dst", "desc"],
            },
            nullable: false,
        },
    },
    required: ["nodes", "edges"],
}; */
const model = genai.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: topicsListSchema,
    },
});


const api = Router();
api.use("/topics", async (req, res) => {
    const field = req.query.field;
    
    // const output = await model.generateContent("Suggest steps to go from a university student with no programming experience to a frontend developer, in nonlinear graph format. Include a node for the initial state; all other nodes should begin from this state.");
    const output = await model.generateContent(`List a hierarchy of topics to learn in order to work in ${field}`);
    
    res.status(200)
        .type("application/json")
        .send(output.response.text());
})


app.use(cors());
app.use('/api', api);

// Start http server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})
