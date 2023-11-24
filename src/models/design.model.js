import { Schema, model, models } from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const designCollection = "designs"

const DesignSchema = new Schema(
    {
        pCode: {
            type: String,
          required:true,  
        },
        title: {
            type: String,
            required: [true, "Title required"],
            trim: true,
            maxlength: [80, "title can not be grater than 80 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "title cannot be grater than 500 characters"],
        },
        likes: {
            type: Number,
            default:0
        },
        category: {
            type:String,
        },
        price: Number,
        stock: Number,
        shops: {
            type: Array,
            default:[]
        },
        owner: {
            type: String,
            default:"rafa"
        },
        photo: String,
        secondaryImages: {
            type: Array,
            dafault:[]
        },
        status: {
            type: Boolean,
            default:true,
        }
    },
    {
        timestamps: true
    }
);

DesignSchema.plugin(mongoosePaginate);

export default models.design || model("design", DesignSchema);