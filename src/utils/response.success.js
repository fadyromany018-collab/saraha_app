export const successResponse = ({
    res,
    status = 200,
    message = "done",
    data = undefined
} = {}) => {
    // You must pass 'status' inside the parentheses here
    return res.status(status).json({ message, data }); 
};