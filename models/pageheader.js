import mongoose from "mongoose";

const PageSchema = mongoose.Schema({
    title: {
        type: String
    },
    img:{
        type:String
    },
})

const Page = mongoose.model("Page", PageSchema)

export default Page;