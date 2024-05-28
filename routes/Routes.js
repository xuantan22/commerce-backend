const {Router} = require('express')
const {createProduct,removeProduct,updateProduct,getAllProduct,getProduct,getNewCollections,getPopularInWomen} = require('../controllers/ProductsController')
const {Register,Login,AddToCart,RemoveFromCart,GetCart,GetAllUsers,RemoveUser} = require('../controllers/UsersController')
const {fetchUser} = require('../middlewares/UserMiddlewares')
const router = Router();
router.get("/",createProduct);
router.get("/getallproducts",getAllProduct);
router.get("/getproduct",getProduct);
router.post("/addproduct",createProduct);
router.post("/removeproduct",removeProduct);
router.post("/updateproduct",updateProduct);
router.get('/getnewcollections',getNewCollections);
router.get('/getpopularproducts',getPopularInWomen);


//User
router.post('/signup',Register);
router.post('/login',Login);
router.post('/addtocart',fetchUser,AddToCart);
router.post('/removefromcart',fetchUser,RemoveFromCart);
router.post('/getcart',fetchUser,GetCart);
router.get('/getallusers',GetAllUsers)
router.post('/removeuser',RemoveUser)
module.exports = router;