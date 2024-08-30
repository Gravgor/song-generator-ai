"use client";

import { protectedGetStripePayment } from "@/lib/stripe/dal";
import { useEffect, useState } from "react";
import Stripe from "stripe";

type StripePayment = {
    success: boolean;
    payment: {
        id: string;
        userId: string;
        currency: string;
        paymentIntent: string;
        userCountry: string;
        userEmail: string;
        userName: string;
        amount: number;
        createdAt: Date;
        updatedAt: Date;
    } | null;
};


export default function useStripeWebhook({
    userId
} : {
    userId: string
}) {
    const [lastPayment, setLastPayment] = useState<StripePayment | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        setLoading(true);
        protectedGetStripePayment(userId)
            .then((data) => {
                if (data) {
                    setLastPayment({ success: true, payment: data });
                } else {
                    setLastPayment({ success: false, payment: null });
                }
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [userId]);
    return { lastPayment, error, loading };
}