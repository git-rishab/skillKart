const isRoleAllowed = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    message: 'Access forbidden: Insufficient role privileges'
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
};

module.exports = isRoleAllowed;