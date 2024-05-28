const ProductSchema = require('../models/ProductModel')
module.exports.getAllProduct = async(req,res)=>{
    try{
        let products =await ProductSchema.find();
        if(products<0){
            res.status(201).json({error:"database is empty"});
        }else{
            
            res.json(products);
        }
    }catch(error){
        res.status(500).json({error:"database is not exist"})
    }
}

module.exports.getProduct = async(req,res)=>{//false
    const {id} = req.body;
    try{
        let product = await ProductSchema.findById(id);
        if(product){
            res.json(product);
        }else{
            res.status(404).json({ error: "Product not found" });
        }
    }catch(error){
        console.error('Error fetching product:', error);
        res.status(500).json({ error: "An error occurred while fetching the product" });
    }
}


module.exports.createProduct = async(req,res)=>{
    const {id,name,image,category,new_price,old_price,date,available}=req.body;
    try{
        let products = await ProductSchema.find();

        let id;
        if(products.length>0){
            let lastProductArray = products.slice(-1);

            let lastProduct = lastProductArray[0];

            id=lastProduct.id+1; 
        }else{
            id=1;
        }
        const newProduct = await ProductSchema.create({
            id:id,
            name,
            image,
            category,
            new_price,
            old_price,
            date,
            available
        });
        console.log("new Product:",newProduct);
        await newProduct.save();
        res.json({
            success:true,
            name:req.body.name
        })
    }catch(error){
        console.error('Error:', error);
        res.status(500).json({error:"internal server error"});
    }
}



module.exports.removeProduct = async (req, res) => {
    try {
        const product = await ProductSchema.findOneAndDelete({id:req.body.id});
        if (product) {
            console.log("Product deleted:", product);
            res.status(200).json({ message: "Product successfully deleted", product });
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: "An error occurred while deleting the product" });
    }
};

module.exports.updateProduct = async (req, res) => {
    const { id, name, image, category, new_price, old_price, date, available } = req.body;
    try {
        // Chuyển đổi kiểu dữ liệu nếu cần thiết
        const updateData = { //err
            name,
            image,
            category,
            new_price: parseFloat(new_price),
            old_price: parseFloat(old_price),
            date: new Date(date),
            available: Boolean(available)
        };

        const updatedProduct = await ProductSchema.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({error: "Product not found" });
        }
        console.log("Product updated:", updatedProduct);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports.getNewCollections= async (req,res) => {
    let products = await ProductSchema.find({});
    let newcollection = products.slice(1).slice(-8);
    res.send(newcollection);
}

module.exports.getPopularInWomen= async (req,res) => {
    let products = await ProductSchema.find({category:"women"});
    let popularProduct = products.slice(0,4);
    res.send(popularProduct);
}