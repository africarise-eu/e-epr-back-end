module.exports = {
    APP: {
        port: process.env.PORT,
        env: process.env.NODE_ENV,
    },
    DEFAULT: {
        limit: 10,
        page: 0,
        status: 'Pending',
        candidateType: 'Normal',
    },
    STATUS: {
        archive: 'Archived',
    },
    MATCHING_WEIGHTAGES: {
        EXPERIENCE: 0.4,
        QUALIFICATION: 0.3,
        REQUIRED_SKILLS: 0.2,
        GOOD_TO_HAVE_SKILLS: 0.1,
    },
};
