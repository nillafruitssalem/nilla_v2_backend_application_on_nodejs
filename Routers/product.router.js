var controllers = require('../Controllers/product.controller');
const upload = require('../Config/multerconfig');
const validateToken = require('../auth/jwt_auth').validateToken;
module.exports = (app) => {
    //  show all products with out jwt token
    app.get('/allproduct_withoutauth', controllers.allproduct_withoutauth);

    //  show all products
    app.get('/allproduct',validateToken, controllers.allproducts);

    //  add Product
    app.post("/addproduct", validateToken, upload.single('file'), controllers.addProduct);

    // update Product
    app.put("/updateproduct/:pid",validateToken, upload.single('file'), controllers.updateProduct);

    // delete Product
    app.delete("/deleteproduct/:pid",validateToken, controllers.deleteproduct);

    // specific  Product
    app.get("/allproduct/:pid", validateToken,controllers.getspecificproduct);
   
}