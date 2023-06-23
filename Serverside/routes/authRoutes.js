const express = require('express')
const router = express.Router();
const { 
    createUser, 
    loginUser, 
    getAllUsers, 
    getUser, 
    deleteUser, 
    updateaUser, 
    blockUser, 
    unblockUser, 
    handleRefreshToken, 
    logOut, 
    updatePassword,
    forgotPasswordToken,
    resetPassword

} = require('../controller/userController');
const {authMiddleware, isAdmin } = require('../middlewares/authMiddleWare');

router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.put('/change-password', authMiddleware, updatePassword)
router.post('/login', loginUser)
router.get('/all-Users', getAllUsers)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logOut)
router.get('/:id', authMiddleware, isAdmin, getUser)
router.delete('/:id', deleteUser)
router.put('/edit-user' , authMiddleware, updateaUser)
router.put('/block-user/:id' , authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id' , authMiddleware, isAdmin, unblockUser)


module.exports = router