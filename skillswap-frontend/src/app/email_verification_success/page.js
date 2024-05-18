import React from 'react';

export default function EmailVerificationSuccess() {
    return (
        <div className="container mx-auto p-8 text-center">
            <h1 className="text-3xl font-bold mb-4 text-green-500">Email Verified!</h1>
            <p className="text-lg text-gray-700 mb-4">Your email has been successfully verified for SkillSwap.</p>
        </div>
    );
}
