import {v4 as uuidv4} from "uuid";

const uuid   = () => uuidv4();
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;             // min included, max excluded

export {
    uuid, random
};