import bcrypt from 'bcrypt'

import {NextApiRequest, NextApiResponse} from "next";

import clientPromise from "../../lib/mongodb";

export interface RequestBody {
    email: string,
    password: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Password or email is missing from request.' });
    }

    const body = req.body as RequestBody;
    const db = (await clientPromise).db();
    const users = db.collection("users");
    const user = await users.findOne({email: body.email}); // Returns WithId<Document> | null

    if (user) {
        return res.status(200).json({ message: 'Already registered.' });
    }

    const hashedPass = await bcrypt.hash(body.password, 10);
    const newUser = await users.insertOne({email: body.email, password: hashedPass});

    if (newUser.acknowledged) return res.status(200).json({ message: 'User successfully registered.' })
    else return res.status(500).json({ message: 'Something went wrong.' })
}